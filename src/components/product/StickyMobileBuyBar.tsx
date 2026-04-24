"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/data/mockData';

interface StickyMobileBuyBarProps {
  product: Product;
}

export function StickyMobileBuyBar({ product }: StickyMobileBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 800px (roughly past the hero/buybox)
      setIsVisible(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pb-safe"
        >
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Price</span>
              <span className="text-xl font-bold text-primary-green">৳{product.price}</span>
            </div>
            
            <button className="flex-grow h-12 bg-primary-green hover:bg-primary-green-hover text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-green/20">
              <ShoppingCart className="w-5 h-5" />
              Buy Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
