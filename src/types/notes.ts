export type Note = {
	id: string;
	title: string;
	content: string;
	created_at: string;
	updated_at: string;
	user_id: string;
};

export type ModalType = "none" | "create" | "view" | "edit";

export type NoteDetailProps = {
	note: Note;
	onEdit: () => void;
	onClose: () => void;
};
