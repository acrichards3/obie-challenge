import { Hono } from "hono";
import { handleAsync } from "../utils/handleAsync";
import { and, eq, inArray } from "drizzle-orm";

export const Carrier = new Hono();

Carrier.get("/", async (c) => {
    const [db, schema] = [c.db, c.schema];
    const locationIds = c.req.query("locationIds")?.split(",").map(Number);
    const policyIds = c.req.query("policyIds")?.split(",").map(Number);

    // Make sure locationIds and policyIds are provided
    if (!locationIds || !policyIds) {
        return c.json({ error: "locationIds and policyIds required" }, 400);
    }

    // Make sure locationIds and policyIds are number arrays
    if (locationIds.some(isNaN) || policyIds.some(isNaN)) {
        return c.json({ error: "locationIds and policyIds must be numbers" }, 400);
    }

    const [result, error] = await handleAsync(
        db
            .select({
                providerId: schema.providers.id,
                providerName: schema.providers.name,
            })
            .from(schema.carriers)
            .innerJoin(schema.providers, eq(schema.providers.id, schema.carriers.providerId))
            .where(and(inArray(schema.carriers.locationId, locationIds), inArray(schema.carriers.policyId, policyIds)))
            .execute(),
    );

    if (error) {
        return c.json({ error: "Error fetching carriers" }, 500);
    }

    return c.json(result);
});
