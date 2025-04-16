import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "@/helper/connection";
import { usePathname } from "next/navigation";

type Photo = {
	image_url: string | undefined;
	id: string;
	name: string;
	url: string;
	user_id: string; // User ID associated with the photo
};

type Review = {
	id: string;
	content: string;
	created_at: string;
	user_id: string; // User ID of the review author
};

type PhotoDetailsModalProps = {
	isOpen: boolean;
	onClose: () => void;
	photo: Photo | null;
};

const PhotoDetailsModal: React.FC<PhotoDetailsModalProps> = ({
	isOpen,
	onClose,
	photo,
}) => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [newReview, setNewReview] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingContent, setEditingContent] = useState("");

	const pathname = usePathname(); // Get the current path
	const currentCategory = pathname.split("/").pop();

	// Fetch reviews for the selected photo
	const fetchReviews = async () => {
		if (!photo) return;

		const { data, error } = await supabase
			.from("reviews")
			.select("*")
			.eq("photo_id", photo.id);

		if (error) {
			console.error("Error fetching reviews:", error);
			toast.error("Failed to fetch reviews.");
			return;
		}

		setReviews(data || []);
	};

	// Add a new review for the photo
	const handleAddReview = async () => {
		if (!photo || !newReview.trim()) return;

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
		setNewReview("");
		fetchReviews();
	};

	// Edit an existing review
	const handleEditReview = async (id: string) => {
		if (!editingContent.trim()) return;

		const { error } = await supabase
			.from("reviews")
			.update({ content: editingContent })
			.eq("id", id);

		if (error) {
			toast.error("Error updating review");
			return;
		}

		toast.success("Review updated");
		setEditingId(null);
		setEditingContent("");
		fetchReviews();
	};

	// Delete a review
	const handleDeleteReview = async (id: string) => {
		const { error } = await supabase.from("reviews").delete().eq("id", id);

		if (error) {
			toast.error("Error deleting review");
			return;
		}

		toast.success("Review deleted");
		fetchReviews();
	};

	useEffect(() => {
		if (isOpen) {
			fetchReviews();
		}
	}, [isOpen]);

	if (!photo) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<Toaster />
			<div className="text-center">
				<img
					src={photo.image_url}
					alt={photo.name}
					className="w-full rounded-md mb-4"
				/>
				<h2 className="text-2xl font-bold mb-4">{photo.name}</h2>
			</div>
			{currentCategory === "google-drive-lite" ? null : (
				<div>
					<h3 className="text-lg font-semibold mb-2">Reviews</h3>
					<ul className="mb-4">
						{reviews.map((review) => (
							<li key={review.id} className="border-b pb-2 mb-2">
								{editingId === review.id ? (
									<div className="flex items-center">
										<input
											type="text"
											value={editingContent}
											onChange={(e) =>
												setEditingContent(
													e.target.value
												)
											}
											className="flex-grow border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:shadow-md hover:shadow-md duration-300"
										/>
										<button
											onClick={() =>
												handleEditReview(review.id)
											}
											className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-md"
										>
											Save
										</button>
									</div>
								) : (
									<div className="flex justify-between items-center">
										<p>{review.content}</p>
										<div>
											<button
												onClick={() => {
													setEditingId(review.id);
													setEditingContent(
														review.content
													);
												}}
												className="text-blue-500 mr-2"
											>
												Edit
											</button>
											<button
												onClick={() =>
													handleDeleteReview(
														review.id
													)
												}
												className="text-red-500"
											>
												Delete
											</button>
										</div>
									</div>
								)}
							</li>
						))}
					</ul>
					<div className="flex">
						<input
							type="text"
							value={newReview}
							onChange={(e) => setNewReview(e.target.value)}
							placeholder="Add a review..."
							className="flex-grow border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:shadow-md hover:shadow-md duration-300"
						/>
						<button
							onClick={handleAddReview}
							className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md"
						>
							Add
						</button>
					</div>
				</div>
			)}
		</Modal>
	);
};

export default PhotoDetailsModal;
