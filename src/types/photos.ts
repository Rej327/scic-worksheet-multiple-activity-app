export interface AddPhotoModalProps {
	isOpen: boolean;
	onClose: () => void;
	onPhotoAdded: () => void; // Callback to refresh the photo grid
}

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export interface HeaderProps {
	onSearch: (searchTerm: string) => void;
	onAddPhoto: () => void;
}

export interface Photo {
	image_url?: string;
	id: string;
	name: string;
	url: string;
	user_id: string; // User ID associated with the photo
}

export interface Review {
	id: string;
	content: string;
	created_at: string;
	user_id: string; // User ID of the review author
}

export interface PhotoDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	photo: Photo | null;
}

export type PhotoGridProps = {
	sortBy: "name" | "upload_date";
	order: "asc" | "desc";
	refreshFlag: boolean;
	search: string;
	onPhotoClick: (photo: PhotoProps) => void;
};

export type PhotoProps = {
	id: string;
	name: string;
	image_url: string;
	upload_date: string;
};

export interface SortingControlsProps {
	sortBy: "name" | "upload_date";
	setSortBy: (field: "name" | "upload_date") => void;
	setOrderBy: (order: "asc" | "desc") => void;
}
