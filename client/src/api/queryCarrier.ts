import { z } from "zod";
import { API_URL } from "~/utils/constants";

const carrierSchema = z.array(
    z.object({
        providerId: z.number(),
        providerName: z.string(),
    }),
);

/**
 * Get a list of carriers based on the location and policy ids
 * @param locationIds - The location ids
 * @param policyIds - The policy ids
 * @returns - A list of carriers based on the location and policy ids
 */
export const queryCarrier = async (locationIds: number[], policyIds: number[]) => {
    const query = new URLSearchParams();
    query.set("locationIds", locationIds.join(","));
    query.set("policyIds", policyIds.join(","));

    const endpoint = `${API_URL}/carrier?${query.toString()}`;

    const response = await fetch(endpoint, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
    });

    const data: unknown = await response.json();
    const validatedData = await carrierSchema.parseAsync(data);

    const providers = new Set<string>();

    for (const provider of validatedData) {
        providers.add(provider.providerName);
    }

    return Array.from(providers).map((providerName) => providerName);
};
