import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import MarkdownEditor from "./MarkdownEditor";

// Properly mock serialize from next-mdx-remote/serialize
jest.mock("next-mdx-remote/serialize", () => ({
	serialize: jest.fn(() =>
		Promise.resolve({
			compiledSource: "Serialized Markdown",
			scope: {},
			frontmatter: {},
		})
	),
}));

// Properly mock MDXRemote from next-mdx-remote
jest.mock("next-mdx-remote", () => ({
	MDXRemote: () => <div data-testid="preview-content">Serialized Markdown</div>,
}));

// Mock toast functions (success and error)
jest.mock("react-hot-toast", () => ({
	success: jest.fn(),
	error: jest.fn(),
}));

describe("MarkdownEditor", () => {
	const mockOnSave = jest.fn();
	const mockOnCancel = jest.fn();

	beforeEach(() => {
		localStorage.clear();
		jest.clearAllMocks(); // Reset all mocks including toast
	});

	it("renders title and content inputs", () => {
		render(<MarkdownEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
		expect(screen.getByTestId("note-title")).toBeInTheDocument();
		expect(screen.getByTestId("note-content")).toBeInTheDocument();
	});

	it("allows input in title and content", () => {
		render(<MarkdownEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

		fireEvent.change(screen.getByTestId("note-title"), {
			target: { value: "My Title" },
		});
		fireEvent.change(screen.getByTestId("note-content"), {
			target: { value: "Some content in markdown" },
		});

		expect(screen.getByTestId("note-title")).toHaveValue("My Title");
		expect(screen.getByTestId("note-content")).toHaveValue(
			"Some content in markdown"
		);
	});

	it("toggles between edit and preview modes", async () => {
		render(<MarkdownEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

		const previewBtn = screen.getByText("Preview");
		fireEvent.click(previewBtn);

		// Preview should show serialized markdown
		await waitFor(() => {
			expect(screen.getByTestId("preview-content")).toBeInTheDocument();
		});

		const editBtn = screen.getByText("Edit");
		fireEvent.click(editBtn);

		await waitFor(() => {
			expect(screen.getByTestId("note-content")).toBeInTheDocument();
		});
	});

	it("validates inputs and shows error messages", async () => {
		render(<MarkdownEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

		fireEvent.click(screen.getByTestId("save-button"));

		await waitFor(() => {
			expect(screen.getByText("* Title is required.")).toBeInTheDocument();
			expect(screen.getByText("* Content is required.")).toBeInTheDocument();
		});
	});

	it("calls onSave when form is valid", async () => {
		render(<MarkdownEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

		fireEvent.change(screen.getByTestId("note-title"), {
			target: { value: "Valid Title" },
		});
		fireEvent.change(screen.getByTestId("note-content"), {
			target: { value: "This is valid markdown content" },
		});

		fireEvent.click(screen.getByTestId("save-button"));

		await waitFor(() => {
			expect(mockOnSave).toHaveBeenCalledWith(
				"Valid Title",
				"This is valid markdown content"
			);
		});
	});

	it("calls onCancel when cancel button is clicked", () => {
		render(<MarkdownEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
		fireEvent.click(screen.getByTestId("cancel-button"));
		expect(mockOnCancel).toHaveBeenCalled();
	});
});
