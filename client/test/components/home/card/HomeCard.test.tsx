import React from "react";
import HomeCard from "~/components/home/card/HomeCard";
import { render, screen } from "@testing-library/react";

describe("HomeCard", () => {
    test("renders header and children", () => {
        render(
            <HomeCard header="Test Header">
                <div>Test Content</div>
            </HomeCard>,
        );

        expect(screen.getByText("Test Header")).toBeInTheDocument();
        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
});
