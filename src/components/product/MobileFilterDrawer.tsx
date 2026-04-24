"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, BarChart2 } from 'lucide-react';
import { useEffect } from 'react';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  filterOptions: string[];
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  activeSort: string;
  setActiveSort: (s: string) => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  categoryName,
  filterOptions,
  activeFilter,
  setActiveFilter,
  activeSort,
  setActiveSort
}: MobileFilterDrawerProps) {
  
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-stone-50 dark:bg-stone-950 z-50 shadow-2xl flex flex-col md:hidden border-l border-stone-200 dark:border-stone-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <h2 className="text-xl font-bold flex items-center gap-2 text-stone-800 dark:text-stone-100">
                <Filter className="w-5 h-5 text-primary-green" />
                Refine
              </h2>
              <button 
                onClick={onClose}
                className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full text-stone-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-8">
              
              {/* Filter By Category Attributes */}
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Filter By Type</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveFilter('All')}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      activeFilter === 'All' 
                        ? 'border-primary-green bg-primary-green/10 text-primary-green font-bold' 
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium'
                    }`}
                  >
                    All {categoryName}
                  </button>
                  {filterOptions.filter(Boolean).map(opt => (
                    <button
                      key={opt}
                      onClick={() => setActiveFilter(opt)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        activeFilter === opt 
                          ? 'border-primary-green bg-primary-green/10 text-primary-green font-bold' 
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" /> Sort Products
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveSort('relevant')}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      activeSort === 'relevant' 
                        ? 'border-honey-gold bg-honey-gold/10 text-honey-gold font-bold' 
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium'
                    }`}
                  >
                    Most Relevant
                  </button>
                  <button
                    onClick={() => setActiveSort('price_asc')}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      activeSort === 'price_asc' 
                        ? 'border-honey-gold bg-honey-gold/10 text-honey-gold font-bold' 
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium'
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => setActiveSort('price_desc')}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      activeSort === 'price_desc' 
                        ? 'border-honey-gold bg-honey-gold/10 text-honey-gold font-bold' 
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium'
                    }`}
                  >
                    Price: High to Low
                  </button>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <button 
                onClick={onClose}
                className="w-full bg-primary-green hover:bg-primary-green-hover text-white py-3.5 rounded-xl font-bold shadow-md shadow-primary-green/20 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
