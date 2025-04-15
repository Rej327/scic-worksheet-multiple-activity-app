"use client";

import Link from "next/link";
import React from "react";
import { AiFillFileMarkdown } from "react-icons/ai";
import { FaGoogleDrive, FaHome } from "react-icons/fa";
import { LuListTodo } from "react-icons/lu";
import { MdCatchingPokemon, MdFastfood } from "react-icons/md";

export default function Dashboard() {
	const secretPages = [
		{
			id: "1",
			title: "Todo List",
			link: "/activity/todo-list",
			icon: <LuListTodo size={50} />,
		},
		{
			id: "2",
			title: "Google Drive 'Lite'",
			link: "/activity/google-drive-lite",
			icon: <FaGoogleDrive size={50} />,
		},
		{
			id: "3",
			title: "Food Review",
			link: "/activity/food-review-app",
			icon: <MdFastfood size={50} />,
		},
		{
			id: "4",
			title: "Pokemon Review App",
			link: "/activity/pokemon-review-app",
			icon: <MdCatchingPokemon size={50} />,
		},
		{
			id: "5",
			title: "Markdown Notes App",
			link: "/activity/markdown-notes-app",
			icon: <AiFillFileMarkdown size={50} />,
		},
	];

	return (
		<div className="w-auto">
			<div className="flex items-center gap-2 my-2 text-green-950">
				<FaHome size={25} className="text-green-950" />
				<h1 className="text-2xl uppercase font-semibold tracking-wider">
					Dashboard
				</h1>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
				{secretPages.map((page) => (
					<Link href={page.link} key={page.id}>
						<div className="bg-white hover:bg-green-200 cursor-pointer rounded-2xl shadow-md p-6 flex flex-col items-center justify-evenly h-48 transition duration-300 ease-in-out">
							<div className="text-green-700">{page.icon}</div>
							<div className="text-lg font-semibold text-center text-green-900">
								{page.title}
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
