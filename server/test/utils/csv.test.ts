import { csvToJson } from "~/src/utils/csv";

describe("CSV Utils", () => {
    test("should return a csv string", () => {
        const csvData = [
            ["name", "age", "city"],
            ["Alice", "25", "New York"],
            ["Bob", undefined, "Los Angeles"],
            ["Charlie", "35", undefined],
        ];

        const expectedJson = [
            { name: "Alice", age: "25", city: "New York" },
            { name: "Bob", age: undefined, city: "Los Angeles" },
            { name: "Charlie", age: "35", city: undefined },
        ];

        const result = csvToJson(csvData);
        expect(result).toEqual(expectedJson);
    });
});
