"use client";

import { supabase } from "@/helper/connection";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiClock1 } from "react-icons/ci";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import IconWithTooltip from "../tools/IconWithTooltip";
import ConfirmationDeleteModal from "../modal/ConfirmationModal";
import { useSession } from "@/context/SessionContext";
import { useTopLoader } from "nextjs-toploader";
import SpinnerLoading from "../loader/SpinnerLoading";
import IsSubmitting from "../tools/IsSubmitting";
import { PhotoGridProps, PhotoProps } from "@/types/photos";

const PhotoGrid = ({
	sortBy,
	refreshFlag,
	search,
	onPhotoClick,
}: PhotoGridProps) => {
	const [photos, setPhotos] = useState<PhotoProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingPhoto, setEditingPhoto] = useState<PhotoProps | null>(null);
	const [newImageFile, setNewImageFile] = useState<File | null>(null);
	const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleteSelectedPhoto, setDeleteSelectedPhoto] = useState<
		string | null
	>(null);
	const [isSaving, setIsSaving] = useState(false);

	const pathname = usePathname(); // Get the current path
	const currentCategory = pathname.split("/").pop(); // Extract the category from the path
	const { userId } = useSession(); // Get userId from session context
	const loader = useTopLoader(); // Initialize the loader

	// Fetch photos for the current user and category
	const fetchPhotos = async () => {
		if (!userId) return; // Ensure the user ID is available
		loader.setProgress(0.25); // Start loader progress

		try {
			const { data, error } = await supabase
				.from("photos")
				.select("*")
				.eq("user_id", userId) // Filter by current user ID
				.eq("category", currentCategory) // Filter by category
				.order(sortBy, { ascending: sortBy === "name" });

			if (error) {
				throw error;
			}

			const filteredPhotos = data?.filter((photo) =>
				photo.name.toLowerCase().includes(search.toLowerCase())
			);

			setPhotos(filteredPhotos || []);
			loader.setProgress(0.75); // Update loader progress
		} catch (error) {
			console.error("Error fetching photos:", error);
			toast.error("Failed to load photos.");
		} finally {
			setLoading(false);
			loader.done(); // Finish loader
		}
	};

	const deletePhoto = async (id: string, imageUrl: string) => {
		loader.setProgress(0.25); // Start loader for delete operation
		try {
			// Extract the file path from the image URL
			const filePath = new URL(imageUrl).pathname
				.split("/")
				.slice(2)
				.join("/");

			// Delete the photo from Supabase storage
			const { error: storageError } = await supabase.storage
				.from("images")
				.remove([filePath]);

			if (storageError) {
				throw new Error("Failed to delete photo from storage.");
			}

			// Delete the photo from the database
			const { error: dbError } = await supabase
				.from("photos")
				.delete()
				.eq("id", id);

			if (dbError) {
				throw dbError;
			}

			toast.success("Photo deleted successfully!");
			fetchPhotos(); // Refresh photos after deletion
		} catch (error) {
			console.error("Error deleting photo:", error);
			toast.error("Failed to delete photo.");
		} finally {
			loader.done(); // Finish loader
		}
	};

	const handleDelete = (id: string, imageUrl: string) => {
		setDeleteId(id);
		setDeleteSelectedPhoto(imageUrl);
		setConfirmationModal(true);
	};

	const confirmDelete = () => {
		deletePhoto(deleteId!, deleteSelectedPhoto!);
		setConfirmationModal(false);
	};

	const handleClose = () => {
		setDeleteId(null);
		setDeleteSelectedPhoto(null);
		setConfirmationModal(false);
	};

	const updatePhoto = async () => {
		if (!editingPhoto) return;
		setIsSaving(true);
		loader.setProgress(0.25); // Start loader for update operation
		try {
			let imageUrl = editingPhoto.image_url;

			// Step 1: Replace the photo if a new file is uploaded
			if (newImageFile) {
				// Extract the path of the existing photo from its URL
				const existingFilePath = new URL(
					editingPhoto.image_url
				).pathname
					.split("/")
					.slice(2)
					.join("/");

				// Delete the existing photo from storage
				const { error: deleteError } = await supabase.storage
					.from("images")
					.remove([existingFilePath]);

				if (deleteError) {
					throw new Error(
						"Failed to delete the existing photo from storage."
					);
				}

				// Upload the new photo
				const fileName = `${Date.now()}-${newImageFile.name}`;
				const { data: storageData, error: uploadError } =
					await supabase.storage
						.from("images")
						.upload(fileName, newImageFile);

				if (uploadError) {
					throw new Error("Failed to upload new photo.");
				}

				// Get the public URL for the uploaded file
				const { data: publicUrlData } = supabase.storage
					.from("images")
					.getPublicUrl(fileName);

				imageUrl = publicUrlData.publicUrl;
			}

			// Step 2: Update the photo record in the database
			const { error } = await supabase
				.from("photos")
				.update({ name: editingPhoto.name, image_url: imageUrl })
				.eq("id", editingPhoto.id);

			if (error) {
				throw error;
			}

			toast.success("Photo updated successfully!");
			setEditingPhoto(null);
			setNewImageFile(null);
			fetchPhotos(); // Refresh photos after update
		} catch (error) {
			console.error("Error updating photo:", error);
			toast.error(`Failed to update photo`);
		} finally {
			loader.done();
			setIsSaving(false);
		}
	};

	useEffect(() => {
		if (userId) fetchPhotos(); // Fetch photos only when userId is available
	}, [userId, sortBy, refreshFlag, search]);

	return (
		<div>
			{loading ? (
				<SpinnerLoading />
			) : (
				<div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4">
					{photos.length > 0 ? (
						photos.map((photo) => (
							<div
								key={photo.id}
								className="mb-4 break-inside-avoid border border-green-100 rounded-lg p-4 bg-white shadow hover:shadow-xl hover:border-green-800 transition-shadow duration-300 delay-75 relative "
							>
								<div className="shadow mb-2 relative group cursor-pointer">
									<img
										onClick={() => onPhotoClick(photo)}
										loading="lazy"
										src={photo.image_url}
										alt={photo.name}
										className="w-full rounded-md object-cover"
									/>
									{/* Overlay with eye icon */}
									<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-md pointer-events-none">
										<FaEye className="text-white text-4xl" />
									</div>
								</div>
								<div className="text-center">
									<h3 className="font-semibold text-lg mb-2 truncate text-green-950">
										{photo.name}
									</h3>
									<div className="flex justify-between items-center text-xs text-gray-500">
										<div className="flex gap-1 items-center">
											<CiClock1 size={20} />
											<p>
												Updated:{" "}
												{new Date(
													photo.upload_date
												).toLocaleDateString()}
											</p>
										</div>
										<div className="flex space-x-2 w-fit pointer-events-auto">
											<IconWithTooltip
												icon={
													<FaEdit
														size={20}
														onClick={() =>
															setEditingPhoto(
																photo
															)
														}
													/>
												}
												className="text-black/50 hover:text-green-950 transition-colors duration-300"
												text="Edit photo"
											/>
											<IconWithTooltip
												icon={
													<MdDelete
														size={20}
														onClick={(e) => {
															e.stopPropagation();
															handleDelete(
																photo.id,
																photo.image_url
															);
														}}
													/>
												}
												className="text-black/50 hover:text-red-700 transition-colors duration-300"
												text="Delete photo"
											/>
										</div>
									</div>
								</div>
							</div>
						))
					) : (
						<p>No photos found.</p>
					)}

					{/* Editing modal */}
					{editingPhoto && (
						<div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 transition-opacity duration-200">
							<div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full">
								<h2 className="text-xl font-bold mb-4">
									Edit Photo
								</h2>
								<input
									type="text"
									value={editingPhoto.name}
									onChange={(e) =>
										setEditingPhoto({
											...editingPhoto,
											name: e.target.value,
										})
									}
									className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:shadow-md hover:shadow-md duration-300"
								/>
								<input
									type="file"
									accept="image/*"
									onChange={(e) =>
										setNewImageFile(
											e.target.files?.[0] || null
										)
									}
									className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:shadow-md hover:shadow-md duration-300"
								/>
								<div className="flex justify-end space-x-2">
									<button
										onClick={() => setEditingPhoto(null)}
										className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
									>
										Cancel
									</button>
									<button
										onClick={updatePhoto}
										className="px-4 flex gap-1 items-center py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
										disabled={isSaving}
									>
										<span>
											{isSaving ? "Saving" : "Save"}
										</span>
										<span>
											{isSaving && <IsSubmitting />}
										</span>
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Confirmation delete modal */}
					<ConfirmationDeleteModal
						onConfirm={() => confirmDelete()}
						isOpen={confirmationModal}
						onClose={handleClose}
						title="Delete"
						text="Are you sure you want to delete this photo?"
					/>
				</div>
			)}
		</div>
	);
};

export default PhotoGrid;
