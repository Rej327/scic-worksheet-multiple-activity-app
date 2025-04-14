"use client";

import { Note } from "@/types/notes";
import { useState } from "react";
import { FaDrawPolygon, FaEye } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface NoteDetailProps {
	note: Note;
	onEdit: () => void;
	onClose: () => void;
}

export default function NoteDetail({ note, onEdit, onClose }: NoteDetailProps) {
	const [mode, setMode] = useState<"preview" | "raw">("preview");

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center mb-4">
				<div className="flex gap-2">
					<button
						onClick={() => setMode("preview")}
						className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors duration-300 cursor-pointer ${
							mode === "preview"
								? "bg-green-600 text-white"
								: "bg-gray-200 hover:bg-gray-300"
						}`}
					>
						<FaEye size={15} />
						Preview
					</button>
					<button
						onClick={() => setMode("raw")}
						className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors duration-300 cursor-pointer ${
							mode === "raw"
								? "bg-green-600 text-white"
								: "bg-gray-200 hover:bg-gray-300"
						}`}
					>
						<FaDrawPolygon size={15} />
						Raw
					</button>
				</div>
			</div>

			<div className="mb-2 text-sm text-gray-500">
				Created: {new Date(note.created_at).toLocaleString()} | Updated:{" "}
				{new Date(note.updated_at).toLocaleString()}
			</div>

			{mode === "preview" ? (
				<div className="border border-gray-300 shadow-md rounded-md p-4 prose max-w-none">
					<ReactMarkdown>{note.content}</ReactMarkdown>
				</div>
			) : (
				<pre className="border border-gray-300 shadow-md rounded-md p-4 bg-green-50 font-mono text-sm overflow-x-auto">
					{note.content}
				</pre>
			)}

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
