import { Policy } from "~/src/routes/policy";
import { handleAsync } from "~/src/utils/handleAsync";
import type { Context } from "hono";

jest.mock("~/src/utils/handleAsync.ts");

describe("Policy endpoint", () => {
    const mockContext = {
        db: {
            select: jest.fn().mockReturnValue({
                from: jest.fn().mockReturnValue({
                    execute: jest.fn(),
                }),
            }),
        },
        schema: { policies: { id: "id", name: "name" } },
        json: jest.fn(),
    } as unknown as Context;

    const mockNext = jest.fn();

    test("should return policies on successful fetch", async () => {
        (handleAsync as jest.Mock).mockResolvedValueOnce([[{ id: 1, policies: "Test Policy" }], null]);

        await Policy.routes[0].handler(mockContext, mockNext);

        expect(mockContext.json).toHaveBeenCalledWith([{ id: 1, policies: "Test Policy" }]);
    });

    test("should return error on failed fetch", async () => {
        (handleAsync as jest.Mock).mockResolvedValueOnce([null, new Error("DB Error")]);

        await Policy.routes[0].handler(mockContext, mockNext);

        expect(mockContext.json).toHaveBeenCalledWith({ error: "Error fetching policies" }, 500);
    });
});
