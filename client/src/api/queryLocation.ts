import { z } from "zod";
import { API_URL } from "~/utils/constants";

const locationSchema = z.array(
    z.object({
        id: z.number(),
        location: z.string(),
    }),
);

/**
 * Query locations from the Google Sheet
 * @returns - A list of all locations and their IDs
 */
export const queryLocation = async () => {
    const endpoint = `${API_URL}/location`;

    const response = await fetch(endpoint, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
    });

    const data: unknown = await response.json();
    return await locationSchema.parseAsync(data);
};
