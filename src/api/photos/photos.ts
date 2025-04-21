import { supabase } from "@/helper/connection";

export const getPhotos = async ({
	userId,
	currentCategory,
	sortBy,
	order,
}: {
	userId: string;
	currentCategory: string;
	sortBy: "name" | "upload_date";
	order: "asc" | "desc";
}) => {
	const result = await supabase
		.from("photos")
		.select("*")
		.eq("user_id", userId)
		.eq("category", currentCategory)
		.order(sortBy, { ascending: order === "asc" });
		

	return result;
};

export const deletePhotoById = async (id: string) => {
	const result = await supabase.from("photos").delete().eq("id", id);
	return result;
};

export const deletePhotoInSupabaseStorage = async (filePath: string) => {
	const result = await supabase.storage.from("images").remove([filePath]);
	return result;
};
export const getPhotoUrl = (fileName: string) => {
	const result = supabase.storage.from("images").getPublicUrl(fileName);

	return result;
};

export const updatePhotoById = async ({
	name,
	image_url,
	id,
}: {
	name: string;
	image_url: string;
	id: string;
}) => {
	const result = await supabase
		.from("photos")
		.update({ name: name, image_url: image_url })
		.eq("id", id);

	return result;
};
