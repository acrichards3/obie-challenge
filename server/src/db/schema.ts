import { int, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const carriers = sqliteTable("carriers", {
    id: int().primaryKey({ autoIncrement: true }),
    providerId: int()
        .references(() => providers.id)
        .notNull(),
    policyId: int()
        .references(() => policies.id)
        .notNull(),
    locationId: int()
        .references(() => locations.id)
        .notNull(),
});

export const providers = sqliteTable(
    "providers",
    {
        id: int().primaryKey({ autoIncrement: true }),
        name: text().notNull(),
    },
    (providers) => ({
        uniqueProviderName: uniqueIndex("unique_provider_name").on(providers.name),
    }),
);

export const policies = sqliteTable(
    "policies",
    {
        id: int().primaryKey({ autoIncrement: true }),
        name: text().notNull(),
    },
    (policies) => ({
        uniquePolicyName: uniqueIndex("unique_policy_name").on(policies.name),
    }),
);

export const locations = sqliteTable(
    "locations",
    {
        id: int().primaryKey({ autoIncrement: true }),
        name: text().notNull(),
    },
    (locations) => ({
        uniqueLocationName: uniqueIndex("unique_location_name").on(locations.name),
    }),
);
