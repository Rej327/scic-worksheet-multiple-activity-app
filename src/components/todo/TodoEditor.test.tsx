import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import TodoEditor from "./TodoEditor";

// Mock toast functions (success and error)
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe.only("TodoEditor", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks(); // Reset all mocks including toast
  });

  it("renders title and content inputs", () => {
    render(<TodoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByTestId("note-title")).toBeInTheDocument();
    expect(screen.getByTestId("note-content")).toBeInTheDocument();
  });

  it("allows input in title and content", () => {
    render(<TodoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

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


  it("validates inputs and shows error messages", async () => {
    render(<TodoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() => {
      expect(screen.getByText("* Title is required.")).toBeInTheDocument();
      expect(screen.getByText("* Content is required.")).toBeInTheDocument();
    });
  });

  it("calls onSave when form is valid", async () => {
    render(<TodoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

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
    render(<TodoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
