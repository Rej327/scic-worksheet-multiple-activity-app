"use client";

import AddPhotoModal from "@/components/photos/AddPhotoModal";
import Header from "@/components/photos/Header";
import PhotoDetailsModal from "@/components/photos/PhotoDetailsModal";
import PhotoGrid from "@/components/photos/PhotoGrid";
import SortingControlls from "@/components/photos/SortingContolls";
import React, { useState, useEffect } from "react";

export default function Home() {
	const [sortBy, setSortBy] = useState<"name" | "upload_date">("name");
	const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");
	const [search, setSearch] = useState("");
	const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null); // For the photo details modal
	const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false); // Placeholder for Add Photo modal
	const [refreshFlag, setRefreshFlag] = useState(false); // To refresh the photo grid

	// Load sorting preferences from localStorage only in the browser
	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedSortBy = localStorage.getItem("sortBy");
			const savedOrderBy = localStorage.getItem("orderBy");

			if (savedSortBy === "name" || savedSortBy === "upload_date") {
				setSortBy(savedSortBy as "name" | "upload_date");
			}

			if (savedOrderBy === "asc" || savedOrderBy === "desc") {
				setOrderBy(savedOrderBy as "asc" | "desc");
			}
		}
	}, []);

	// Save sorting preferences to localStorage whenever they change
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("sortBy", sortBy);
			localStorage.setItem("orderBy", orderBy);
		}
	}, [sortBy, orderBy]);

	// Handle opening the Add Photo modal
	const handleAddPhoto = () => {
		setIsAddPhotoModalOpen(true);
	};

	// Handle refreshing the photo grid
	const refreshPhotoGrid = () => {
		setRefreshFlag((prev) => !prev);
	};

	// Close the Add Photo modal
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
			<SortingControlls
				sortBy={sortBy}
				setSortBy={setSortBy}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
			/>

			{/* Photo Grid Section */}
			<PhotoGrid
				sortBy={sortBy}
				order={orderBy}
				refreshFlag={refreshFlag}
				search={search}
				onPhotoClick={(photo) => setSelectedPhoto(photo)}
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