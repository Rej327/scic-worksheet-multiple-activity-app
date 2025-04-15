import React from "react";

export default function MainHeader({
	icon,
	title,
}: {
	icon: React.ReactNode;
	title: string;
}) {
	return (
		<div className="flex items-center gap-2 my-2 text-green-950">
			{icon}
			<h1 className="text-2xl uppercase font-semibold tracking-wider">
				{title}
			</h1>
		</div>
	);
}
