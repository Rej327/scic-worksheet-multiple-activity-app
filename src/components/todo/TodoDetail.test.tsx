import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoDetail from "./TodoDetail"; // Adjust the import path if necessary
import { Note } from "@/types/notes";

// Mock FaDrawPolygon and FaEye icons
jest.mock("react-icons/fa", () => ({
  FaEye: () => <span>FaEye</span>,
}));


const mockNote: Note = {
  id: "1",
  title: "Sample Note",
  content: "**Serialized Markdown**",
  created_at: "2025-04-01T00:00:00Z",
  updated_at: "2025-04-05T00:00:00Z",
  user_id: "1",
};

describe.only("TodoDetail", () => {
  it("renders the note details correctly", async () => {
    render(
      <TodoDetail
        note={mockNote}
        onEdit={jest.fn()}
        onClose={jest.fn()}
      />
    );

    // Check if the title, created and updated dates are rendered
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.getByText(/Updated:/)).toBeInTheDocument();
  });

  it("calls onClose and onEdit when buttons are clicked", async () => {
    const onCloseMock = jest.fn();
    const onEditMock = jest.fn();

    render(
      <TodoDetail
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
