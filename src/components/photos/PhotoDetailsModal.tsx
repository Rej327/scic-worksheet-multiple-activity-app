import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "@/helper/connection";
import { usePathname } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ConfirmationDeleteModal from "../modal/ConfirmationModal";
import IsSubmitting from "../tools/IsSubmitting";
import { useTopLoader } from "nextjs-toploader";
import { PhotoDetailsModalProps, Review } from "@/types/photos";

const PhotoDetailsModal = ({
	isOpen,
	onClose,
	photo,
}: PhotoDetailsModalProps) => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [newReview, setNewReview] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingContent, setEditingContent] = useState("");
	const [isSaving, setisSaving] = useState(false);
	const [isEditSaving, setisEditSaving] = useState(false);

	// States for delete confirmation modal
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

	const pathname = usePathname(); // Get the current path
	const currentCategory = pathname ? pathname.split("/").pop() : null;
	const loader = useTopLoader();

	// Fetch reviews for the selected photo
	const fetchReviews = async () => {
		if (!photo) return;
		loader.setProgress(0.25);

		const { data, error } = await supabase
			.from("reviews")
			.select("*")
			.eq("photo_id", photo.id);

		if (error) {
			console.error("Error fetching reviews:", error);
			toast.error("Failed to fetch reviews.");
			return;
		}
		loader.done();
		setReviews(data || []);
	};

	// Add a new review for the photo
	const handleAddReview = async () => {
		if (!photo || !newReview.trim()) return;
		setisSaving(true);
		loader.setProgress(0.25);
		const { error } = await supabase.from("reviews").insert({
			photo_id: photo.id,
			content: newReview,
			user_id: photo.user_id,
		});

		if (error) {
			toast.error("Error adding review");
			return;
		}

		toast.success("Review added");
		loader.done();
		setisSaving(false);
		setNewReview("");
		fetchReviews();
	};

	// Edit an existing review
	const handleEditReview = async (id: string) => {
		if (!editingContent.trim()) return;

		setisEditSaving(true);
		loader.setProgress(0.25);
		const { error } = await supabase
			.from("reviews")
			.update({ content: editingContent })
			.eq("id", id);

		if (error) {
			toast.error("Error updating review");
			return;
		}

		toast.success("Review updated");
		loader.done();
		setisEditSaving(false);
		setEditingId(null);
		setEditingContent("");
		fetchReviews();
	};

	useEffect(() => {
		if (isOpen) {
			fetchReviews();
		}
	}, [isOpen]);

	if (!photo) return null;

	// Show delete confirmation modal
	const handleDeleteModal = (id: string) => {
		setDeleteReviewId(id);
		setDeleteModalOpen(true);
	};

	// Confirm deletion of a review
	const onConfirmDeleteReview = async () => {
		if (!deleteReviewId) return;

		loader.setProgress(0.25);
		const { error } = await supabase
			.from("reviews")
			.delete()
			.eq("id", deleteReviewId);

		if (error) {
			toast.error("Error deleting review");
			return;
		}

		toast.success("Review deleted");
		loader.done();
		setDeleteReviewId(null);
		setDeleteModalOpen(false);
		fetchReviews();
	};

	// Close delete confirmation modal
	const handleCloseDeleteModal = () => {
		setDeleteReviewId(null);
		setDeleteModalOpen(false);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div data-testid="photo-modal" className="text-center">
				<img
					src={photo.image_url}
					alt={photo.name}
					className="w-full rounded-md mb-4"
				/>
				<h2 className="text-2xl font-bold mb-4">{photo.name}</h2>
			</div>
			{currentCategory === "google-A" ? null : (
				<div>
					<h3 className="text-lg font-semibold mb-2">Reviews</h3>
					<ul className="mb-4">
						{reviews.map((review) => (
							<li
								key={review.id}
								className="border-b border-y-green-950 pb-2 mb-2"
							>
								{editingId === review.id ? (
									<div className="flex items-center">
										<textarea
											maxLength={300}
											value={editingContent} // Bind to editingContent state
											onChange={(e) =>
												setEditingContent(
													e.target.value
												)
											}
											className="flex-grow h-[40px] border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:shadow-md hover:shadow-md duration-300"
										/>
										<button
											onClick={() =>
												handleEditReview(review.id)
											}
											className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-md cursor-pointer"
											disabled={isEditSaving}
										>
											{isEditSaving ? (
												<IsSubmitting />
											) : (
												"Save"
											)}
										</button>
									</div>
								) : (
									<div className="flex justify-between items-center">
										<div className="max-w-[380px] w-full">
											<p className="break-words whitespace-pre-wrap">
												{review.content}
											</p>
										</div>
										<div className="flex gap-2 items-center">
											<button
												onClick={() => {
													setEditingId(review.id);
													setEditingContent(
														review.content // Initialize editingContent with the current review content
													);
												}}
												className="text-black/50 hover:text-green-950 transition-colors duration-300 cursor-pointer"
											>
												<FaEdit size={20} />
											</button>
											<button
												onClick={() =>
													handleDeleteModal(review.id)
												}
												className="text-red-500"
											>
												<MdDelete
													size={20}
													className="text-black/50 hover:text-red-700 transition-colors duration-300 cursor-pointer"
												/>
											</button>
										</div>
									</div>
								)}
							</li>
						))}
					</ul>
					<div className="flex">
						<textarea
							value={newReview}
							maxLength={300}
							onChange={(e) => setNewReview(e.target.value)}
							placeholder="Add a review..."
							className="flex-grow border h-[40px] border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:shadow-md hover:shadow-md duration-300"
						/>
						<button
							onClick={handleAddReview}
							className="ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 duration-300 text-white rounded-md cursor-pointer"
							disabled={isSaving}
						>
							{isSaving ? <IsSubmitting /> : "Add"}
						</button>
					</div>
				</div>
			)}

			<ConfirmationDeleteModal
				isOpen={deleteModalOpen}
				onConfirm={onConfirmDeleteReview}
				onClose={handleCloseDeleteModal}
				title="Delete Review"
				text="Are you sure you want to delete this review?"
			/>
		</Modal>
	);
};

export default PhotoDetailsModal;
