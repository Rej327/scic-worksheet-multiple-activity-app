import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NoteDetail from "./NoteDetail"; // Adjust the import path if necessary
import { Note, NoteDetailProps } from "@/types/notes";

// Mock FaDrawPolygon and FaEye icons
jest.mock("react-icons/fa", () => ({
	FaDrawPolygon: () => <span>FaDrawPolygon</span>,
	FaEye: () => <span>FaEye</span>,
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

const mockNote: Note = {
	id: "1",
	title: "Sample Note",
	content: "**Serialized Markdown**",
	created_at: "2025-04-01T00:00:00Z",
	updated_at: "2025-04-05T00:00:00Z",
	user_id: "1",
};

describe("NoteDetail Component", () => {
	it("renders the note details correctly", async () => {
		render(
			<NoteDetail
				note={mockNote}
				onEdit={jest.fn()}
				onClose={jest.fn()}
			/>
		);

		// Check if the title, created and updated dates are rendered
		expect(screen.getByText(/Created:/)).toBeInTheDocument();
		expect(screen.getByText(/Updated:/)).toBeInTheDocument();
	});

	it("toggles between preview and raw mode", async () => {
		render(
			<NoteDetail
				note={mockNote}
				onEdit={jest.fn()}
				onClose={jest.fn()}
			/>
		);

		// Initially, the preview mode should be displayed
		expect(screen.getByText("FaEye")).toBeInTheDocument();
		expect(screen.getByText("Preview")).toBeInTheDocument();

		// Switch to raw mode by clicking the Raw button
		fireEvent.click(screen.getByText("Raw"));

		// Check that raw content is now displayed
		expect(screen.getByText("**Serialized Markdown**")).toBeInTheDocument();
		expect(screen.getByText("FaDrawPolygon")).toBeInTheDocument();

		// Switch back to preview mode
		fireEvent.click(screen.getByText("Preview"));

		// Check that serialized content is displayed again
		await waitFor(() =>
			expect(screen.getByText("Serialized Markdown")).toBeInTheDocument()
		);
	});

	it("calls onClose and onEdit when buttons are clicked", async () => {
		const onCloseMock = jest.fn();
		const onEditMock = jest.fn();

		render(
			<NoteDetail
				note={mockNote}
				onEdit={onEditMock}
				onClose={onCloseMock}
			/>
		);

		// Simulate clicking the Close button
		fireEvent.click(screen.getByText("Close"));
		expect(onCloseMock).toHaveBeenCalled();

		// Simulate clicking the Edit Note button
		fireEvent.click(screen.getByText("Edit Note"));
		expect(onEditMock).toHaveBeenCalled();
	});
});
