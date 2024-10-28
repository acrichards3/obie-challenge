import { drizzle } from "drizzle-orm/libsql";
import { env } from "./src/env/env.js";
import { google } from "googleapis";
import { handleAsync } from "./src/utils/handleAsync.js";
import { z } from "zod";
import { csvToJson } from "./src/utils/csv.ts";
import { eq } from "drizzle-orm";
import * as schema from "./src/db/schema.js";

const db = drizzle(env.DB_FILE_NAME);

// This would ideally run on some kind of cron job or trigger depending on how often the google sheet is updating
async function main() {
    // Would ideally have some kind of updating mechanism. Just doing this to save time.
    await dropAllData();

    const googleSheets = google.sheets({ version: "v4" });

    // Metadata used for getting all tabs
    const [metadata, metadataError] = await handleAsync(
        googleSheets.spreadsheets.get({
            key: env.GOOGLE_API_KEY,
            spreadsheetId: env.SPREADSHEET_ID,
        }),
    );

    if (metadataError) throw new Error(metadataError.message);

    // Get all tabs within the Google sheet
    const tabs = metadata?.data.sheets?.map((sheet) => sheet.properties?.title) ?? [];

    // Iterate over each tab and grab all non-empty values
    const sheets = await Promise.all(
        tabs
            .filter((tab) => tab != null)
            .map(async (tab) => {
                const [sheet, error] = await handleAsync(
                    googleSheets.spreadsheets.values.get({
                        key: env.GOOGLE_API_KEY,
                        spreadsheetId: env.SPREADSHEET_ID,
                        range: tab,
                    }),
                );
                return { sheet, error, tab };
            }),
    );

    // Iterate over each sheet and insert data into the db
    await Promise.all(
        sheets.map(async ({ sheet, error, tab }) => {
            if (sheet === null || error) return;

            const sheetValues = sheet.data.values;
            if (sheetValues == null) return;

            const sheetSchema = z.array(z.array(z.union([z.string(), z.undefined()])));
            const validatedSheet = sheetSchema.parse(sheetValues);
            const sheetJson = csvToJson(validatedSheet);

            // First pass, insert the providers, locations, and policies
            await insertLocations(sheetJson[0]); // Locations same in every row so check the first row

            for (const row of sheetJson) {
                await insertProvider(row);
                await insertPolicies(row, tab);
            }

            // Second pass, insert the carriers now that the data is in the db and we can get the IDs
            for (const row of sheetJson) {
                await insertCarriers(row, tab);
            }
        }),
    );
}

// Example:
// { Carrier: 'Allstate', IL: 'Both', IN: 'Both, MI: undefined }

const insertProvider = async (row: Record<string, string | undefined>) => {
    if (row.Carrier == null) return;
    const providerId = await db
        .insert(schema.providers)
        .values({ name: row.Carrier })
        .onConflictDoNothing()
        .returning({ id: schema.providers.id })
        .execute();

    return providerId;
};

const insertLocations = async (row: Record<string, string | undefined>) => {
    const locations = Object.keys(row).filter((key) => key !== "Carrier");

    const locationIds = await db
        .insert(schema.locations)
        .values(locations.map((location) => ({ name: location })))
        .onConflictDoNothing()
        .returning({ id: schema.locations.id })
        .execute();

    return locationIds;
};

const insertPolicies = async (row: Record<string, string | undefined>, tab: string) => {
    const policies = new Set<string>();

    for (const key in row) {
        if (row[key] == null) continue;
        if (key === "Carrier") continue;

        if (row[key].toLowerCase() === "yes") {
            policies.add(tab.toUpperCase());
            continue;
        }

        if (row[key].toLowerCase() === "no" || row[key].toLowerCase() === "both") {
            continue;
        }

        policies.add(row[key].toUpperCase());
    }

    if (policies.size === 0) return;

    const policyIds = await db
        .insert(schema.policies)
        .values(Array.from(policies).map((policy) => ({ name: policy })))
        .onConflictDoNothing()
        .returning({ id: schema.policies.id })
        .execute();

    return policyIds;
};

const insertCarriers = async (row: Record<string, string | undefined>, tab: string) => {
    if (!row.Carrier) return;

    // Get the provider ID for the carrier
    const providerResult = await db
        .select({ id: schema.providers.id })
        .from(schema.providers)
        .where(eq(schema.providers.name, row.Carrier))
        .execute();
    const providerId = providerResult[0]?.id; // Extract provider ID

    if (!providerId) return; // Skip if provider ID is not found

    for (const key in row) {
        if (!row[key] || key === "Carrier") continue;

        // Get the location ID for each location in the row
        const locationResult = await db
            .select({ id: schema.locations.id })
            .from(schema.locations)
            .where(eq(schema.locations.name, key))
            .execute();
        const locationId = locationResult[0]?.id; // Extract location ID

        // Determine policy name(s) based on cell value
        let policyNames: string[] = [];
        if (row[key].toLowerCase() === "yes") {
            policyNames = [tab.toUpperCase()];
        } else if (row[key].toLowerCase() === "both") {
            policyNames = tab.split("/").map((part) => part.toUpperCase());
        } else {
            policyNames = [row[key].toUpperCase()];
        }

        for (const policyName of policyNames) {
            // Get the policy ID for each policy
            const policyResult = await db
                .select({ id: schema.policies.id })
                .from(schema.policies)
                .where(eq(schema.policies.name, policyName))
                .execute();
            const policyId = policyResult[0]?.id; // Extract policy ID

            // If any ID is missing, skip this entry
            if (!locationId || !policyId) continue;

            // Insert into carriers table with valid providerId, locationId, and policyId
            await db
                .insert(schema.carriers)
                .values({
                    providerId,
                    locationId,
                    policyId,
                })
                .onConflictDoNothing() // Avoid duplicate entries if necessary
                .execute();
        }
    }
};

// * Would ideally have some kind of updating mechanism instead of this. Just doing this to save time.
const dropAllData = async () => {
    await db.delete(schema.carriers).execute();
    await db.delete(schema.providers).execute();
    await db.delete(schema.policies).execute();
    await db.delete(schema.locations).execute();
};

main();
