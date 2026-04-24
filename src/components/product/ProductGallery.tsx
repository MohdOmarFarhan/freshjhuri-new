"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Play, ZoomIn } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Viewport */}
      <div 
        ref={containerRef}
        className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 cursor-crosshair group"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[0]}
          alt="Product Image"
          fill
          className={`object-cover transition-transform duration-300 ${isZooming ? 'scale-110 opacity-40' : 'scale-100'}`}
          priority
        />

        {/* Magnifier Overlay */}
        <AnimatePresence>
          {isZooming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
              style={{
                backgroundImage: `url(${images[0]})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '250%',
                backgroundRepeat: 'no-repeat'
              }}
            />
          )}
        </AnimatePresence>

        {/* Video Placeholder Overlay */}
        <div className="absolute bottom-4 right-4 z-20">
          <button className="flex items-center gap-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-stone-200 dark:border-stone-800 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:scale-105 transition-transform">
            <Play className="w-4 h-4 fill-primary-green text-primary-green" />
            Watch Video
          </button>
        </div>

        {/* Zoom Cue */}
        {!isZooming && (
          <div className="absolute top-4 right-4 p-2 bg-black/10 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="px-2">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="product-thumbs-swiper"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} className="cursor-pointer">
              <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent transition-all hover:border-primary-green swiper-slide-thumb-active:border-primary-green bg-stone-50 dark:bg-stone-900">
                <Image
                  src={img}
                  alt={`Thumb ${idx}`}
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .product-thumbs-swiper .swiper-slide-thumb-active div {
          border-color: #3d7a45 !important;
        }
      `}</style>
    </div>
  );
}
