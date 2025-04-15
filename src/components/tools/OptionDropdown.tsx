import { useSession } from "@/context/SessionContext";
import React, { useState } from "react";
import {
	FaChevronDown,
	FaChevronUp,
	FaSignOutAlt,
	FaTrashAlt,
} from "react-icons/fa";

export const UserDropdown = ({
	handleLogoutModal,
	handleDeleteModal,
}: {
	handleLogoutModal: () => void;
	handleDeleteModal: () => void;
}) => {
	const { fullName } = useSession();
	const [showMenu, setShowMenu] = useState(false);

	const initials = fullName
		?.trim()
		.split(" ")
		.filter(Boolean)
		.map((n) => n[0])
		.slice(0, 2) // limit to 2 initials (optional)
		.join("")
		.toUpperCase();

	// Handle outside click
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const dropdown = document.getElementById("user-dropdown");
			if (dropdown && !dropdown.contains(event.target as Node)) {
				setShowMenu(false);
			}
		};

		if (showMenu) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showMenu]);

	return (
		<div id="user-dropdown" className="relative">
			<button
				onClick={() => setShowMenu((prev) => !prev)}
				className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded cursor-pointer w-full"
			>
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-gradient-to-r from-green-400 to-orange-500 text-white font-semibold p-2 flex items-center justify-center rounded-full shadow">
							{initials || "??"}
						</div>
						<p>{fullName}</p>
					</div>
					<div>
						<FaChevronUp className="text-white text-sm" />
					</div>
				</div>
			</button>

			{showMenu && (
				<div className="absolute left-0  -mt-40 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded shadow p-2 space-y-2 z-50">
					<button
						onClick={() => {
							setShowMenu(false);
							handleLogoutModal();
						}}
						className="w-full hover:bg-white/20 py-2 px-4 rounded flex items-center gap-4 text-white cursor-pointer"
					>
						<FaSignOutAlt className="text-xl" />
						Logout
					</button>
					<button
						onClick={() => {
							setShowMenu(false);
							handleDeleteModal();
						}}
						className="w-full hover:bg-white/20 py-2 px-4 rounded flex items-center gap-4 text-white cursor-pointer"
					>
						<FaTrashAlt className="text-xl" />
						Delete Account
					</button>
				</div>
			)}
		</div>
	);
};
