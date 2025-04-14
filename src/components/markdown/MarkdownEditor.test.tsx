import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MarkdownEditor from "./MarkdownEditor"; // Adjust path if needed

// Mock react-icons used in the component
jest.mock("react-icons/fa", () => ({
	FaDrawPolygon: () => <span>FaDrawPolygon</span>,
	FaEye: () => <span>FaEye</span>,
	FaEdit: () => <span>FaEdit</span>,
}));

// Properly mock MDXRemote and serialize
jest.mock("next-mdx-remote/serialize", () => ({
	serialize: jest.fn(() =>
		Promise.resolve({
			compiledSource: "Serialized Markdown",
			scope: {},
			frontmatter: {},
		})
	),
}));

jest.mock("next-mdx-remote", () => ({
	MDXRemote: () => <div>Serialized Markdown</div>,
}));

// Mock toast functions
jest.mock("react-hot-toast", () => ({
	success: jest.fn(),
	error: jest.fn(),
}));

describe("MarkdownEditor Component", () => {
	it("renders and submits a valid note", async () => {
		const mockSave = jest.fn();
		const mockCancel = jest.fn();

		render(
			<MarkdownEditor
				initialTitle="Test Title"
				initialContent="This is **markdown** content."
				onSave={mockSave}
				onCancel={mockCancel}
			/>
		);

		fireEvent.change(screen.getByTestId("note-title"), {
			target: { value: "Updated Title" },
		});

		fireEvent.change(screen.getByTestId("note-content"), {
			target: { value: "Updated **markdown** content" },
		});

		fireEvent.click(screen.getByTestId("save-button"));

		await waitFor(() =>
			expect(mockSave).toHaveBeenCalledWith(
				"Updated Title",
				"Updated **markdown** content"
			)
		);
	});

	it("shows validation errors for empty inputs", async () => {
		const mockSave = jest.fn();
		const mockCancel = jest.fn();

		render(<MarkdownEditor onSave={mockSave} onCancel={mockCancel} />);

		fireEvent.click(screen.getByTestId("save-button"));

		expect(await screen.findByText("* Title is required.")).toBeInTheDocument();
		expect(await screen.findByText("* Content is required.")).toBeInTheDocument();
	});

	it("toggles between edit and preview mode", async () => {
		const mockSave = jest.fn();
		const mockCancel = jest.fn();

		render(
			<MarkdownEditor
				initialTitle="Test"
				initialContent="Hello world"
				onSave={mockSave}
				onCancel={mockCancel}
			/>
		);

		fireEvent.click(screen.getByText("Preview"));

		await waitFor(() =>
			expect(screen.getByText("Serialized Markdown")).toBeInTheDocument()
		);

		fireEvent.click(screen.getByText("Edit"));

		expect(screen.getByTestId("note-content")).toBeInTheDocument();
	});
});
