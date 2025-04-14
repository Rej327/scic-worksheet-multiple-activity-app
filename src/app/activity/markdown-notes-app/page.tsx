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
import { useTopLoader } from "nextjs-toploader";
import ConfirmationDeleteModal from "@/components/ConfirmationModal";
import SpinnerLoading from "@/components/SpinnerLoading";
import MarkdownHeader from "@/view/markdown/MarkDownHeader";
import MarkdownNotes from "@/view/markdown/MarkdownNotes";
import toast from "react-hot-toast";

export default function Markdown() {
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
			loader.start();
			try {
				const fetchedNotes = await getNotes();
				setNotes(fetchedNotes);
				loader.setProgress(0.5);
			} catch (error) {
				throw new Error();
			} finally {
				setLoading(false);
				loader.done();
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
		try {
			const newNote = await createNote(title, content);
			if (newNote) {
				setNotes([newNote, ...notes]);
				closeModal();
			}
		} catch (error) {
			throw new Error();
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
		loader.start();
		try {
			loader.setProgress(0.5);
			const success = await deleteNote(noteToDeleteId);
			if (success) {
				setNotes(notes.filter((note) => note.id !== noteToDeleteId));
				if (selectedNote && selectedNote.id === noteToDeleteId) {
					closeModal();
				}
			}
			setNoteToDeleteId(null);
			setShowDeleteModal(false);
		} catch (error) {
			throw new Error();
		} finally {
			toast.success("Delete Success!");
			loader.done();
		}
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
			loader.setProgress(0.5);
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
		<div className="max-w-[screen] overflow-hidden mx-auto px-4 py-8">
			{/* Header */}
			<MarkdownHeader
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				openCreateModal={openCreateModal}
			/>

			{/* Notes */}
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
						<MarkdownNotes
							key={note.id}
							note={note}
							onViewNote={openViewModal}
							onEditNote={openEditModal}
							onDeleteNote={handleDeleteNote}
						/>
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
					/>
				)}
			</Modal>
		</div>
	);
}
