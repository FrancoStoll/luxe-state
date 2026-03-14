"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./PropertyMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center rounded-lg">
      <span className="material-icons text-mosque/30 text-4xl">map</span>
    </div>
  ),
});

interface PropertyMapProps {
  locationString: string;
  latitude?: number | null;
  longitude?: number | null;
}

export default function PropertyMap(props: PropertyMapProps) {
  return <DynamicMap {...props} />;
}
