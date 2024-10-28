import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    DB_FILE_NAME: z.string(),
    GOOGLE_API_KEY: z.string(),
    SPREADSHEET_ID: z.string(),
});

export const env = envSchema.parse(process.env);
