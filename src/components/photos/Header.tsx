"use client";

import {
	loadFromStorage,
	LOCAL_STORAGE_KEYS,
	saveToStorage,
} from "@/utils/inputsData";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

type HeaderProps = {
	onSearch: (searchTerm: string) => void;
	onAddPhoto: () => void;
};

const Header: React.FC<HeaderProps> = ({ onSearch, onAddPhoto }) => {
	const [search, setSearch] = useState("");
	const [title, setTitle] = useState<string>("");

	const pathname = usePathname(); // Get the current path
	const currentCategory = pathname.split("/").pop();

	useEffect(() => {
		// Switch to update the title based on the current category
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
				setTitle("Default Title"); // Default title if no match
				break;
		}
	}, [currentCategory]); // Depend on currentCategory so it updates when the path changes

	// Load initial value from localStorage
	useEffect(() => {
		const stored = loadFromStorage(LOCAL_STORAGE_KEYS.searchPokemon, "");
		setSearch(stored);
	}, []);

	// Save to localStorage and debounce search
	useEffect(() => {
		saveToStorage(LOCAL_STORAGE_KEYS.searchPokemon, search);

		const timeout = setTimeout(() => {
			onSearch(search);
		}, 1500); // debounce delay in ms

		return () => clearTimeout(timeout); // cleanup on re-render
	}, [search, onSearch]);

	return (
		<header className="flex flex-col items-center bg-none">
			<div className="flex justify-between items-center w-full mb-8">
				<h1 className="text-3xl font-bold mb-4 sm:mb-0 text-green-950">
					{title}
				</h1>
				<button
					className="text-white flex gap-2 items-center bg-green-600 hover:bg-green-700 p-2 rounded-md transition-colors duration-300 cursor-pointer"
					onClick={onAddPhoto}
				>
					<FaPlus size={15} /> New Note
				</button>
			</div>
			{currentCategory === "pokemon-review-app" && (
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="🔍 Search Pokémon"
					className="w-full px-4 py-2 border-b-2 border-green-800 focus:outline-none transition-all duration-300"
				/>
			)}
		</header>
	);
};

export default Header;
