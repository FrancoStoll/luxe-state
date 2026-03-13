"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in Next.js
// Use a more specific type than any to resolve lint issues
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PropertyMapProps {
  locationString: string; 
}

export default function PropertyMapClient({ locationString }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // For mockup purposes, we'll use a hardcoded coordinate,
    // in a real app we would geocode `locationString`
    const lat = 37.4419;
    const lng = -122.1430;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: false, // Cleaner look for the sidebar
      }).setView([lat, lng], 14);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);

      // Add zoom control to a better position if needed
      L.control.zoom({
        position: 'topright'
      }).addTo(mapInstance.current);

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="width: 32px; height: 32px; background-color: #006655; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); display: flex; align-items: center; justify-content: center;"><span class="material-icons" style="color: white; font-size: 14px;">home</span></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([lat, lng], { icon: customIcon }).addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [locationString]);

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden bg-slate-100 z-0 border border-slate-200">
      <div ref={mapRef} className="absolute inset-0 z-0" />
      <a 
        className="absolute bottom-4 right-4 bg-white/90 text-[10px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-full shadow-lg text-nordic-dark hover:text-white hover:bg-mosque z-[1000] transition-all flex items-center gap-2 border border-nordic-dark/5"
        href={`https://maps.google.com/?q=${encodeURIComponent(locationString)}`} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <span className="material-icons text-[14px]">map</span>
        Ver Mapa
      </a>
    </div>
  );
}
