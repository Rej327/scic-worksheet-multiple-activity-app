"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/helper/connection";
import { FaHome, FaGoogleDrive } from "react-icons/fa";
import { background, scic_logo_white } from "../../../public/assets";
import toast from "react-hot-toast";
import ConfirmationDeleteModal from "@/components/modal/ConfirmationModal";
import { NavItemProps } from "@/types/navigation";
import Image from "next/image";
import { LuListTodo } from "react-icons/lu";
import { MdCatchingPokemon, MdFastfood } from "react-icons/md";
import { useTopLoader } from "nextjs-toploader";
import { UserDropdown } from "../tools/OptionDropdown";
import { AiFillFileMarkdown } from "react-icons/ai";
import { resetStorage } from "@/utils/inputsData";

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
		icon: <AiFillFileMarkdown size={20} />,
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

	const route = useRouter();
	const loader = useTopLoader();

	const handleLogoutModal = () => {
		setIslogout(true);
		setShowDeleteModal(true);
	};

	const handleLogout = async () => {
		loader.setProgress(0.25);
		try {
			await supabase.auth.signOut();
			resetStorage();
		} catch {
			toast.error("Error on logout");
		} finally {
			loader.done();
			route.push("/");
		}
	};

	const handleDeleteModal = () => {
		setIslogout(false);
		setShowDeleteModal(true);
	};

	const handleDelete = async () => {
		loader.setProgress(0.25);
		const { data: userData, error: userError } =
			await supabase.auth.getUser();

		if (userError) {
			console.error("Error fetching user:", userError.message);
			return;
		}

		const id = userData?.user?.id;
		const email = userData?.user?.email;

		if (!id) {
			console.error("User ID is missing");
			return;
		}

		try {
			// Step 1: Delete from all related tables
			const tablesWithUserId = [
				"secret_messages",
				"notes",
				"todos",
				"reviews",
				"photos",
			];

			for (const table of tablesWithUserId) {
				const { error } = await supabase
					.from(table)
					.delete()
					.eq("user_id", id);
				if (error) {
					console.error(
						`Failed to delete from ${table}:`,
						error.message
					);
				}
			}

			// Delete from friend_status where user is sender or receiver
			const { error: friendStatusError } = await supabase
				.from("friend_status")
				.delete()
				.or(`sender_id${id},receiver_id${id}`);

			if (friendStatusError) {
				console.error(
					"Failed to delete from friend_status:",
					friendStatusError.message
				);
			}

			// Delete from profiles (assuming 'id' is the user's id)
			const { error: profileError } = await supabase
				.from("profiles")
				.delete()
				.eq("id", id);
			if (profileError) {
				console.error(
					"Failed to delete from profiles:",
					profileError.message
				);
			}

			await supabase.auth.signOut();
			const { error } = await supabase.auth.admin.deleteUser(id);
			if (error) {
				toast.error("Error deleting user");
				return;
			}
		} catch (error) {
			toast.error("Unexpected error during user deletion:");
		} finally {
			if (email) {
				toast.success(`Successfully delete account: ${email}`);
			}
			resetStorage();
			loader.done();
		}
	};

	return (
		<div className="flex flex-col md:flex-row min-h-screen">
			<aside className="w-full md:w-[15vw] md:fixed z-20">
				<div
					className="relative h-[500px] md:h-screen text-white flex flex-col justify-between"
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
								loading="lazy"
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
					<div className="p-4 border-t border-white/20 relative z-10">
						<UserDropdown
							handleLogoutModal={handleLogoutModal}
							handleDeleteModal={handleDeleteModal}
						/>
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
