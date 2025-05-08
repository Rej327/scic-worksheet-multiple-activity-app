import React, { useEffect } from "react";
import { CiClock1 } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import IconWithTooltip from "@/components/tools/IconWithTooltip";
import { TodoCardProps } from "@/types/todos";

const TodoNotes: React.FC<TodoCardProps> = ({
	note,
	onViewNote,
	onEditNote,
	onDeleteNote,
}) => {
	const levelStyles: Record<string, string> = {
		low: "bg-green-200 text-green-800",
		medium: "bg-yellow-200 text-yellow-800",
		high: "bg-red-200 text-red-800",
	};

	return (
		<div
			className="break-inside-avoid border border-green-100 rounded-lg p-4 bg-white shadow hover:shadow-xl hover:border-green-800 transition-shadow duration-300 delay-75 cursor-pointer"
			onClick={() => onViewNote(note.id)}
		>
			<p
				className={`capitalize w-fit rounded-full px-2 py-0.5 ml-auto text-xs font-medium ${
					levelStyles[note.level.toLowerCase()] ||
					"bg-gray-200 text-gray-800"
				}`}
			>
				{note.level}
			</p>
			<h3 className="font-semibold text-lg mb-2 truncate text-green-950">
				{note.title}
			</h3>
			<p className="text-gray-600 text-sm mb-3 line-clamp-3">
				{note.content.substring(0, 120)}
				{note.content.length > 120 ? "..." : ""}
			</p>
			<div className="flex justify-between items-center text-xs text-gray-500">
				<div className="flex gap-1 items-center">
					<CiClock1 size={20} />
					<p>
						Updated:{" "}
						{new Date(note.updated_at).toLocaleDateString()}
					</p>
				</div>
				<div className="flex space-x-2">
					<IconWithTooltip
						icon={
							<FaEdit
								size={20}
								onClick={(e) => {
									e.stopPropagation();
									onEditNote(note);
								}}
							/>
						}
						className="text-black/50 hover:text-green-950 transition-colors duration-300"
						text="Edit note"
					/>
					<IconWithTooltip
						icon={
							<MdDelete
								size={20}
								onClick={(e) => {
									e.stopPropagation();
									onDeleteNote(note.id);
								}}
							/>
						}
						className="text-black/50 hover:text-red-700 transition-colors duration-300"
						text="Delete note"
					/>
				</div>
			</div>
		</div>
	);
};

export default TodoNotes;
