"use client";

import {
	getNotes,
	createNote,
	deleteNote,
	getNoteById,
	updateNote,
} from "@/api/todo/todo";
import TodoEditor from "@/components/todo/TodoEditor";
import TodoDetail from "@/components/todo/TodoDetail";
import { ModalType, Note } from "@/types/notes";
import { useState, useEffect, useRef } from "react";
import { useTopLoader } from "nextjs-toploader";
import ConfirmationDeleteModal from "@/components/modal/ConfirmationModal";
import SpinnerLoading from "@/components/loader/SpinnerLoading";
import TodoHeader from "@/view/todo/TodoHeader";
import TodoNotes from "@/view/todo/TodoNotes";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { supabase } from "@/helper/connection";
import TodoModal from "@/components/todo/TodoModal";
import { clearStorage } from "@/utils/inputsData";

export default function page() {
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
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isFetching, setIsFetching] = useState(false);
	const observerRef = useRef<HTMLDivElement | null>(null);
	const loader = useTopLoader();
	const router = useRouter();

	useEffect(() => {
		loader.setProgress(0.25);
		const checkUser = async () => {
			const { data, error } = await supabase.auth.getUser();

			if (error || !data.user) {
				router.push("/");
			}
		};

		checkUser();
		loader.done();
	}, [router]);

	const fetchNotes = async (page: number) => {
		setIsFetching(true);

		const pageSize = 10;
		const { data, error } = await getNotes(page, pageSize);

		if (error) {
			console.error("Fetch error:", error);
			return;
		}

		if (data.length < pageSize) {
			setHasMore(false);
		}

		setLoading(false);
		setNotes((prev) => [...prev, ...data]);
		setIsFetching(false);
	};

	useEffect(() => {
		if (isFetching || !hasMore) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setPage((prev) => prev + 1);
					loader.setProgress(0.25);
				}
			},
			{ threshold: 1 }
		);

		if (observerRef.current) {
			observer.observe(observerRef.current);
		}

		return () => {
			if (observerRef.current) observer.unobserve(observerRef.current);
		};
	}, [isFetching, hasMore]);

	useEffect(() => {
		try {
			fetchNotes(page);
			loader.done();
		} catch {
			throw new Error();
		}
	}, [page]);

	useEffect(() => {
		loader.setProgress(0.25);
		const debounce = setTimeout(() => {
			setDebounceQuery(searchQuery);
			loader.done();
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
		loader.setProgress(0.25);
		try {
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
		loader.setProgress(0.25);
		try {
			const note = await getNoteById(noteId);
			if (note) {
				setSelectedNote(note);
				setModalType("view");
			}
			loader.setProgress(0.25);
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
		clearStorage();
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
			<TodoHeader
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				openCreateModal={openCreateModal}
			/>

			{/* Notes */}
			{loading ? (
				<SpinnerLoading />
			) : filteredNotes.length === 0 ? (
				<div className="text-center py-8 text-gray-500">
					{debounceQuery
						? "No notes match your search"
						: "No notes yet. Create your first note!"}
				</div>
			) : (
				<div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
					{filteredNotes.map((note, i) => (
						<div key={i} className="break-inside-avoid mb-4">
							<TodoNotes
								note={note}
								onViewNote={openViewModal}
								onEditNote={openEditModal}
								onDeleteNote={handleDeleteNote}
							/>
						</div>
					))}
					<div ref={observerRef} className="h-8" />
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
			<TodoModal
				isOpen={modalType === "view" && modalOpen}
				onClose={closeModal}
				isSetVisible={isSetVisible}
				title={selectedNote?.title || ""}
				size="lg"
			>
				{selectedNote && (
					<TodoDetail
						note={selectedNote}
						onEdit={() => setModalType("edit")}
						onClose={closeModal}
					/>
				)}
			</TodoModal>

			{/* Create Note Modal */}
			<TodoModal
				isOpen={modalType === "create" && modalOpen}
				onClose={closeModal}
				isSetVisible={isSetVisible}
				title="Create New Note"
				size="lg"
			>
				<TodoEditor onSave={handleCreateNote} onCancel={closeModal} />
			</TodoModal>

			{/* Edit Note Modal */}
			<TodoModal
				isOpen={modalType === "edit" && modalOpen}
				onClose={closeModal}
				isSetVisible={isSetVisible}
				title="Edit Note"
				size="lg"
			>
				{selectedNote && (
					<TodoEditor
						initialTitle={selectedNote.title}
						initialContent={selectedNote.content}
						onSave={handleUpdateNote}
						onCancel={() => setModalType("view")}
					/>
				)}
			</TodoModal>
		</div>
	);
}
