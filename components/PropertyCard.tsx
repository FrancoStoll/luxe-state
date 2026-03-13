import Image from "next/image";
import { Property } from "@/data/mockProperties";

interface PropertyCardProps {
 property: Property;
 className?: string;
}

export default function PropertyCard({ property, className = "" }: PropertyCardProps) {
 // Map our custom badge color strings to tailwind classes
 const badgeClasses = {
 'mosque': 'bg-mosque/90',
 'nordic-dark': 'bg-nordic-dark/90',
 'white': 'bg-white/90 text-nordic-dark'
 };

 const badgeClass = `${badgeClasses[property.badgeColor || 'mosque']} text-white text-xs font-bold px-2 py-1 rounded`;

 return (
 <article className={`bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col ${className}`}>
 <div className="relative aspect-[4/3] overflow-hidden">
 <Image 
 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
 alt={property.title} 
 className="object-cover transition-transform duration-500 group-hover:scale-110" 
 src={property.image}
 fill
 />
 <button className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full hover:bg-mosque hover:text-white transition-colors text-nordic-dark hover:shadow-md active:scale-95">
 <span className="material-icons text-xl leading-none">favorite_border</span>
 </button>
 <div className={`absolute bottom-3 left-3 ${badgeClass}`}>
 {property.badge}
 </div>
 </div>
 <div className="p-4 flex flex-col flex-grow">
 <div className="flex justify-between items-baseline mb-2">
 <h3 className="font-bold text-lg text-nordic-dark ">
 {property.price}{property.price.includes('/mo') ? '' : property.price.includes(',') && !property.price.includes('/mo') && property.badgeColor === 'mosque' ? <span className="text-sm font-normal text-nordic-muted">/mo</span> : null}
 {/* The html has /mo conditionally on the rent ones. If it's already in the price string in mock data, we are good. */}
 </h3>
 </div>
 <h4 className="text-nordic-dark font-medium truncate mb-1">{property.title}</h4>
 <p className="text-nordic-muted text-xs mb-4">{property.location}</p>
 
 <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 ">
 <div className="flex items-center gap-1 text-nordic-muted text-xs">
 <span className="material-icons text-sm text-mosque/80">king_bed</span> {property.beds}
 </div>
 <div className="flex items-center gap-1 text-nordic-muted text-xs">
 <span className="material-icons text-sm text-mosque/80">bathtub</span> {property.baths}
 </div>
 <div className="flex items-center gap-1 text-nordic-muted text-xs">
 <span className="material-icons text-sm text-mosque/80">square_foot</span> {property.area}m²
 </div>
 </div>
 </div>
 </article>
 );
}
