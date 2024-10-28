import { handleAsync } from "~/src/utils/handleAsync";

describe("handleAsync", () => {
    test("should return result and null error for a resolved promise", async () => {
        const mockData = "test data";
        const promise = Promise.resolve(mockData);

        const [result, error] = await handleAsync(promise);

        expect(result).toBe(mockData);
        expect(error).toBeNull();
    });

    test("should return null result and an error for a rejected promise", async () => {
        const mockError = new Error("test error");
        const promise = Promise.reject(mockError);

        const [result, error] = await handleAsync(promise);

        expect(result).toBeNull();
        expect(error).toBe(mockError);
    });

    test("should return a generic error for non-Error rejection values", async () => {
        const mockError = "string error";
        const promise = Promise.reject(mockError);

        const [result, error] = await handleAsync(promise);

        expect(result).toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toBe(mockError);
    });
});
