import { supabase } from "@/helper/connection";
import { Note } from "@/types/notes";

export const getNotes = async (page: number, pageSize: number) => {
	const result = await supabase
		.from("todos")
		.select("*")
		.order("created_at", { ascending: false })
		.range((page - 1) * pageSize, page * pageSize - 1);

	return result;
};

export const getNoteById = async (id: string) => {
	const { data, error } = await supabase
		.from("todos")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching note:", error);
		return null;
	}

	return data as Note;
};

export const createNote = async (title: string, content: string) => {
	const { data: userData } = await supabase.auth.getUser();

	if (!userData.user) {
		console.error("User not authenticated");
		return null;
	}

	const { data, error } = await supabase
		.from("todos")
		.insert([
			{
				title,
				content,
				user_id: userData.user.id,
			},
		])
		.select();

	if (error) {
		console.error("Error creating note:", error);
		return null;
	}

	return data[0] as Note;
};

export const updateNote = async (
	id: string,
	title: string,
	content: string
) => {
	const { data, error } = await supabase
		.from("todos")
		.update({ title, content, updated_at: new Date().toISOString() })
		.eq("id", id)
		.select();

	if (error) {
		console.error("Error updating note:", error);
		return null;
	}

	return data[0] as Note;
};

export const deleteNote = async (id: string) => {
	const { error } = await supabase.from("todos").delete().eq("id", id);

	if (error) {
		console.error("Error deleting note:", error);
		return false;
	}

	return true;
};
