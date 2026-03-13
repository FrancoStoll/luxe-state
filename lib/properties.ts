import { createServerClient } from '@/lib/supabase/server';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  image: string;
  badge: string;
  badge_color: 'mosque' | 'nordic-dark' | 'white' | null;
  is_featured: boolean;
  is_new: boolean;
  created_at: string;
}

const PAGE_SIZE = 8;

export async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
  return data ?? [];
}

export async function getProperties(
  page: number
): Promise<{ properties: Property[]; totalCount: number; totalPages: number }> {
  const supabase = createServerClient();

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_featured', false)
    .order('created_at', { ascending: true })
    .range(from, to);

  if (error) {
    console.error('Error fetching properties:', error);
    return { properties: [], totalCount: 0, totalPages: 0 };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return { properties: data ?? [], totalCount, totalPages };
}
