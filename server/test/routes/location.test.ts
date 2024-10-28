import { Location } from "~/src/routes/location";
import { handleAsync } from "~/src/utils/handleAsync";
import type { Context } from "hono";

jest.mock("~/src/utils/handleAsync.ts");

describe("Location endpoint", () => {
    const mockContext = {
        db: {
            select: jest.fn().mockReturnValue({
                from: jest.fn().mockReturnValue({
                    execute: jest.fn(),
                }),
            }),
        },
        schema: { locations: { id: "id", name: "name" } },
        json: jest.fn(),
    } as unknown as Context;

    const mockNext = jest.fn();

    test("should return locations on successful fetch", async () => {
        (handleAsync as jest.Mock).mockResolvedValueOnce([[{ id: 1, location: "Test Location" }], null]);

        await Location.routes[0].handler(mockContext, mockNext);

        expect(mockContext.json).toHaveBeenCalledWith([{ id: 1, location: "Test Location" }]);
    });

    test("should return error on failed fetch", async () => {
        (handleAsync as jest.Mock).mockResolvedValueOnce([null, new Error("DB Error")]);

        await Location.routes[0].handler(mockContext, mockNext);

        expect(mockContext.json).toHaveBeenCalledWith({ error: "Error fetching locations" }, 500);
    });
});
