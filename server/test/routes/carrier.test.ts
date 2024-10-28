import { Carrier } from "~/src/routes/carrier";
import { handleAsync } from "~/src/utils/handleAsync";
import { Context } from "hono";

jest.mock("~/src/utils/handleAsync.ts");

describe("Carrier endpoint", () => {
    const mockContext = {
        db: {
            select: jest.fn().mockReturnValue({
                from: jest.fn().mockReturnValue({
                    innerJoin: jest.fn().mockReturnValue({
                        where: jest.fn().mockReturnValue({
                            execute: jest.fn(),
                        }),
                    }),
                }),
            }),
        },
        schema: {
            providers: { id: "id", name: "name" },
            carriers: { providerId: "providerId", locationId: "locationId", policyId: "policyId" },
        },
        req: {
            query: jest.fn(),
        },
        json: jest.fn(),
    } as unknown as Context;

    const mockNext = jest.fn();
    const mockedHandleAsync = handleAsync as jest.MockedFunction<typeof handleAsync>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return carriers on successful fetch", async () => {
        const locationIds = [1, 2];
        const policyIds = [10, 20];

        // Mock query params
        mockContext.req.query = jest
            .fn()
            .mockImplementationOnce((param) => (param === "locationIds" ? locationIds.join(",") : undefined))
            .mockImplementationOnce((param) => (param === "policyIds" ? policyIds.join(",") : undefined));

        // Mock successful database fetch
        const carriers = [{ providerId: 1, providerName: "Carrier A" }];
        mockedHandleAsync.mockResolvedValueOnce([carriers, null]);

        await Carrier.routes[0].handler(mockContext, mockNext);

        // Check that response contains fetched carriers
        expect(mockContext.json).toHaveBeenCalledWith(carriers);
    });

    test("should return 400 if locationIds or policyIds are missing", async () => {
        mockContext.req.query = jest.fn().mockReturnValue(null); // Simulate missing params

        await Carrier.routes[0].handler(mockContext, mockNext);

        expect(mockContext.json).toHaveBeenCalledWith({ error: "locationIds and policyIds required" }, 400);
    });

    test("should return 400 if locationIds or policyIds contain non-numeric values", async () => {
        mockContext.req.query = jest
            .fn()
            .mockImplementationOnce((param) => (param === "locationIds" ? "1,foo" : undefined))
            .mockImplementationOnce((param) => (param === "policyIds" ? "10,bar" : undefined));

        await Carrier.routes[0].handler(mockContext, mockNext);

        expect(mockContext.json).toHaveBeenCalledWith({ error: "locationIds and policyIds must be numbers" }, 400);
    });

    test("should return 500 if database fetch fails", async () => {
        const locationIds = [1, 2];
        const policyIds = [10, 20];

        // Mock valid query params
        mockContext.req.query = jest
            .fn()
            .mockImplementationOnce((param) => (param === "locationIds" ? locationIds.join(",") : undefined))
            .mockImplementationOnce((param) => (param === "policyIds" ? policyIds.join(",") : undefined));

        // Simulate a database error
        mockedHandleAsync.mockResolvedValueOnce([null, new Error("DB Error")]);

        await Carrier.routes[0].handler(mockContext, mockNext);

        expect(mockContext.json).toHaveBeenCalledWith({ error: "Error fetching carriers" }, 500);
    });
});
