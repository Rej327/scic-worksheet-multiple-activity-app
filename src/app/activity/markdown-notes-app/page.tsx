"use client";

import {
	getNotes,
	createNote,
	deleteNote,
	getNoteById,
	updateNote,
} from "@/api/markdown/notes";
import MarkdownEditor from "@/components/markdown/MarkdownEditor";
import Modal from "@/components/markdown/Modal";
import NoteDetail from "@/components/markdown/NoteDetail";
import { ModalType, Note } from "@/types/notes";
import { useState, useEffect } from "react";
import NextTopLoader, { useTopLoader } from "nextjs-toploader";
import ConfirmationDeleteModal from "@/components/ConfirmationModal";
import SpinnerLoading from "@/components/SpinnerLoading";
import { CiCirclePlus, CiClock1 } from "react-icons/ci";
import { FaEdit, FaPlus } from "react-icons/fa";
import IconWithTooltip from "@/components/IconWithTooltip";
import { MdDelete } from "react-icons/md";

export default function Home() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);
	const [modalType, setModalType] = useState<ModalType>("none");
	const [searchQuery, setSearchQuery] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [isSetVisible, setIsSetVisible] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [noteToDeleteId, setNoteToDeleteId] = useState<string | null>(null);
	const [debounceQuery, setDebounceQuery] = useState<string>("");
	const loader = useTopLoader();

	// Load notes
	useEffect(() => {
		const fetchNotes = async () => {
			try {
				const fetchedNotes = await getNotes();
				setNotes(fetchedNotes);
			} catch (error) {
				throw new Error();
			} finally {
				setLoading(false);
			}
		};

		fetchNotes();
	}, []);

	useEffect(() => {
		const debounce = setTimeout(() => {
			setDebounceQuery(searchQuery);
		}, 1500);

		return () => clearTimeout(debounce);
	}, [searchQuery]);

	// Effect to control modal visibility with transitions
	useEffect(() => {
		if (modalType !== "none") {
			setModalOpen(true);
			setIsSetVisible(true); // Set it visible when modal is open
		} else {
			setModalOpen(false);
			setIsSetVisible(false); // Hide modal contents when closed
		}
	}, [modalType]);

	// Handle creating a new note
	const handleCreateNote = async (title: string, content: string) => {
		const newNote = await createNote(title, content);
		if (newNote) {
			setNotes([newNote, ...notes]);
			closeModal();
		}
	};

	// Handle updating a note
	const handleUpdateNote = async (title: string, content: string) => {
		if (!selectedNote) return;

		const updatedNote = await updateNote(selectedNote.id, title, content);
		if (updatedNote) {
			setNotes(
				notes.map((note) =>
					note.id === updatedNote.id ? updatedNote : note
				)
			);
			setSelectedNote(updatedNote);
			setModalType("view");
		}
	};

	// Handle deleting a note
	const handleDeleteNote = (id: string) => {
		setNoteToDeleteId(id);
		setShowDeleteModal(true);
	};

	const confirmDeleteNote = async () => {
		if (!noteToDeleteId) return;

		const success = await deleteNote(noteToDeleteId);
		if (success) {
			setNotes(notes.filter((note) => note.id !== noteToDeleteId));
			if (selectedNote && selectedNote.id === noteToDeleteId) {
				closeModal();
			}
		}
		setNoteToDeleteId(null);
		setShowDeleteModal(false);
	};

	// Open a note for viewing
	const openViewModal = async (noteId: string) => {
		loader.start();
		try {
			const note = await getNoteById(noteId);
			if (note) {
				setSelectedNote(note);
				setModalType("view");
			}
			loader.setProgress(.5);
		} catch (error) {
			throw new Error();
		} finally {
			loader.done();
		}
	};

	// Open a note for editing
	const openEditModal = (note: Note) => {
		setSelectedNote(note);
		setModalType("edit");
	};

	// Open create note modal
	const openCreateModal = () => {
		setSelectedNote(null);
		setModalType("create");
	};

	// Close any open modal with transition
	const closeModal = () => {
		setModalType("none");
	};

	// Filter notes based on search query
	const filteredNotes = notes.filter(
		(note) =>
			note.title
				.toLowerCase()
				.includes(searchQuery && debounceQuery.toLowerCase()) ||
			note.content
				.toLowerCase()
				.includes(searchQuery && debounceQuery.toLowerCase())
	);

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-center mb-8">
				<h1 className="text-3xl font-bold mb-4 sm:mb-0 text-green-950">
					Markdown Notes
				</h1>

				<IconWithTooltip
					icon={<FaPlus size={20} />}
					className="text-white bg-green-600 hover:bg-green-700 p-2 rounded-md transition-colors duration-300 cursor-pointer"
					text="New Note"
					onClick={openCreateModal}
				/>
			</div>

			{/* Search Bar */}
			<div className="mb-6">
				<form
					onSubmit={(e) => {
						e.preventDefault(); // Prevent the default form submission
						// You can handle the search here if you need
						console.log("Search query submitted:", searchQuery);
					}}
				>
					<input
						type="text"
						placeholder="🔍 Search notes..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full px-4 py-2 border-b-2 border-green-800 focus:outline-none transition-all duration-300"
					/>
				</form>
			</div>

			{/* Notes Grid */}
			{loading ? (
				<SpinnerLoading />
			) : filteredNotes.length === 0 ? (
				<div className="text-center py-8 text-gray-500">
					{searchQuery
						? "No notes match your search"
						: "No notes yet. Create your first note!"}
				</div>
			) : (
				<div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
				{filteredNotes.map((note) => (
					<div
						key={note.id}
						className="break-inside-avoid border border-green-100 rounded-lg p-4 bg-white shadow hover:shadow-xl hover:border-green-800 transition-shadow duration-300 delay-75 cursor-pointer"
						onClick={() => openViewModal(note.id)}
					>
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
												openEditModal(note);
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
												handleDeleteNote(note.id);
											}}
										/>
									}
									className="text-black/50 hover:text-red-700 transition-colors duration-300"
									text="Delete note"
								/>
							</div>
						</div>
					</div>
				))}
			</div>
			
			)}

			{/* Modals */}

			{/* Delete Confirmation Modal */}
			<ConfirmationDeleteModal
				title="Delete"
				text="Are you sure you want to delete this note?"
				isOpen={showDeleteModal}
				onClose={() => {
					setShowDeleteModal(false);
					setNoteToDeleteId(null);
				}}
				onConfirm={confirmDeleteNote}
			/>

			{/* View Note Modal */}
			<Modal
				isOpen={modalType === "view" && modalOpen}
				onClose={closeModal}
				isSetVisible={isSetVisible}
				title={selectedNote?.title || ""}
				size="lg"
			>
				{selectedNote && (
					<NoteDetail
						note={selectedNote}
						onEdit={() => setModalType("edit")}
						onClose={closeModal}
						// isSetVisible={isSetVisible}
					/>
				)}
			</Modal>

			{/* Create Note Modal */}
			<Modal
				isOpen={modalType === "create" && modalOpen}
				onClose={closeModal}
				isSetVisible={isSetVisible}
				title="Create New Note"
				size="lg"
			>
				<MarkdownEditor
					onSave={handleCreateNote}
					onCancel={closeModal}
				/>
			</Modal>

			{/* Edit Note Modal */}
			<Modal
				isOpen={modalType === "edit" && modalOpen}
				onClose={closeModal}
				isSetVisible={isSetVisible}
				title="Edit Note"
				size="lg"
			>
				{selectedNote && (
					<MarkdownEditor
						initialTitle={selectedNote.title}
						initialContent={selectedNote.content}
						onSave={handleUpdateNote}
						onCancel={() => setModalType("view")}
						isEditing
					/>
				)}
			</Modal>
		</div>
	);
}
