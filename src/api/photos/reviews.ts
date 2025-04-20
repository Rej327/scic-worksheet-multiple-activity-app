import { supabase } from "@/helper/connection";

export const getReviewsById = async (photoId: string) => {
	const result = await supabase
		.from("reviews")
		.select("*")
		.eq("photo_id", photoId);

	return result;
};

export const addReviewsToSelectedPhoto = async ({
	photoId,
	content,
	userId,
}: {
	photoId: string;
	content: string;
	userId: string;
}) => {
	const result = await supabase.from("reviews").insert({
		photo_id: photoId,
		content: content,
		user_id: userId,
	});

	return result;
};

export const editReviewToSelectedPhoto = async ({
	editingContent,
	id,
}: {
	editingContent: string;
	id: string;
}) => {
	const result = await supabase
		.from("reviews")
		.update({ content: editingContent })
		.eq("id", id);
	return result;
};

export const deleteReviewById = async (id: string) => {
	const result = await supabase.from("reviews").delete().eq("id", id);

	return result;
};
