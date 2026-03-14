import PropertyForm from '@/components/admin/PropertyForm';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the property
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !property) {
    console.error('Error fetching property for edit:', error);
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sf-pro">
              <li>
                <Link href="/admin/properties" className="hover:text-primary transition-colors">Properties</Link>
              </li>
              <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
              <li aria-current="page" className="text-nordic">Edit Listing</li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic tracking-tight mb-2">Edit &quot;{property.title}&quot;</h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal font-sf-pro">
              Update the details below to edit the listing. Fields marked with * are mandatory.
            </p>
          </div>
        </div>
      </header>

      <PropertyForm initialData={property} />
    </div>
  );
}
