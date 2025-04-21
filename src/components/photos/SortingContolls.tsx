"use client";

import React from "react";
import { SortingControlsProps } from "@/types/photos";

const SortingControls = ({
	sortBy,
	setSortBy,
	setOrderBy,
	orderBy,
}: SortingControlsProps & { orderBy: "asc" | "desc" }) => {
	// Handle sorting button clicks and update localStorage directly
	const handleSortClick = (field: "name" | "upload_date") => {
		if (sortBy === field) {
			const newOrderBy = orderBy === "asc" ? "desc" : "asc";
			setOrderBy(newOrderBy);
			localStorage.setItem("orderBy", newOrderBy); // Save to localStorage
		} else {
			setSortBy(field);
			setOrderBy("asc"); // Default to ascending when switching fields
			localStorage.setItem("sortBy", field); // Save to localStorage
			localStorage.setItem("orderBy", "asc"); // Save to localStorage
		}
	};

	return (
		<div className="flex justify-start space-x-4 p-4 bg-none">
			<button
				onClick={() => handleSortClick("name")}
				className={`text-sm px-4 py-2 rounded-md cursor-pointer ${
					sortBy === "name"
						? "bg-green-600 text-white"
						: "bg-gray-300"
				}`}
			>
				Sort by Name {sortBy === "name" && (orderBy === "asc" ? "↑" : "↓")}
			</button>
			<button
				onClick={() => handleSortClick("upload_date")}
				className={`text-sm px-4 py-2 rounded-md cursor-pointer ${
					sortBy === "upload_date"
						? "bg-green-600 text-white"
						: "bg-gray-300"
				}`}
			>
				Sort by Upload Date{" "}
				{sortBy === "upload_date" && (orderBy === "asc" ? "↑" : "↓")}
			</button>
		</div>
	);
};

export default SortingControls;