"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  badge?: string;
  isNew?: boolean;
}

export default function PropertyGallery({ images, title, badge, isNew }: PropertyGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Disable scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "ArrowLeft") setActiveImage(prev => (prev > 0 ? prev - 1 : images.length - 1));
      if (e.key === "ArrowRight") setActiveImage(prev => (prev < images.length - 1 ? prev + 1 : 0));
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, images.length]);

  if (!images || images.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 240;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Hero Image */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-md group border border-slate-100 cursor-zoom-in"
      >
        <Image
          alt={title}
          className="object-cover transition-all duration-700 group-hover:scale-105"
          src={images[activeImage]}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        
        <div className="absolute top-5 left-5 flex gap-2 pointer-events-none">
          {badge && (
            <span className="bg-mosque text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              {badge}
            </span>
          )}
          {isNew && (
            <span className="bg-white/95 backdrop-blur-md text-nordic-dark text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              New
            </span>
          )}
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="absolute bottom-5 right-5 bg-white/90 hover:bg-white text-nordic-dark px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl backdrop-blur-md transition-all flex items-center gap-2 border border-white/20 active:scale-95 z-20"
        >
          <span className="material-icons text-[14px]">grid_view</span>
          {images.length} Photos
        </button>

        {/* Hero Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveImage(prev => (prev > 0 ? prev - 1 : images.length - 1));
            }}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-nordic-dark hover:bg-white hover:text-mosque transition-all shadow-lg active:scale-90 cursor-pointer"
          >
            <span className="material-icons">chevron_left</span>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveImage(prev => (prev < images.length - 1 ? prev + 1 : 0));
            }}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-nordic-dark hover:bg-white hover:text-mosque transition-all shadow-lg active:scale-90 cursor-pointer"
          >
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Thumbnail Gallery with Slider Controls */}
      <div className="relative group/thumbs px-2">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto hide-scroll pb-4 snap-x px-1 scroll-smooth"
        >
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`flex-none w-32 sm:w-44 aspect-[4/3] relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 snap-start active:scale-95 border-2 ${
                activeImage === index
                  ? "border-mosque ring-4 ring-mosque/15 z-10 scale-[0.98] shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-slate-200"
              }`}
            >
              <div className={`absolute inset-0 z-10 transition-colors duration-300 ${activeImage === index ? 'bg-mosque/5' : 'bg-transparent'}`} />
              <Image
                alt={`${title} - Image ${index + 1}`}
                className={`object-cover transition-transform duration-700 ${activeImage === index ? "scale-110" : "scale-100"}`}
                src={img}
                fill
                sizes="200px"
              />
            </button>
          ))}
        </div>

        {/* Thumbnail Navigation Controls */}
        <div className="absolute inset-y-0 -left-4 flex items-center opacity-0 group-hover/thumbs:opacity-100 transition-opacity z-30">
          <button 
            onClick={(e) => { e.stopPropagation(); scroll('left'); }} 
            className="w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center text-mosque border border-slate-100 hover:scale-110 active:scale-90 transition-all cursor-pointer"
          >
            <span className="material-icons">chevron_left</span>
          </button>
        </div>
        <div className="absolute inset-y-0 -right-4 flex items-center opacity-0 group-hover/thumbs:opacity-100 transition-opacity z-30">
          <button 
            onClick={(e) => { e.stopPropagation(); scroll('right'); }} 
            className="w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center text-mosque border border-slate-100 hover:scale-110 active:scale-90 transition-all cursor-pointer"
          >
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-nordic-dark/95 backdrop-blur-xl flex flex-col p-4 sm:p-8 animate-in fade-in duration-300">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6 text-white">
            <div>
              <h3 className="text-xl font-light tracking-wide">{title}</h3>
              <p className="text-white/50 text-xs font-medium uppercase tracking-[0.2em]">
                Photo {activeImage + 1} of {images.length}
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center group cursor-pointer"
            >
              <span className="material-icons text-white group-hover:rotate-90 transition-transform">close</span>
            </button>
          </div>

          {/* Large Image Container */}
          <div className="flex-1 relative w-full h-full flex items-center justify-center px-4 sm:px-12 group/modal">
            <div className="relative w-full h-full max-w-6xl max-h-[70vh]">
              <Image
                src={images[activeImage]}
                alt={`${title} Full Screen`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Modal Nav Arrows */}
            <button 
              onClick={() => setActiveImage(prev => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-4 sm:left-12 w-14 h-14 rounded-full bg-white/5 hover:bg-white/15 transition-all flex items-center justify-center text-white scale-90 sm:scale-100 group-hover/modal:bg-white/10 cursor-pointer"
            >
              <span className="material-icons text-3xl">chevron_left</span>
            </button>
            <button 
              onClick={() => setActiveImage(prev => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 sm:right-12 w-14 h-14 rounded-full bg-white/5 hover:bg-white/15 transition-all flex items-center justify-center text-white scale-90 sm:scale-100 group-hover/modal:bg-white/10 cursor-pointer"
            >
              <span className="material-icons text-3xl">chevron_right</span>
            </button>
          </div>

          {/* Modal Footer Thumbnails */}
          <div className="mt-8 flex justify-center">
            <div className="flex gap-3 overflow-x-auto hide-scroll pb-4 px-4 max-w-full">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`flex-none w-20 aspect-square relative rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                    activeImage === index ? "ring-2 ring-white scale-110 opacity-100" : "opacity-40 hover:opacity-80"
                  }`}
                >
                  <Image src={img} alt="Thumb" fill className="object-cover" sizes="100px" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
