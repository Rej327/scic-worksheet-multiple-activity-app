"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaEye } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
	initialContent?: string;
	initialTitle?: string;
	onSave: (title: string, content: string) => void;
	onCancel: () => void;
	isEditing?: boolean;
}

export default function MarkdownEditor({
	initialContent = "",
	initialTitle = "",
	onSave,
	onCancel,
	isEditing = false,
}: MarkdownEditorProps) {
	const [title, setTitle] = useState(initialTitle);
	const [content, setContent] = useState(initialContent);
	const [mode, setMode] = useState<"edit" | "preview">("edit");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<{
		title?: string;
		content?: string;
	}>({});

	const validate = () => {
		const newErrors: typeof errors = {};
		if (!title) newErrors.title = "* Title is required.";
		else if (title.length < 2)
			newErrors.title = "* Content must be at least 2 characters.";

		if (!content) newErrors.content = "* Content is required.";
		else if (content.length < 5)
			newErrors.content = "* Content must be at least 5 characters.";

		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			setTimeout(() => {
				setErrors({});
			}, 3000);
		}

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		setIsSubmitting(true);
		try {
			onSave(title, content);
			setIsSubmitting(false);
			toast.success("Note saved!");
		} catch (error) {
			console.error("Error saving note:", error);
			setIsSubmitting(false);
			toast.success("Note save failed!");
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center mb-4">
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setMode("edit")}
						className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors duration-300 cursor-pointer ${
							mode === "edit"
								? "bg-green-600 text-white"
								: "bg-gray-200 hover:bg-gray-300"
						}`}
					>
						<FaEdit size={15} /> Edit
					</button>
					<button
						type="button"
						onClick={() => setMode("preview")}
						className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors duration-300 cursor-pointer ${
							mode === "preview"
								? "bg-green-600 text-white"
								: "bg-gray-200 hover:bg-gray-300"
						}`}
					>
						<FaEye size={15} /> Preview
					</button>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<div className="flex justify-between items-center">
						<label
							htmlFor="title"
							className="block mb-1 font-medium text-green-950"
						>
							Title
						</label>
						{errors.title && (
							<p className="text-red-500 text-sm mt-1">
								{errors.title}
							</p>
						)}
					</div>
					<input
						type="text"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900 shadow-md transition-all duration-300"
						placeholder="Note title"
					/>
				</div>

				{mode === "edit" ? (
					<div>
						<div className="flex justify-between items-center">
							<label
								htmlFor="content"
								className="block mb-1 font-medium text-green-950"
							>
								Content (Markdown)
							</label>
							{errors.content && (
								<p className="text-red-500 text-sm mt-1">
									{errors.content}
								</p>
							)}
						</div>
						<textarea
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[300px] font-mono focus:outline-none focus:ring-2 focus:ring-green-900 shadow-md transition-all duration-300"
							placeholder="Write your note in Markdown..."
						/>
					</div>
				) : (
					<div>
						{errors.content && (
							<p className="text-red-500 text-sm mt-1 text-right">
								{errors.content}
							</p>
						)}
						<div className="border border-gray-300 rounded-md p-4 min-h-[300px] prose max-w-none shadow-md">
							<h3 className="text-lg font-bold text-green-950">
								{title}
							</h3>
							<ReactMarkdown>{content}</ReactMarkdown>
						</div>
					</div>
				)}

				<div className="flex justify-end space-x-2">
					<button
						type="button"
						onClick={onCancel}
						className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition-colors duration-300 cursor-pointer"
						disabled={isSubmitting}
					>
						Cancel
					</button>
					<button
						type="submit"
						className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-300 cursor-pointer"
						disabled={isSubmitting}
					>
						{isSubmitting
							? isEditing
								? "Updating "
								: "Saving "
							: isEditing
							? "Update Note"
							: "Save Note"}
						{isSubmitting && (
							<svg
								className="animate-spin h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
								></path>
							</svg>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
