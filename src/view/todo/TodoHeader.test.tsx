import { render, screen, fireEvent } from "@testing-library/react";
import TodoHeader from "./TodoHeader";
import MarkdownHeader from "../markdown/MarkDownHeader";
// Mock functions for props
const mockSetSearchQuery = jest.fn();
const mockOpenCreateModal = jest.fn();

describe.only("TodoHeader", () => {
  beforeEach(() => {
    // Reset mock functions before each test
    mockSetSearchQuery.mockClear();
    mockOpenCreateModal.mockClear();
  });

  test("renders MarkDownHeader with correct elements", () => {
    const searchQuery = "test query";

    // Render the Header component with the mock functions and test data
    render(
      <TodoHeader
        searchQuery={searchQuery}
        setSearchQuery={mockSetSearchQuery}
        openCreateModal={mockOpenCreateModal}
      />
    );

    // Check if the title is rendered
    expect(screen.getByText("TaskTrack")).toBeInTheDocument();

    // Check if the search input is rendered and has the correct value
    const searchInput = screen.getByPlaceholderText("🔍 Search notes...");
    expect(searchInput).toHaveValue(searchQuery);

    // Check if the "New Note" button is rendered
    const newNoteButton = screen.getByRole("button");
    expect(newNoteButton).toBeInTheDocument();

    // Check if the tooltip is shown when hovering over the button
    fireEvent.mouseOver(newNoteButton);
    expect(screen.getByText("New Note")).toBeInTheDocument();
  });

  test("calls openCreateModal when the 'New Note' button is clicked", () => {
    const searchQuery = "test query";

    render(
      <MarkdownHeader
        searchQuery={searchQuery}
        setSearchQuery={mockSetSearchQuery}
        openCreateModal={mockOpenCreateModal}
      />
    );

    const newNoteButton = screen.getByRole("button");
    fireEvent.click(newNoteButton);

    expect(mockOpenCreateModal).toHaveBeenCalledTimes(1);
  });

  test("calls setSearchQuery when the search input changes", () => {
    const searchQuery = "test query";

    render(
      <MarkdownHeader
        searchQuery={searchQuery}
        setSearchQuery={mockSetSearchQuery}
        openCreateModal={mockOpenCreateModal}
      />
    );

    const searchInput = screen.getByPlaceholderText("🔍 Search notes...");
    fireEvent.change(searchInput, { target: { value: "new query" } });

    expect(mockSetSearchQuery).toHaveBeenCalledWith("new query");
  });
});
