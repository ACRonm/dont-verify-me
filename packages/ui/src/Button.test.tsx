import React from "react";
import { render, screen } from "@testing-library/react";
import { CustomButton } from "./CustomButton";

// Mock tamagui to avoid issues with its internal dependencies in a JSDOM environment
jest.mock("tamagui", () => ({
	Button: ({ children }: { children: React.ReactNode }) => (
		<button>{children}</button>
	),
}));

describe("CustomButton", () => {
	it("renders the button with the correct text", () => {
		render(<CustomButton>Click Me</CustomButton>);
		expect(
			screen.getByRole("button", { name: /click me/i })
		).toBeInTheDocument();
	});
});
