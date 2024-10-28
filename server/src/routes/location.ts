import { Hono } from "hono";
import { handleAsync } from "../utils/handleAsync";

export const Location = new Hono();

Location.get("/", async (c) => {
    const [db, schema] = [c.db, c.schema];

    const [locations, error] = await handleAsync(
        db
            .select({
                id: schema.locations.id,
                location: schema.locations.name,
            })
            .from(schema.locations)
            .execute(),
    );

    if (error) {
        return c.json({ error: "Error fetching locations" }, 500);
    }

    return c.json(locations);
});
