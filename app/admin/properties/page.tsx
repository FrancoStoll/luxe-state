import { createClient } from '@/lib/supabase/server';
import { Property } from '@/lib/properties';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslation } from '@/lib/i18n-server';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  const { t } = await getTranslation();

  const pageSize = 6;
  const page = Number(params.page) || 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  // Fetch properties with pagination
  const { data: properties, count, error } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching properties:', error);
  }

  const totalProperties = count || 0;
  const totalPages = Math.ceil(totalProperties / pageSize);

  // Calculate some basic stats (these remain global for now)
  const totalListings = count || 0;
  
  const { data: allProps } = await supabase.from('properties').select('badge');
  const activeProperties = allProps?.filter(p => !p.badge || p.badge?.toLowerCase().includes('active')).length || 0;
  const pendingProperties = allProps?.filter(p => p.badge?.toLowerCase().includes('pending') || p.badge?.toLowerCase().includes('sold')).length || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-nordic tracking-tight">{t('admin.properties.title')}</h1>
          <p className="text-nordic-muted mt-1 text-sm">{t('admin.properties.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-nordic/10 text-nordic hover:bg-nordic/5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-soft inline-flex items-center gap-2">
            <span className="material-icons text-base">filter_list</span> {t('admin.properties.filter')}
          </button>
          <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2">
            <span className="material-icons text-base">add</span> {t('admin.properties.add_new')}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-primary/10 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-nordic-muted">{t('admin.properties.stats.total')}</p>
            <p className="text-2xl font-bold text-nordic mt-1">{totalListings}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-primary/10 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-nordic-muted">{t('admin.properties.stats.active')}</p>
            <p className="text-2xl font-bold text-nordic mt-1">{activeProperties}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-hint-of-green flex items-center justify-center text-primary">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-primary/10 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-nordic-muted">{t('admin.properties.stats.pending')}</p>
            <p className="text-2xl font-bold text-nordic mt-1">{pendingProperties}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <span className="material-icons">pending</span>
          </div>
        </div>
      </div>

      {/* Property List */}
      <div className="bg-white rounded-xl shadow-soft border border-nordic/10 overflow-hidden">
        {/* Simplified Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-nordic/5 border-b border-nordic/5 text-xs font-semibold text-nordic/50 uppercase tracking-wider">
          <div className="col-span-6">{t('admin.properties.table.details')}</div>
          <div className="col-span-2">{t('admin.properties.table.price')}</div>
          <div className="col-span-2">{t('admin.properties.table.status')}</div>
          <div className="col-span-2 text-right">{t('admin.properties.table.actions')}</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-nordic/5">
          {properties?.map((property: Property) => (
            <div key={property.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-nordic/5 transition-colors items-center">
              {/* Details */}
              <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                <div className="relative h-20 w-28 shrink-0 rounded-lg overflow-hidden bg-nordic/5">
                  <Image 
                    src={property.images[0]} 
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-nordic group-hover:text-primary transition-colors cursor-pointer">{property.title}</h3>
                  <p className="text-sm text-nordic-muted">{property.location}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-nordic-muted/60">
                    <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bed</span> {property.beds} {t('common.beds')}</span>
                    <span className="w-1 h-1 rounded-full bg-nordic/10"></span>
                    <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bathtub</span> {property.baths} {t('common.baths')}</span>
                    <span className="w-1 h-1 rounded-full bg-nordic/10"></span>
                    <span>{property.area}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-6 md:col-span-2">
                <div className="text-base font-semibold text-nordic">{property.price}</div>
                <div className="text-xs text-nordic-muted/60">ID: #{property.id.slice(-4).toUpperCase()}</div>
              </div>

              {/* Status */}
              <div className="col-span-6 md:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                  property.badge?.toLowerCase().includes('sold') 
                    ? 'bg-gray-100 text-gray-600 border-gray-200' 
                    : property.badge?.toLowerCase().includes('pending')
                      ? 'bg-orange-100 text-orange-700 border-orange-200'
                      : 'bg-hint-of-green text-primary border-primary/10'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    property.badge?.toLowerCase().includes('sold') 
                      ? 'bg-gray-500' 
                      : property.badge?.toLowerCase().includes('pending')
                        ? 'bg-orange-500'
                        : 'bg-primary'
                  }`}></span>
                  {property.badge || 'Active'}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                <button className="p-2 rounded-lg text-nordic/40 hover:text-primary hover:bg-hint-of-green/30 transition-all">
                  <span className="material-icons text-xl">edit</span>
                </button>
                <button className="p-2 rounded-lg text-nordic/40 hover:text-red-600 hover:bg-red-50 transition-all">
                  <span className="material-icons text-xl">delete_outline</span>
                </button>
              </div>
            </div>
          ))}

          {(!properties || properties.length === 0) && (
            <div className="text-center py-20">
              <span className="material-icons text-nordic/10 text-6xl mb-4">domain_disabled</span>
              <p className="text-nordic/40 italic font-medium">No properties found.</p>
            </div>
          )}
        </div>

        {/* Pagination logic */}
        <div className="px-6 py-4 border-t border-nordic/5 flex items-center justify-between bg-nordic/5">
          <div className="text-sm text-nordic-muted">
            {t('admin.properties.pagination.showing')} <span className="font-medium text-nordic">{from + 1}</span> {t('admin.properties.pagination.to')} <span className="font-medium text-nordic">{Math.min(to + 1, totalProperties)}</span> {t('admin.properties.pagination.of')} <span className="font-medium text-nordic">{totalProperties}</span> {t('admin.properties.pagination.results')}
          </div>
          <div className="flex gap-2">
            <Link 
              href={`/admin/properties?page=${page - 1}`}
              className={`px-3 py-1 text-sm border border-nordic/10 rounded-md text-nordic hover:bg-white transition-colors ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
            >
              {t('common.prev')}
            </Link>
            <Link 
              href={`/admin/properties?page=${page + 1}`}
              className={`px-3 py-1 text-sm border border-nordic/10 rounded-md text-nordic hover:bg-white transition-colors ${page >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
            >
              {t('common.next')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
