/**
 * Converts CSV data to JSON
 * @param data - CSV data as a 2D array, with each cell being either a string or undefined
 * @returns - JSON data
 */
export const csvToJson = (data: (string | undefined)[][]): Record<string, string | undefined>[] => {
    const csv = data
        .map((row) =>
            row
                .map((cell) => (cell === undefined ? "" : cell)) // Convert undefined to empty strings for CSV formatting
                .join(","),
        )
        .join("\n");

    const [headerLine, ...lines] = csv.trim().split("\n");
    const headers = headerLine.split(",");

    return lines.map((line) => {
        const values = line.split(",");
        const row: Record<string, string | undefined> = {};

        headers.forEach((header, index) => {
            row[header] = values[index] !== "" ? values[index] : undefined; // Convert empty strings back to undefined
        });

        return row;
    });
};
