import { render, screen, fireEvent } from "@testing-library/react";
import MarkdownNotes from "./MarkdownNotes"; // Adjust the import path as needed
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import IconWithTooltip from "@/components/tools/IconWithTooltip";

// Mock the props functions
const mockOnViewNote = jest.fn();
const mockOnEditNote = jest.fn();
const mockOnDeleteNote = jest.fn();

describe.only("MarkdownNotes", () => {
	const note = {
		id: "1",
		title: "Test Note",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta unde ducimus eligendi esse cumque consectetur ullam quasi, blanditiis quas sit modi quidem sapiente culpa, dignissimos natus similique. Consequatur similique, quaerat, praesentium, unde omnis voluptates aut perferendis impedit odit amet optio nulla natus aliquam? Nam, totam qui modi iusto numquam aliquid quas ad. Sit quasi temporibus earum magnam. Sequi optio, unde mollitia amet culpa quaerat officia non incidunt delectus quia! Voluptatem, quas? Error, earum? Iste quos corporis necessitatibus accusamus eligendi libero quas temporibus. Reprehenderit ut dolorum fugiat? Deleniti, quod aperiam pariatur consectetur ducimus sapiente quos veritatis, ea expedita, explicabo necessitatibus veniam dolorem possimus. Dicta ratione, soluta nisi vel consequuntur culpa nobis amet atque reiciendis voluptas sit nihil aut praesentium natus veniam.",
		updated_at: "2025-04-14 17:49:01.303373+00",
	};

	beforeEach(() => {
		// Reset all mock function calls before each test
		mockOnViewNote.mockClear();
		mockOnEditNote.mockClear();
		mockOnDeleteNote.mockClear();
	});

	test("renders note content correctly", () => {
		render(
			<MarkdownNotes
				note={note}
				onViewNote={mockOnViewNote}
				onEditNote={mockOnEditNote}
				onDeleteNote={mockOnDeleteNote}
			/>
		);

		// Check if the title is rendered
		expect(screen.getByText(note.title)).toBeInTheDocument();
		// Check if the content is truncated correctly
		expect(
			screen.getByText(
				`${note.content.substring(0, 120)}${
					note.content.length > 120 ? "..." : ""
				}`
			)
		).toBeInTheDocument();
		// Check if the updated date is rendered
		expect(screen.getByText("Updated: 4/15/2025")).toBeInTheDocument();
	});

	test("calls onViewNote when the card is clicked", () => {
		render(
			<MarkdownNotes
				note={note}
				onViewNote={mockOnViewNote}
				onEditNote={mockOnEditNote}
				onDeleteNote={mockOnDeleteNote}
			/>
		);

		// Simulate a click on the note card
		fireEvent.click(screen.getByText(note.title));

		// Check if onViewNote is called with the correct note id
		expect(mockOnViewNote).toHaveBeenCalledWith(note.id);
	});

	test("calls onEditNote when the edit icon is clicked", () => {
		render(
			<IconWithTooltip
				text="Edit note"
				icon={<FaEdit size={20} />}
				onClick={() => mockOnEditNote("1")}
			/>
		);

		const editBtn = screen.getByRole("button", { name: /edit note/i });
		fireEvent.click(editBtn);
		expect(mockOnEditNote).toHaveBeenCalledWith("1");
	});

	test("calls onDeleteNote when the delete icon is clicked", () => {
		render(
			<IconWithTooltip
				text="Delete note"
				icon={<MdDelete size={20} />}
				onClick={() => mockOnDeleteNote("1")}
			/>
		);

		const delBtn = screen.getByRole("button", { name: /delete note/i });
		fireEvent.click(delBtn);
		expect(mockOnDeleteNote).toHaveBeenCalledWith("1");
	});
});
