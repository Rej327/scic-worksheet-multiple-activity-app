import React from "react";

type IconWithTooltipProps = {
	text: string;
	onClick?: () => void;
	className?: string;
	icon: React.ReactNode;
};

export default function IconWithTooltip({
	text,
	onClick,
	className,
	icon,
}: IconWithTooltipProps) {
	return (
		<div className="relative group">
			<button
				className={`cursor-pointer transition ${className}`}
				onClick={onClick}
			>
				{icon}
			</button>

			{/* Tooltip label */}
			<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-40 p-2 bg-white text-sm text-center text-[#575757] rounded shadow opacity-0 translate-y-2 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300 ease-in-out z-10">
				{text}
			</div>
		</div>
	);
}
