import { Hono } from "hono";
import { handleAsync } from "../utils/handleAsync";

export const Policy = new Hono();

Policy.get("/", async (c) => {
    const [db, schema] = [c.db, c.schema];

    const [policies, error] = await handleAsync(
        db
            .select({
                id: schema.policies.id,
                policy: schema.policies.name,
            })
            .from(schema.policies)
            .execute(),
    );

    if (error) {
        return c.json({ error: "Error fetching policies" }, 500);
    }

    return c.json(policies);
});
