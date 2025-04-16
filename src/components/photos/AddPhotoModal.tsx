"use client";

import { supabase } from "@/helper/connection";
import axios from "axios";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

type AddPhotoModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onPhotoAdded: () => void; // Callback to refresh the photo grid
};

const AddPhotoModal: React.FC<AddPhotoModalProps> = ({
	isOpen,
	onClose,
	onPhotoAdded,
}) => {
	const [name, setName] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const pathname = usePathname(); // Get the current path

	const currentCategory = pathname.split("/").pop();

	const handleUpload = async () => {
		if (!name.trim() || !file) {
			toast.error("Please provide both a name and a file.");
			return;
		}

		setLoading(true);

		try {
			const fileName = `${Date.now()}-${file.name}`;

			// Step 1: Upload the file to the "images" bucket
			const { data: storageData, error: storageError } =
				await supabase.storage.from("images").upload(fileName, file);

			if (storageError) {
				console.error("File upload error:", storageError.message);
				toast.error("Failed to upload file. Please try again.");
				return;
			}

			// Step 2: Get the public URL for the uploaded file
			const { data: urlData } = supabase.storage
				.from("images")
				.getPublicUrl(fileName);
			const publicUrl = urlData.publicUrl;

			// Step 3: Get the authenticated user's info
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();
			if (userError || !user) {
				toast.error("You must be logged in to upload a photo.");
				return;
			}

			// Step 4: Insert file metadata into the "photos" table
			const { error: dbError } = await supabase.from("photos").insert([
				{
					name,
					image_url: publicUrl,
					user_id: user.id,
					category: currentCategory,
				},
			]);

			if (dbError) {
				console.error("Database error:", dbError.message);
				toast.error("Failed to save photo metadata. Please try again.");
				return;
			}

			// Success
			toast.success("Photo uploaded successfully!");
			setName("");
			setFile(null);
			onPhotoAdded(); // Refresh the photo grid
			onClose();
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full">
				<h2 className="text-xl font-bold mb-4">Upload Pokémon Photo</h2>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">
						Photo Name
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:shadow-md hover:shadow-md duration-300"
						placeholder="Enter photo name"
						disabled={loading}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">
						Photo File
					</label>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:shadow-md hover:shadow-md duration-300"
						disabled={loading}
					/>
				</div>
				<div className="flex justify-end space-x-2">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
						disabled={loading}
					>
						Cancel
					</button>
					<button
						onClick={handleUpload}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
						disabled={loading}
					>
						{loading ? "Uploading..." : "Upload Photo"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddPhotoModal;
