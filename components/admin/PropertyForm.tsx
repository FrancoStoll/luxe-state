'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/lib/properties';
import { createClient } from '@/lib/supabase/client';
import { createProperty, updateProperty } from '@/lib/admin-actions';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/admin/PropertyMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100">Cargando mapa...</div>
});


interface PropertyFormProps {
  initialData?: Property;
}

export default function PropertyForm({ initialData }: PropertyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Keep track of images (existing + newly uploaded)
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Counter values
  const [beds, setBeds] = useState(initialData?.beds || 3);
  const [baths, setBaths] = useState(initialData?.baths || 2);
  const [parking, setParking] = useState(initialData?.parking || 1);

  // Map coordinates
  const [latitude, setLatitude] = useState<number | ''>(initialData?.latitude ?? '');
  const [longitude, setLongitude] = useState<number | ''>(initialData?.longitude ?? '');


  // Amenities
  const predefinedAmenities = [
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'garden', label: 'Garden' },
    { id: 'ac', label: 'Air Conditioning' },
    { id: 'smart', label: 'Smart Home' }
  ];
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || ['Garden'] // matching code.html defaults roughly
  );

  const toggleAmenity = (label: string) => {
    setSelectedAmenities(prev => 
      prev.includes(label) 
        ? prev.filter(a => a !== label)
        : [...prev, label]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingImage(true);
    const supabase = createClient();
    const newImageUrls: string[] = [];

    // Upload files
    for (const file of Array.from(e.target.files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Error uploading image', uploadError);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);
        
      newImageUrls.push(publicUrl);
    }

    setImages(prev => [...prev, ...newImageUrls]);
    setUploadingImage(false);
    
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    // Add our manual state values
    formData.set('images', JSON.stringify(images));
    formData.set('beds', beds.toString());
    formData.set('baths', baths.toString());
    formData.set('parking', parking.toString());
    formData.set('amenities', JSON.stringify(selectedAmenities));

    try {
      let result;
      if (initialData?.id) {
        result = await updateProperty(initialData.id, formData);
      } else {
        result = await createProperty(formData);
      }

      if (result.success) {
        setSuccessMessage(initialData ? 'Propiedad actualizada con éxito' : 'Propiedad creada con éxito');
        setShowSuccessModal(true);
        setTimeout(() => {
          router.push('/admin/properties');
          router.refresh(); // Ensure list is updated
        }, 3000); // 3 seconds delay
      } else {
        setError(result.error || 'Failed to save property');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      <div className="xl:col-span-8 space-y-8">
        
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-of-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-of-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">info</span>
            </div>
            <h2 className="text-xl font-bold text-nordic">Basic Information</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="title">Property Title <span className="text-red-500">*</span></label>
              <input 
                name="title" 
                id="title" 
                defaultValue={initialData?.title} 
                required 
                className="w-full text-base px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sf-pro shadow-sm" 
                placeholder="e.g. Modern Penthouse with Ocean View" 
                type="text"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="price">Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">$</span>
                  <input 
                    name="price"
                    id="price" 
                    defaultValue={initialData?.price ? parseFloat(initialData.price.replace(/[^0-9.-]+/g,"")) : ''} 
                    required 
                    className="w-full pl-7 pr-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base font-medium font-sf-pro shadow-sm" 
                    placeholder="0.00" 
                    type="number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="badge">Status</label>
                <select 
                  name="badge"
                  id="badge" 
                  defaultValue={initialData?.badge || 'FOR SALE'} 
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base font-sf-pro cursor-pointer shadow-sm"
                >
                  <option value="FOR SALE">For Sale</option>
                  <option value="FOR RENT">For Rent</option>
                  <option value="SOLD">Sold</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="property_type">Property Type</label>
                <select 
                  name="property_type"
                  id="property_type" 
                  defaultValue={initialData?.property_type || 'apartment'} 
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base font-sf-pro cursor-pointer shadow-sm"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-6">
              <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
                <input 
                  name="is_featured"
                  id="is_featured"
                  defaultChecked={initialData?.is_featured || false}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary shadow-sm" 
                  type="checkbox" 
                />
                <span className="text-sm font-medium text-gray-700 font-sf-pro group-hover:text-nordic transition-colors">Mark as Featured Property</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
                <input 
                  name="is_active"
                  id="is_active"
                  defaultChecked={initialData?.is_active ?? true}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary shadow-sm" 
                  type="checkbox" 
                />
                <span className="text-sm font-medium text-gray-700 font-sf-pro group-hover:text-nordic transition-colors">Propiedad Activa</span>
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-of-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-of-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">description</span>
            </div>
            <h2 className="text-xl font-bold text-nordic">Description</h2>
          </div>
          <div className="p-8">
            <div className="mb-3 flex gap-2 border-b border-gray-100 pb-2">
              <button className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors" type="button"><span className="material-icons text-lg">format_bold</span></button>
              <button className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors" type="button"><span className="material-icons text-lg">format_italic</span></button>
              <button className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors" type="button"><span className="material-icons text-lg">format_list_bulleted</span></button>
            </div>
            <textarea 
              name="description"
              id="description" 
              defaultValue={initialData?.description}
              className="w-full px-4 py-3 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base font-sf-pro leading-relaxed resize-y min-h-[200px] shadow-sm" 
              placeholder="Describe the property features, neighborhood, and unique selling points..."
            ></textarea>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-of-green/30 flex justify-between items-center bg-gradient-to-r from-hint-of-green/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">image</span>
              </div>
              <h2 className="text-xl font-bold text-nordic">Gallery</h2>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded font-sf-pro">JPG, PNG, WEBP</span>
          </div>
          <div className="p-8">
            <div 
              className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-of-green/10 hover:border-primary/40 transition-colors cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                className="hidden" 
                multiple 
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageUpload}
              />
              <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform duration-300">
                  {uploadingImage ? (
                    <span className="material-icons text-2xl animate-spin">autorenew</span>
                  ) : (
                    <span className="material-icons text-2xl">cloud_upload</span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-nordic font-sf-pro">Click to upload images</p>
                  <p className="text-xs text-gray-400 font-sf-pro">Max file size 5MB per image</p>
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {images.map((url, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm bg-gray-100">
                    <img alt={`Property image ${idx + 1}`} className="w-full h-full object-cover" src={url} />
                    <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <button 
                        className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors" 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">Main</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>

      </div>

      <div className="xl:col-span-4 space-y-8">
        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-hint-of-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-of-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">place</span>
            </div>
            <h2 className="text-lg font-bold text-nordic">Location</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="location">Address</label>
              <input 
                name="location"
                id="location" 
                defaultValue={initialData?.location}
                className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-sf-pro shadow-sm" 
                placeholder="Street Address, City, Zip" 
                type="text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="latitude">Latitude</label>
                <input 
                  name="latitude"
                  id="latitude" 
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-sf-pro shadow-sm" 
                  placeholder="e.g. -34.6037" 
                  type="number"
                  step="any"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="longitude">Longitude</label>
                <input 
                  name="longitude"
                  id="longitude" 
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-sf-pro shadow-sm" 
                  placeholder="e.g. -58.3816" 
                  type="number"
                  step="any"
                />
              </div>
            </div>
            {/* Map display */}
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
              {(latitude !== '' && longitude !== '' && !isNaN(latitude) && !isNaN(longitude)) ? (
                <DynamicMap lat={latitude} lng={longitude} />
              ) : (
                <>
                  <img alt="Map view placeholder" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS55FY7gfArnlTpNsdabJk9nBO5uQJgOwLicensed/AB6AXuAS55FY7gfArnlTpNsdabJk9nBO5uQJgOwIsl8beO34JRZ9dMmjLoIkTuTUO72Y9L5tUmQqTReQWebUWadAWwLusGmRQiIict5sqY--yRaOxuYpTzfR4vv4RKh1ex6oxY64e0kbSeMudNO6pv-gG0WzVWs-pDfvQm5IoTQ1mT-tAV49LDkXAHZl317M1-D7eZw3N8o2ExKWTgg6oMAXOFVnkApIqnb7TZHekwSw8pWQxpJV2EKI8EQKQbQXJaSbjN8gB1n8b-ueWj8" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-white/90 text-nordic px-3 py-1.5 rounded shadow-sm backdrop-blur-sm text-xs font-bold font-sf-pro flex items-center gap-1">
                      <span className="material-icons text-sm text-primary">map</span> Preview
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
          <div className="px-6 py-4 border-b border-hint-of-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-of-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">straighten</span>
            </div>
            <h2 className="text-lg font-bold text-nordic">Details</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="area">Area (m²/sqft)</label>
                <input 
                  name="area"
                  id="area" 
                  defaultValue={initialData?.area}
                  className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sf-pro text-sm shadow-sm" 
                  placeholder="e.g. 1500 sqft" 
                  type="text"
                />
              </div>
              <div className="group">
                <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="year_built">Year Built</label>
                <input 
                  name="year_built"
                  id="year_built" 
                  defaultValue={initialData?.year_built}
                  className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sf-pro text-sm shadow-sm" 
                  placeholder="YYYY" 
                  type="number"
                />
              </div>
            </div>
            <hr className="border-gray-100" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">bed</span> Bedrooms
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button onClick={() => setBeds(Math.max(0, beds - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100" type="button">-</button>
                  <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={beds} />
                  <button onClick={() => setBeds(beds + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100" type="button">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">shower</span> Bathrooms
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button onClick={() => setBaths(Math.max(0, baths - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100" type="button">-</button>
                  <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={baths} />
                  <button onClick={() => setBaths(baths + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100" type="button">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">directions_car</span> Parking
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button onClick={() => setParking(Math.max(0, parking - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100" type="button">-</button>
                  <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={parking} />
                  <button onClick={() => setParking(parking + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100" type="button">+</button>
                </div>
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <h3 className="font-bold text-nordic mb-3 font-sf-pro uppercase tracking-wider text-xs text-gray-500">Amenities</h3>
              <div className="space-y-2">
                {predefinedAmenities.map(amenity => (
                  <label key={amenity.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <input 
                      checked={selectedAmenities.includes(amenity.label)}
                      onChange={() => toggleAmenity(amenity.label)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                      type="checkbox" 
                    />
                    <span className="text-sm text-gray-700 font-sf-pro group-hover:text-nordic transition-colors">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium font-sf-pro mt-4">
                {error}
              </div>
            )}
            
            {/* Desktop form actions inside sticky details box */}
            <div className="pt-4 border-t border-gray-100 hidden md:flex flex-col gap-3">
              <button 
                type="submit" 
                disabled={isSubmitting || uploadingImage}
                className="w-full px-5 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 font-sf-pro text-sm disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="material-icons animate-spin text-sm">autorenew</span>
                ) : (
                  <span className="material-icons text-sm">save</span>
                )}
                {initialData ? 'Update Property' : 'Save Property'}
              </button>
              <button 
                type="button" 
                onClick={() => router.push('/admin/properties')}
                className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-white text-nordic hover:bg-gray-50 transition-colors font-medium font-sf-pro text-sm text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only sticky bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl md:hidden z-40 flex gap-3">
        <button 
          type="button" 
          onClick={() => router.push('/admin/properties')}
          className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-nordic font-medium font-sf-pro"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="flex-1 py-3 rounded-lg bg-primary text-white font-medium font-sf-pro flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {initialData ? 'Update' : 'Save'}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col transform transition-all">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-green-500 text-3xl">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-nordic">{successMessage}</h3>
              <p className="text-sm text-gray-500 font-sf-pro">
                Serás redirigido en unos segundos...
              </p>
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => {
                    router.push('/admin/properties');
                    router.refresh();
                  }}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 flex justify-center items-center gap-2 font-sf-pro"
                >
                  <span className="material-icons text-sm">arrow_back</span>
                  Volver a propiedades
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
