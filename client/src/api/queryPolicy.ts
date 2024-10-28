import { z } from "zod";
import { API_URL } from "~/utils/constants";

const policySchema = z.array(
    z.object({
        id: z.number(),
        policy: z.string(),
    }),
);

/**
 * Query policy options from the Google Sheet
 * @returns - A list of all policies and their IDs
 */
export const queryPolicy = async () => {
    const endpoint = `${API_URL}/policy`;

    const response = await fetch(endpoint, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
    });

    const data: unknown = await response.json();
    return await policySchema.parseAsync(data);
};
