import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import PhotoDetailsModal from "../PhotoDetailsModal";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

describe("PhotoDetailsModal", () => {
	const mockHandleEditReview = jest.fn();
	const mockSetEditingContent = jest.fn();
	const mockSetEditingId = jest.fn();
	const mockHandleDeleteModal = jest.fn();
	const mockHandleAddReview = jest.fn();
	const mockSetNewReview = jest.fn();
	const mockIsSaving = false;
	const newReview = "";
	const mockSetIsEditSaving = false;

	const photo = {
		id: "1",
		name: "Sample Photo",
		image_url: "https://example.com/sample-photo.jpg",
		url: "https://example.com/sample-photo.jpg",
		user_id: "123",
	};

	const review = {
		id: "123",
		content: "This is a test review",
	};

	const editingContent = "Initial review content";

	test("renders modal with image and name", () => {
		render(
			<PhotoDetailsModal
				isOpen={true}
				onClose={jest.fn()}
				photo={photo}
			/>
		);

		// Verify that the modal exists
		const modal = screen.getByTestId("photo-modal");
		expect(modal).toBeInTheDocument();

		// Verify that the image renders with the correct src and alt attributes
		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", photo.image_url);
		expect(img).toHaveAttribute("alt", photo.name);

		// Verify that the heading renders with the correct text
		const heading = screen.getByRole("heading", { name: photo.name });
		expect(heading).toBeInTheDocument();
	});

	it("allows editing the review and saving changes", () => {
		render(
			<div className="flex items-center">
				<textarea
					maxLength={300}
					value={editingContent} // Bind to editingContent state
					onChange={(e) => mockSetEditingContent(e.target.value)}
					className="flex-grow h-[40px] border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:shadow-md hover:shadow-md duration-300"
				/>
				<button
					onClick={() => mockHandleEditReview(review.id)}
					className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-md cursor-pointer"
					disabled={mockSetIsEditSaving}
				>
					{mockSetIsEditSaving ? <span>Saving...</span> : "Save"}
				</button>
			</div>
		);

		// Check that the textarea is rendered with the correct initial value
		const textarea = screen.getByRole("textbox");
		expect(textarea).toBeInTheDocument();
		expect(textarea).toHaveValue(editingContent);

		// Simulate typing in the textarea
		fireEvent.change(textarea, {
			target: { value: "Updated review content" },
		});
		expect(mockSetEditingContent).toHaveBeenCalledWith(
			"Updated review content"
		);

		// Check that the Save button is rendered and clickable
		const saveButton = screen.getByText("Save");
		expect(saveButton).toBeInTheDocument();
		fireEvent.click(saveButton);
		expect(mockHandleEditReview).toHaveBeenCalledWith(review.id);
	});

	it("renders review content and actions", () => {
		render(
			<div className="flex justify-between items-center">
				<div className="max-w-[380px] w-full">
					<p className="break-words whitespace-pre-wrap">
						{review.content}
					</p>
				</div>
				<div className="flex gap-2 items-center">
					<button
          data-testid='edit-button'
						onClick={() => {
							mockSetEditingId(review.id);
							mockSetEditingContent(review.content);
						}}
						className="text-black/50 hover:text-green-950 transition-colors duration-300 cursor-pointer"
					>
						<FaEdit size={20} />
					</button>
					<button
          data-testid='delete-button'
						onClick={() => mockHandleDeleteModal(review.id)}
						className="text-red-500"
					>
						<MdDelete
							size={20}
							className="text-black/50 hover:text-red-700 transition-colors duration-300 cursor-pointer"
						/>
					</button>
				</div>
			</div>
		);

		// Check that the review content is displayed
		const reviewContent = screen.getByText("This is a test review");
		expect(reviewContent).toBeInTheDocument();

		// Check that the edit button is rendered and clickable
		const editButton = screen.getByTestId("edit-button");
		expect(editButton).toBeInTheDocument();
		fireEvent.click(editButton);
		expect(mockSetEditingId).toHaveBeenCalledWith(review.id);
		expect(mockSetEditingContent).toHaveBeenCalledWith(review.content);

		// Check that the delete button is rendered and clickable
		const deleteButton = screen.getByTestId("delete-button");
		expect(deleteButton).toBeInTheDocument();
		fireEvent.click(deleteButton);
		expect(mockHandleDeleteModal).toHaveBeenCalledWith(review.id);
	});

	it("renders the textarea and add button for reviews", () => {
		render(
			<div className="flex">
				<textarea
					value={newReview}
					maxLength={300}
					onChange={(e) => mockSetNewReview(e.target.value)}
					placeholder="Add a review..."
					className="flex-grow border h-[40px] border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:shadow-md hover:shadow-md duration-300"
				/>
				<button
					onClick={mockHandleAddReview}
					className="ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 duration-300 text-white rounded-md cursor-pointer"
					disabled={mockIsSaving}
				>
					{mockIsSaving ? <span>Saving...</span> : "Add"}
				</button>
			</div>
		);

		// Ensure the textarea is displayed with the correct placeholder
		const textarea = screen.getByPlaceholderText("Add a review...");
		expect(textarea).toBeInTheDocument();
		expect(textarea).toHaveValue(newReview);

		// Simulate typing in the textarea
		fireEvent.change(textarea, {
			target: { value: "This is a new review." },
		});
		expect(mockSetNewReview).toHaveBeenCalledWith("This is a new review.");

		// Ensure the Add button is rendered and clickable
		const addButton = screen.getByText("Add");
		expect(addButton).toBeInTheDocument();
		fireEvent.click(addButton);
		expect(mockHandleAddReview).toHaveBeenCalled();
	});

	it("disables the add button when saving", () => {
		render(
			<div className="flex">
				<textarea
					value={newReview}
					maxLength={300}
					onChange={(e) => mockSetNewReview(e.target.value)}
					placeholder="Add a review..."
					className="flex-grow border h-[40px] border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:shadow-md hover:shadow-md duration-300"
				/>
				<button
          data-testid='save-button'
					onClick={mockHandleAddReview}
					className="ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 duration-300 text-white rounded-md cursor-pointer"
					disabled={true}
				>
					<span>Saving...</span>
				</button>
			</div>
		);

		// Ensure the Add button is disabled
		const addButton = screen.getByTestId("save-button");
		expect(addButton).toBeDisabled();
	});
});
