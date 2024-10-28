type AsyncResponse<T> = [T | null, Error | null];

/**
 * Handle async functions and return a tuple with the result and the error
 * @param promise - The promise to handle
 * @returns - A tuple with the result and the error
 */
export const handleAsync = async <T>(promise: Promise<T>): Promise<AsyncResponse<T>> => {
    try {
        return [await promise, null] satisfies AsyncResponse<T>;
    } catch (error) {
        if (error instanceof Error) return [null, error];

        return [null, new Error(String(error))];
    }
};
