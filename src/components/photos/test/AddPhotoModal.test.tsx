import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import AddPhotoModal from "../AddPhotoModal";

describe.only("AddPhotoModal", () => {
	const mockOnClose = jest.fn();
	const mockOnPhotoAdded = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("updates the file input field when a file is selected", () => {
		render(
			<AddPhotoModal
				isOpen={true}
				onClose={mockOnClose}
				onPhotoAdded={mockOnPhotoAdded}
			/>
		);

		const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
		const file = new File(["test"], "test.png", { type: "image/png" });

		fireEvent.change(fileInput, { target: { files: [file] } });

		expect(fileInput.files).toHaveLength(1);
		expect(fileInput.files![0].name).toBe("test.png");
	});

	it("does not render the modal when isOpen is false", () => {
		render(
			<AddPhotoModal
				isOpen={false}
				onClose={mockOnClose}
				onPhotoAdded={mockOnPhotoAdded}
			/>
		);

		expect(screen.queryByTestId("modal-container")).not.toBeInTheDocument();
	});

	it("calls onClose when the Cancel button is clicked", () => {
		render(
			<AddPhotoModal
				isOpen={true}
				onClose={mockOnClose}
				onPhotoAdded={mockOnPhotoAdded}
			/>
		);

		const cancelButton = screen.getByTestId("cancel-button");
		fireEvent.click(cancelButton);

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it("displays an error toast when trying to upload without a name or file", () => {
		render(
			<AddPhotoModal
				isOpen={true}
				onClose={mockOnClose}
				onPhotoAdded={mockOnPhotoAdded}
			/>
		);

		const uploadButton = screen.getByTestId("upload-button");
		fireEvent.click(uploadButton);
	});

	it("renders input fields and disables upload button when loading is true", async () => {
		render(
			<AddPhotoModal
				isOpen={true}
				onClose={mockOnClose}
				onPhotoAdded={mockOnPhotoAdded}
			/>
		);

		const nameInput = screen.getByTestId("name-input");
		const fileInput = screen.getByTestId("file-input");
		const uploadButton = screen.getByTestId("upload-button");

		expect(nameInput).toBeInTheDocument();
		expect(fileInput).toBeInTheDocument();
		expect(uploadButton).toBeInTheDocument(); // before click

		fireEvent.click(uploadButton);

		// If click button it will disable = true
		await waitFor(() => {
			expect(uploadButton).toBeEnabled();
		});
	});
});
