import React from "react";
import Providers from "~/components/home/providers/Providers";
import { render, screen } from "@testing-library/react";

describe("Providers", () => {
    test("renders message when providers is null", () => {
        render(<Providers providers={null} />);
        expect(
            screen.getByText("Choose locations and policy types to view a list of available providers"),
        ).toBeInTheDocument();
    });
});
