"use client";

import AddPhotoModal from "@/components/photos/AddPhotoModal";
import Header from "@/components/photos/Header";
import PhotoDetailsModal from "@/components/photos/PhotoDetailsModal";
import PhotoGrid from "@/components/photos/PhotoGrid";
import SortingControls from "@/components/photos/SortingContols";
import React, { useState } from "react";

export default function Home() {
	const [sortBy, setSortBy] = useState<"name" | "upload_date">("name");
	const [search, setSearch] = useState("");
	const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null); // For the photo details modal
	const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false); // Placeholder for Add Photo modal
	const [refreshFlag, setRefreshFlag] = useState(false); // To refresh the photo grid

	// Function to handle opening the Add Photo modal
	const handleAddPhoto = () => {
		setIsAddPhotoModalOpen(true);
	};

	// Function to handle refreshing the photo grid
	const refreshPhotoGrid = () => {
		setRefreshFlag((prev) => !prev);
	};

	// Function to close the Add Photo modal
	const closeAddPhotoModal = () => {
		setIsAddPhotoModalOpen(false);
	};

	return (
		<main className="max-w-[screen] overflow-hidden mx-auto px-4 py-8">
			{/* Header Section */}
			<Header
				onSearch={(term: string) => setSearch(term)}
				onAddPhoto={handleAddPhoto}
			/>

			{/* Sorting Controls */}
			<SortingControls sortBy={sortBy} setSortBy={setSortBy} />

			{/* Photo Grid Section */}
			<PhotoGrid
				sortBy={sortBy}
				refreshFlag={refreshFlag}
				search={search} // Pass search term
				onPhotoClick={(photo) => setSelectedPhoto(photo)} // Handle photo click
			/>

			{/* Photo Details Modal */}
			{selectedPhoto && (
				<PhotoDetailsModal
					isOpen={!!selectedPhoto}
					onClose={() => setSelectedPhoto(null)}
					photo={selectedPhoto}
				/>
			)}

			{/* Placeholder for Add Photo Modal */}
			{isAddPhotoModalOpen && (
				<AddPhotoModal
					isOpen={isAddPhotoModalOpen}
					onClose={closeAddPhotoModal}
					onPhotoAdded={refreshPhotoGrid} // Refresh photo grid after adding a photo
				/>
			)}
		</main>
	);
}
