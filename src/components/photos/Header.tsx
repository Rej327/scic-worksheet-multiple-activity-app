"use client";

import { HeaderProps } from "@/types/photos";
import {
	loadFromStorage,
	LOCAL_STORAGE_KEYS,
	saveToStorage,
} from "@/utils/inputsData";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";

const Header = ({ onSearch, onAddPhoto }: HeaderProps) => {
	const [search, setSearch] = useState("");
	const [title, setTitle] = useState<string>("");

	const pathname = usePathname();
	const currentCategory = pathname ? pathname.split("/").pop() : "";

	// Title page depening on page link
	useEffect(() => {
		switch (currentCategory) {
			case "pokemon-review-app":
				setTitle("Pokémon Photo Archive");
				break;
			case "food-review-app":
				setTitle("Tasty Reviews");
				break;
			case "google-drive-lite":
				setTitle("Mini Google Drive");
				break;
			default:
				setTitle("Default Title");
				break;
		}
	}, [currentCategory]);

	// Load initial value from localStorage
	const searhName =
		currentCategory === "pokemon-review-app"
			? LOCAL_STORAGE_KEYS.searchPokemon
			: LOCAL_STORAGE_KEYS.searchDrive;
	useEffect(() => {
		const stored = loadFromStorage(searhName, "");
		setSearch(stored);
	}, []);

	// Save to localStorage and debounce search
	useEffect(() => {
		saveToStorage(searhName, search);

		const timeout = setTimeout(() => {
			onSearch(search);
		}, 1500);

		return () => clearTimeout(timeout);
	}, [search, onSearch]);

	return (
		<header className="flex flex-col items-center bg-none">
			<div
				data-testid="header-container"
				className="flex justify-between items-center w-full mb-8"
			>
				<h1
					data-testid="header-title"
					className="text-3xl font-bold mb-4 sm:mb-0 text-green-950"
				>
					{title}
				</h1>
				<button
					data-testid="add-photo-button"
					className="text-white flex gap-2 items-center bg-green-600 hover:bg-green-700 p-2 rounded-md transition-colors duration-300 cursor-pointer"
					onClick={onAddPhoto}
				>
					<FiUpload size={15} /> Upload Photo
				</button>
			</div>
			{currentCategory === "food-review-app" ? null : (
				<input
					data-testid="search-input"
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="🔍 Search photo..."
					className="w-full px-4 py-2 border-b-2 border-green-800 focus:outline-none transition-all duration-300"
				/>
			)}
		</header>
	);
};

export default Header;
