'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Property } from '@/lib/properties';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createProperty(formData: FormData) {
  const supabase = await createClient();
  
  // Extract images array (can be JSON stringified from client)
  const imagesRaw = formData.get('images')?.toString() || '[]';
  let images: string[] = [];
  try {
    images = JSON.parse(imagesRaw);
  } catch (e) {
    console.error('Failed to parse images', e);
  }

  // Extract amenities array
  const amenitiesRaw = formData.get('amenities')?.toString() || '[]';
  let amenities: string[] = [];
  try {
    amenities = JSON.parse(amenitiesRaw);
  } catch (e) {
    console.error('Failed to parse amenities', e);
  }

  const title = formData.get('title')?.toString() || '';
  const slug = generateSlug(title);

  const propertyData = {
    title,
    slug,
    location: formData.get('location')?.toString() || '',
    price: formData.get('price')?.toString() || '0',
    beds: Number(formData.get('beds') || 0),
    baths: Number(formData.get('baths') || 0),
    area: formData.get('area')?.toString() || '',
    images,
    badge: formData.get('badge')?.toString() || 'Active', // Map status to badge
    is_featured: formData.get('is_featured') === 'on',
    description: formData.get('description')?.toString() || '',
    property_type: formData.get('property_type')?.toString() || 'apartment',
    year_built: formData.get('year_built') ? Number(formData.get('year_built')) : null,
    parking: Number(formData.get('parking') || 0),
    amenities,
  };

  const { data, error } = await supabase
    .from('properties')
    .insert([propertyData])
    .select()
    .single();

  if (error) {
    console.error('Error creating property:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/properties');
  revalidatePath('/properties');
  
  return { success: true, data };
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient();
  
  // Extract images array
  const imagesRaw = formData.get('images')?.toString();
  let images: string[] | undefined;
  if (imagesRaw) {
    try {
      images = JSON.parse(imagesRaw);
    } catch (e) {
      console.error('Failed to parse images', e);
    }
  }

  // Extract amenities array
  const amenitiesRaw = formData.get('amenities')?.toString();
  let amenities: string[] | undefined;
  if (amenitiesRaw) {
    try {
      amenities = JSON.parse(amenitiesRaw);
    } catch (e) {
      console.error('Failed to parse amenities', e);
    }
  }

  const propertyData: any = {
    title: formData.get('title')?.toString(),
    location: formData.get('location')?.toString(),
    price: formData.get('price')?.toString(),
    beds: formData.get('beds') !== null ? Number(formData.get('beds')) : undefined,
    baths: formData.get('baths') !== null ? Number(formData.get('baths')) : undefined,
    area: formData.get('area')?.toString(),
    badge: formData.get('badge')?.toString(),
    description: formData.get('description')?.toString(),
    property_type: formData.get('property_type')?.toString(),
    year_built: formData.get('year_built') ? Number(formData.get('year_built')) : null,
    parking: formData.get('parking') !== null ? Number(formData.get('parking')) : undefined,
  };

  if (formData.has('is_featured')) {
    propertyData.is_featured = formData.get('is_featured') === 'on';
  }

  // Only update fields that are provided
  Object.keys(propertyData).forEach(key => {
    if (propertyData[key] === undefined) {
      delete propertyData[key];
    }
  });

  if (images) propertyData.images = images;
  if (amenities) propertyData.amenities = amenities;

  // If title is updated, update slug? Usually don't update slug to avoid breaking links, 
  // but if needed, we could. Let's leave slug alone on update for now.

  const { data, error } = await supabase
    .from('properties')
    .update(propertyData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating property:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/properties');
  revalidatePath(`/admin/properties/${id}/edit`);
  revalidatePath('/properties');
  if (data?.slug) {
    revalidatePath(`/properties/${data.slug}`);
  }

  return { success: true, data };
}
