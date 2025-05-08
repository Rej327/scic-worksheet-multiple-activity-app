"use client";

import { NoteDetailProps } from "@/types/notes";

const levelStyles: Record<string, string> = {
	low: "bg-green-200 text-green-800",
	medium: "bg-yellow-200 text-yellow-800",
	high: "bg-red-200 text-red-800",
};

export default function TodoDetail({ note, onEdit, onClose }: NoteDetailProps) {
	return (
		<div className="space-y-4">
			<p
				className={`capitalize w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
					levelStyles[note.level.toLowerCase()] ||
					"bg-gray-200 text-gray-800"
				}`}
			>
				{note.level}
			</p>
			<p className="border border-gray-300 shadow-md rounded-md p-4 bg-green-50 text-sm  focus:outline-none focus:shadow-md hover:shadow-md duration-300">
				{note.content}
			</p>
			<div className="mb-2 text-sm text-gray-500">
				<p>
					Created: {new Date(note.created_at).toLocaleString()} |
					Updated: {new Date(note.updated_at).toLocaleString()}
				</p>
			</div>
			<div className="flex justify-end space-x-2 ">
				<button
					onClick={onClose}
					className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition-colors duration-300 cursor-pointer"
				>
					Close
				</button>
				<button
					onClick={onEdit}
					className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-300 cursor-pointer"
				>
					Edit Note
				</button>
			</div>
		</div>
	);
}
