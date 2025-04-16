"use client";

import React from "react";

type SortingControlsProps = {
	sortBy: "name" | "upload_date";
	setSortBy: (value: "name" | "upload_date") => void;
};

const SortingControls: React.FC<SortingControlsProps> = ({
	sortBy,
	setSortBy,
}) => {
	return (
		<div className="flex justify-start space-x-4 p-4 bg-none">
			<button
				onClick={() => setSortBy("name")}
				className={`text-sm px-4 py-2 rounded-md cursor-pointer ${
					sortBy === "name"
						? "bg-green-600 text-white"
						: "bg-gray-300"
				}`}
			>
				Sort by Name
			</button>
			<button
				onClick={() => setSortBy("upload_date")}
				className={`text-sm px-4 py-2 rounded-md cursor-pointer ${
					sortBy === "upload_date"
						? "bg-green-600 text-white"
						: "bg-gray-300"
				}`}
			>
				Sort by Upload Date
			</button>
		</div>
	);
};

export default SortingControls;
