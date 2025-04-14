import { supabase } from "@/helper/connection";
import { Note } from "@/types/notes";


export async function getNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
  
  return data as Note[];
}

export async function getNoteById(id: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching note:', error);
    return null;
  }
  
  return data as Note;
}

export async function createNote(title: string, content: string) {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    console.error('User not authenticated');
    return null;
  }
  
  const { data, error } = await supabase
    .from('notes')
    .insert([
      { 
        title, 
        content,
        user_id: userData.user.id
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating note:', error);
    return null;
  }
  
  return data[0] as Note;
}

export async function updateNote(id: string, title: string, content: string) {
  const { data, error } = await supabase
    .from('notes')
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating note:', error);
    return null;
  }
  
  return data[0] as Note;
}

export async function deleteNote(id: string) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting note:', error);
    return false;
  }
  
  return true;
}