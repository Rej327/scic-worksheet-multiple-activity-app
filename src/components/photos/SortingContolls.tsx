"use client";

import { SortingControlsProps } from "@/types/photos";
import React from "react";

const SortingControlls = ({ sortBy, setSortBy }: SortingControlsProps) => {
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

export default SortingControlls;
