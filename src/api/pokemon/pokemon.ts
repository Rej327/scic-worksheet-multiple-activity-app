import { supabase } from "@/helper/connection";

export const fetchPhotos = async (
  sortBy: 'name' | 'upload_date',
  page: number,
  limit: number,
  search: string
) => {
  const offset = (page - 1) * limit;
  let query = supabase
    .from('photos')
    .select('*')
    .order(sortBy, { ascending: true })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching photos:', error);
    return [];
  }

  return data || [];
};