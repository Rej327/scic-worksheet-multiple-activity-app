"use client";

import { supabase } from "@/helper/connection";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import IsSubmitting from "../tools/IsSubmitting";
import { useTopLoader } from "nextjs-toploader";
import {
	clearAddDrive,
	clearAddFood,
	clearAddPokemon,
	loadFromStorage,
	LOCAL_STORAGE_KEYS,
	saveToStorage,
} from "@/utils/inputsData";
import { AddPhotoModalProps } from "@/types/photos";

const AddPhotoModal = ({
	isOpen,
	onClose,
	onPhotoAdded,
}: AddPhotoModalProps) => {
	const pathname = usePathname(); // Get the current path
	const loader = useTopLoader();
	const currentCategory = (pathname || "").split("/").pop() || "";
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	// Initialize `savedName` and `name` with data from localStorage
	const initialName = (() => {
		switch (currentCategory) {
			case "pokemon-review-app":
				return loadFromStorage(LOCAL_STORAGE_KEYS.addPokemon) || "";
			case "food-review-app":
				return loadFromStorage(LOCAL_STORAGE_KEYS.addFood) || "";
			case "google-drive-lite":
				return loadFromStorage(LOCAL_STORAGE_KEYS.addDrive) || "";
			default:
				return "";
		}
	})();
	const [name, setName] = useState(initialName);

	// Save the name to localStorage when it changes
	const handleNameChange = (value: string) => {
		setName(value);

		switch (currentCategory) {
			case "pokemon-review-app":
				saveToStorage(LOCAL_STORAGE_KEYS.addPokemon, value);
				break;
			case "food-review-app":
				saveToStorage(LOCAL_STORAGE_KEYS.addFood, value);
				break;
			case "google-drive-lite":
				saveToStorage(LOCAL_STORAGE_KEYS.addDrive, value);
				break;
			default:
				break;
		}
	};

	const handleClose = () => {
		onClose();
		if (currentCategory === "pokemon-review-app") {
			clearAddPokemon();
		} else if (currentCategory === "food-review-app") {
			clearAddFood();
		} else if (currentCategory === "google-drive-lite") {
			clearAddDrive();
		}
	};

	const handleUpload = async () => {
		if (!name.trim() || !file) {
			toast.error("Please provide both a name and a file.");
			return;
		}

		loader.setProgress(0.25);
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
			handleClose();
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
			loader.done();
		}
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 transition-opacity duration-300"
			onClick={handleClose}
		>
			<div
				className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full transition-transform transform duration-300 scale-95"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-xl font-bold mb-4">Upload Photo</h2>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">
						Photo Name
					</label>
					<input
						data-testid="name-input"
						type="text"
						value={name}
						onChange={(e) => handleNameChange(e.target.value)}
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
						data-testid="file-input"
						type="file"
						accept="image/*"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:shadow-md hover:shadow-md duration-300 cursor-pointer"
						disabled={loading}
					/>
				</div>
				<div className="flex justify-end space-x-2">
					<button
						data-testid="cancel-button"
						type="button"
						onClick={handleClose}
						className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md cursor-pointer"
					>
						Cancel
					</button>
					<button
						data-testid="upload-button"
						type="submit"
						onClick={handleUpload}
						disabled={loading}
						className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors duration-300 ${
							loading
								? "bg-blue-300 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700 cursor-pointer"
						} text-white`}
					>
						{loading ? "Uploading" : "Upload Photo"}
						{loading && <IsSubmitting />}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddPhotoModal;
