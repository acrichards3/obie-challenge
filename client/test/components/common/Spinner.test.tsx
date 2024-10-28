import React from "react";
import Spinner from "~/components/common/Spinner";
import { render } from "@testing-library/react";

describe("Spinner", () => {
    test("renders the spinner with correct aria-label", () => {
        const { getByLabelText } = render(<Spinner size={50} />);
        const spinner = getByLabelText("spinner");

        expect(spinner).toBeInTheDocument();
        expect(spinner).toBeVisible();
    });
});
