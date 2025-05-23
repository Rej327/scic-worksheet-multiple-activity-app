"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { useTopLoader } from "nextjs-toploader";
import {
	clearTodoStorage,
	loadFromStorage,
	LOCAL_STORAGE_KEYS,
	saveToStorage,
} from "@/utils/inputsData";
import IsSubmitting from "../tools/IsSubmitting";

interface MarkdownEditorProps {
	initialContent?: string;
	initialTitle?: string;
	initialLevel?: string;
	onSave: (title: string, content: string, level: string) => void;
	onCancel: () => void;
	isEditing?: boolean;
}

const TodoEditor: React.FC<MarkdownEditorProps> = ({
	initialContent = "",
	initialTitle = "",
	initialLevel = "",
	onSave,
	onCancel,
}) => {
	const [title, setTitle] = useState(() =>
		loadFromStorage(LOCAL_STORAGE_KEYS.todoTitle, initialTitle)
	);
	const [content, setContent] = useState(() =>
		loadFromStorage(LOCAL_STORAGE_KEYS.todoContent, initialContent)
	);
	const [mode, setMode] = useState<"edit" | "create">("edit");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [errors, setErrors] = useState<{ title?: string; content?: string }>(
		{}
	);
	const loader = useTopLoader();

	//added state
	const [level, setLevel] = useState<string>(() =>
		loadFromStorage(LOCAL_STORAGE_KEYS.level, initialLevel)
	);

	useEffect(() => {
		saveToStorage(LOCAL_STORAGE_KEYS.level, level);
	}, [level]);

	// Sync title to localStorage
	useEffect(() => {
		saveToStorage(LOCAL_STORAGE_KEYS.todoTitle, title);
	}, [title]);

	// Sync content to localStorage
	useEffect(() => {
		saveToStorage(LOCAL_STORAGE_KEYS.todoContent, content);
	}, [content]);

	const validate = () => {
		const newErrors: typeof errors = {};
		if (!title) newErrors.title = "* Title is required.";
		else if (title.length < 2)
			newErrors.title = "* Title must be at least 2 characters.";
		if (!content) newErrors.content = "* Content is required.";
		else if (content.length < 5)
			newErrors.content = "* Content must be at least 5 characters.";

		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			setTimeout(() => {
				setErrors({});
			}, 3000);
		}
		loader.done();
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setIsSubmitting(true);
		setIsEditing(true);
		loader.setProgress(0.25);
		try {
			await onSave(title, content, level);
		} catch (error) {
			console.error("Error saving note:", error);
			toast.error("Note failed to add!");
		} finally {
			setTitle("");
			setContent("");
			clearTodoStorage();
			setIsSubmitting(false);
			setIsEditing(false);
			loader.done();
			toast.success("New note added!");
		}
	};

	const handleCancel = () => {
		loader.setProgress(0.25);
		clearTodoStorage();
		onCancel();
		setTitle("");
		setContent("");
		setLevel("");
		loader.done();
	};

	return (
		<div className="space-y-4">
			<div
				onClick={() => mode === "edit"}
				className="flex items-center w-fit mb-4 gap-1 px-3 py-1 rounded-md transition-colors duration-300 bg-green-600 text-white"
			>
				<FaEdit size={15} />
				<p>Edit</p>
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
						data-testid="note-title"
						type="text"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:shadow-md hover:shadow-md duration-300"
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
								Content
							</label>
							{errors.content && (
								<p className="text-red-500 text-sm mt-1">
									{errors.content}
								</p>
							)}
						</div>
						<textarea
							data-testid="note-content"
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[300px] focus:outline-none focus:shadow-md hover:shadow-md duration-300"
							placeholder="Write your note"
						/>
					</div>
				) : (
					<div className="border border-gray-300 rounded-md p-4 min-h-[300px] prose max-w-none shadow-md">
						<h3 className="text-lg font-bold text-green-950">
							{title}
						</h3>
						{errors.content && (
							<p className="text-red-500 text-sm mt-1 text-right">
								{errors.content}
							</p>
						)}
					</div>
				)}
				<p className="mb-1 font-medium text-green-950">Select Level</p>
				<div className="flex gap-4">
					{["LOW", "MEDIUM", "HIGH"].map((lvl) => {
						const isSelected = level === lvl;
						const levelColors: Record<string, string> = {
							LOW: "border-green-500 text-green-700 bg-green-100",
							MEDIUM: "border-yellow-500 text-yellow-700 bg-yellow-100",
							HIGH: "border-red-500 text-red-700 bg-red-100",
						};

						return (
							<label
								key={lvl}
								className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all
          ${
				isSelected
					? levelColors[lvl]
					: "border-gray-300 text-gray-600 hover:bg-gray-100"
			}
        `}
							>
								<input
									type="radio"
									name="level"
									value={lvl}
									checked={isSelected}
									onChange={() => setLevel(lvl)}
									className="hidden"
								/>
								{lvl}
							</label>
						);
					})}
				</div>

				<div className="flex justify-end space-x-2">
					<button
						data-testid="cancel-button"
						type="button"
						onClick={handleCancel}
						className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md cursor-pointer"
					>
						Cancel
					</button>
					<button
						data-testid="save-button"
						type="submit"
						className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors duration-300 ${
							isEditing
								? "bg-gray-400 cursor-not-allowed"
								: "bg-green-600 hover:bg-green-700 cursor-pointer"
						} text-white`}
						disabled={isEditing}
					>
						{isSubmitting
							? isEditing && "Saving "
							: isEditing
							? "Update Note"
							: "Save Note"}
						{isSubmitting && <IsSubmitting />}
					</button>
				</div>
			</form>
		</div>
	);
};

export default TodoEditor;
