"use client";

import { categories } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function CategoryRibbon() {
  return (
    <section className="w-full py-16 bg-stone-50 dark:bg-stone-950 border-y border-stone-200/50 dark:border-stone-800">
      <div className="container mx-auto px-4 md:px-12 relative">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-800 dark:text-stone-100 mb-10">
          Featured Categories
        </h2>

        <div className="relative px-4 md:px-12">
          {/* Custom Navigation */}
          <button className="feature-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-honey-gold/80 hover:bg-honey-gold text-white shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button className="feature-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-honey-gold/80 hover:bg-honey-gold text-white shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight className="w-5 h-5" />
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '.feature-prev',
              nextEl: '.feature-next',
            }}
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            className="px-2 py-4"
          >
            {categories.map((cat, i) => (
              <SwiperSlide key={cat.id}>
                <Link href={`/category/${cat.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center gap-4 group cursor-pointer"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white dark:bg-stone-900 flex items-center justify-center text-4xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-stone-800 group-hover:-translate-y-2 group-hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
                      {cat.icon}
                    </div>
                    <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 group-hover:text-primary-green transition-colors whitespace-nowrap">
                      {cat.name}
                    </span>
                  </motion.div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
