import React from "react";
import Dropdown, { type DropdownOption } from "~/components/common/Dropdown";
import { render, screen } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { MultiSelect } from "react-multi-select-component";

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

jest.mock("react-multi-select-component", () => ({
    MultiSelect: jest.fn(() => <div data-testid="multi-select" />),
}));

describe("Dropdown", () => {
    const mockQueryFn = jest.fn().mockResolvedValue([{ id: 1, name: "Option 1" }]);
    const mockSetSelected = jest.fn();
    const defaultProps = {
        labelledBy: "dropdown",
        label: "Select options",
        labelKey: "name",
        queryFn: mockQueryFn,
        queryKey: ["dropdown"],
        selected: [] as DropdownOption[],
        setSelected: mockSetSelected,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders MultiSelect component", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: [{ id: 1, name: "Option 1" }],
            isLoading: false,
            isError: false,
        });

        render(<Dropdown {...defaultProps} />);

        expect(screen.getByTestId("multi-select")).toBeInTheDocument();
    });

    test("disables MultiSelect when loading", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        });

        render(<Dropdown {...defaultProps} />);

        expect(MultiSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                disabled: true,
            }),
            {},
        );
    });

    test("disables MultiSelect and shows error label when error occurs", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });

        render(<Dropdown {...defaultProps} />);

        expect(MultiSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                disabled: true,
                overrideStrings: { selectSomeItems: "Error loading items" },
            }),
            {},
        );
    });

    test("passes options to MultiSelect when data is loaded", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: [{ id: 1, name: "Option 1" }],
            isLoading: false,
            isError: false,
        });

        render(<Dropdown {...defaultProps} />);

        expect(MultiSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                options: [{ label: "Option 1", value: 1 }],
            }),
            {},
        );
    });
});
