import React from "react";
import Home from "~/components/home/Home";
import { useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

jest.mock("~/assets/images/logo-color.svg", () => "mocked-svg");

describe("Home", () => {
    test("renders the Home component", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: [{ id: 1, name: "Option 1" }],
            isLoading: false,
            isError: false,
        });

        render(<Home />);

        // Check if the logo button is rendered
        const logoButton = screen.getByRole("link", { name: /Go to Obie Insurance home page/i });
        expect(logoButton).toBeInTheDocument();
    });
});
