import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "./Dashboard";

jest.mock("next/link", () => {
	return ({ children }: { children: React.ReactNode }) => children;
});

describe("Dashboard", () => {
	it("renders all secret pages with correct titles", () => {
		render(<Dashboard />);

		expect(screen.getByText("Dashboard")).toBeInTheDocument();

		const titles = [
			"Todo List",
			"Google Drive 'Lite'",
			"Food Review",
			"Pokemon Review App",
			"Markdown Notes App",
		];

		titles.forEach((title) => {
			expect(screen.getByText(title)).toBeInTheDocument();
		});
	});
});
