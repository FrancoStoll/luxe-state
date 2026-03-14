import { createClient } from '@/lib/supabase/server';
import { Property } from '@/lib/properties';

export default async function AdminPropertiesPage() {
  const supabase = await createClient();
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-nordic-dark">Manage Properties</h1>
        <button className="bg-mosque text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all">
          Add New Property
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-nordic-dark/10">
        <table className="w-full text-left">
          <thead className="bg-nordic-light border-b border-nordic-dark/10">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-nordic-dark/60">Property</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-nordic-dark/60">Location</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-nordic-dark/60">Price</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-nordic-dark/60">Badge</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-nordic-dark/60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nordic-dark/5">
            {properties?.map((property: Property) => (
              <tr key={property.id} className="hover:bg-nordic-light/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={property.images[0]} 
                      alt={property.title} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <span className="font-semibold text-nordic-dark">{property.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-nordic-dark/70 font-medium">{property.location}</td>
                <td className="px-6 py-4 text-mosque font-bold">{property.price}</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-nordic-dark text-white uppercase">
                    {property.badge || 'None'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-nordic-dark/40 hover:text-mosque transition-colors font-bold mr-4">Edit</button>
                  <button className="text-nordic-dark/40 hover:text-red-500 transition-colors font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
