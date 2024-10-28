import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { HTTPException } from "hono/http-exception";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "./env/env";
import * as schema from "./db/schema";

// Import routes
import { Carrier } from "./routes/carrier";
import { Location } from "./routes/location";
import { Policy } from "./routes/policy";

export const db = drizzle(env.DB_FILE_NAME);

// Add the db and schema to the context
declare module "hono" {
    interface Context {
        db: typeof db;
        schema: typeof schema;
    }
}

const app = new Hono();

// Middleware to add db to the context
app.use("*", async (c, next) => {
    c.db = db;
    c.schema = schema;
    await next();
});

// Prevent CORS errors on the frontend
app.use("*", cors({ credentials: true, origin: "http://localhost:5173" }));

// Error handling
app.notFound((c) => {
    return c.json({ error: "Not found" }, 404);
});

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return c.json({ error: err.message }, err.status);
    }

    return c.json({ error: "Internal server error" }, 500);
});

// *Add additional routes here*
app.route("/api/carrier", Carrier);
app.route("/api/location", Location);
app.route("/api/policy", Policy);

// Start the server
const port = 3005;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
});
