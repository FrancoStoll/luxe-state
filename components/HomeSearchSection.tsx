"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterModal from "./FilterModal";
import { useTranslation } from "@/lib/contexts/LanguageContext";

export default function HomeSearchSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "All");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    
    params.set("type", selectedType);
    params.set("page", "1"); // Reset to page 1 on new search
    
    router.push(`/?${params.toString()}`);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
          {t('home.title')}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">{t('home.sanctuary')}</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
          </span>
          .
        </h1>
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
              search
            </span>
          </div>
          <input
            className="block w-full pl-12 pr-12 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:outline-none focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg"
            placeholder={t('home.search_placeholder')}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer"
          >
            {t('home.search_button')}
          </button>
        </div>
        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {["All", "Buy", "Rent", "Villa", "Penthouse"].map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                selectedType === type
                  ? "bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10"
                  : "bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5"
              }`}
            >
              {t(`home.types.${type}`)}
            </button>
          ))}
          <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors cursor-pointer"
          >
            <span className="material-icons text-base">tune</span> {t('home.filters')}
          </button>
        </div>
      </div>

      <FilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </section>
  );
}
