"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/helper/connection";
import {
	FaHome,
	FaEnvelope,
	FaEdit,
	FaUsers,
	FaSignOutAlt,
	FaTrashAlt,
	FaGoogleDrive,
} from "react-icons/fa";
import { background, scic_logo_white } from "../../public/assets";
import toast from "react-hot-toast";
import ConfirmationDeleteModal from "./ConfirmationModal";
import { NavItemProps } from "@/types/navigation";
import Image from "next/image";
import { LuListTodo } from "react-icons/lu";
import { MdCatchingPokemon, MdFastfood } from "react-icons/md";

const NavItem: NavItemProps[] = [
	{
		id: "0",
		title: "Dashboard",
		link: "/",
		icon: <FaHome size={20} />,
	},
	{
		id: "1",
		title: "Todo List",
		link: "/activity/todo-list",
		icon: <LuListTodo size={20} />,
	},
	{
		id: "2",
		title: "Google Drive 'Lite'",
		link: "/activity/google-drive-lite",
		icon: <FaGoogleDrive size={20} />,
	},
	{
		id: "3",
		title: "Food Review App",
		link: "/activity/food-review-app",
		icon: <MdFastfood size={20} />,
	},
	{
		id: "4",
		title: "Pokemon Review App",
		link: "/activity/pokemon-review-app",
		icon: <MdCatchingPokemon size={20} />,
	},
	{
		id: "5",
		title: "Markdown Notes App",
		link: "/activity/markdown-notes-app",
		icon: <FaUsers size={20} />,
	},
];

const NavLink = ({
	href,
	icon,
	label,
}: {
	href: string;
	icon: React.ReactNode;
	label: string;
}) => {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link
			href={href}
			className={`py-2 px-4 rounded flex items-center gap-4 transition ${
				isActive
					? "bg-white/30 font-semibold cursor-default"
					: "hover:bg-white/20"
			}`}
		>
			{icon} {label}
		</Link>
	);
};

export default function Navigation({
	children,
}: {
	children: React.ReactNode;
}) {
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [isLogout, setIslogout] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const route = useRouter();

	const handleLogoutModal = () => {
		setIslogout(true);
		setShowDeleteModal(true);
	};

	const handleLogout = async () => {
		try {
			setLoading(true);
			await supabase.auth.signOut();
			route.push("/");
		} catch {
			toast.error("Error on logout");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteModal = () => {
		setIslogout(false);
		setShowDeleteModal(true);
	};

	const handleDelete = async () => {
		const { data: userData, error: userError } =
			await supabase.auth.getUser();

		if (userError) {
			console.error("Error fetching user:", userError.message);
			return;
		}

		const id = userData?.user?.id;

		if (!id) {
			console.error("User ID is missing");
			return;
		}

		try {
			const { error } = await supabase.auth.admin.deleteUser(id);
			if (error) {
				toast.error("Error deleting user");
				return;
			}

			await supabase.auth.signOut();
			location.reload();
		} catch (error) {
			toast.error("Unexpected error during user deletion:");
		}
	};

	return (
		<div className="flex flex-col md:flex-row min-h-screen">
			<aside className="w-full md:w-[15vw] md:fixed z-20">
				<div
					className="relative h-[400px] md:h-screen text-white flex flex-col justify-between"
					style={{
						backgroundImage: `url(${background.src})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				>
					<div className="absolute inset-0 bg-green-800/90 z-0 " />
					<div className="relative z-10 py-4">
						<div className="flex gap-2 px-4 pb-4 border-b-2 border-white/20">
							<Image
								src={scic_logo_white}
								alt="Logo"
								width={50}
								height={50}
							/>
							<div>
								<h1 className="text-xl font-semibold">
									SCIC Worksheet
								</h1>
								<p>Multiple Activies App</p>
							</div>
						</div>
						<nav className="flex flex-col gap-2 p-4">
							{NavItem.map((link) => (
								<NavLink
									key={link.id}
									href={link.link}
									icon={link.icon}
									label={link.title}
								/>
							))}
						</nav>
					</div>
					<div className="p-4 border-t-1 border-white/20 space-y-2 relative z-10">
						<button
							onClick={handleLogoutModal}
							className="w-full hover:bg-white/20 py-2 px-4 rounded flex items-center justify-start gap-4 cursor-pointer"
						>
							<FaSignOutAlt className="text-xl" /> Logout
						</button>
						<button
							onClick={handleDeleteModal}
							className="w-full hover:bg-white/20 py-2 px-4 rounded flex items-center justify-start gap-4 cursor-pointer"
						>
							<FaTrashAlt className="text-xl" /> Delete Account
						</button>
					</div>
				</div>
			</aside>

			<main className="w-full md:ml-[15vw] text-gray-900 p-6">
				<ConfirmationDeleteModal
					title={isLogout ? "logout" : "delete"}
					text={`Are you sure you want ${
						isLogout ? "to logout" : "to delete"
					} this account?`}
					isOpen={showDeleteModal}
					onClose={() => setShowDeleteModal(false)}
					onConfirm={isLogout ? handleLogout : handleDelete}
				/>
				{children}
			</main>
		</div>
	);
}
