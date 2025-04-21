"use client";

import React from "react";
import { SortingControlsProps } from "@/types/photos";

const SortingControlls = ({
	sortBy,
	setSortBy,
	setOrderBy,
	orderBy,
}: SortingControlsProps & { orderBy: "asc" | "desc" }) => {
	const handleSortClick = (field: "name" | "upload_date") => {
		if (sortBy === field) {
			setOrderBy(orderBy === "asc" ? "desc" : "asc");
		} else {
			setSortBy(field);
			setOrderBy("asc");
		}
	};

	return (
		<div className="flex justify-start space-x-4 p-4 bg-none">
			<button
				data-testId='sortByName'
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
				data-testId='sortByDate'
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

export default SortingControlls;