"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/data/mockData';
import { Leaf, MapPin, Activity } from 'lucide-react';

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Detailed Info', icon: Leaf },
    { id: 'origin', label: 'Origin Story', icon: MapPin },
    { id: 'nutrition', label: 'Nutrition', icon: Activity },
  ];

  return (
    <div className="bg-white dark:bg-stone-900/50 rounded-3xl border border-stone-100 dark:border-stone-800 p-6 md:p-8 shadow-sm">
      <div className="flex flex-wrap gap-4 mb-8 border-b border-stone-100 dark:border-stone-800 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative ${
              activeTab === tab.id
                ? 'text-primary-green'
                : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-[-17px] left-0 right-0 h-1 bg-primary-green rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          {activeTab === 'description' && (
            <motion.div
              key="desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="prose prose-stone dark:prose-invert max-w-none"
            >
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
                {product.longDescription || product.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <span className="text-sm font-medium text-stone-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-sm font-bold text-stone-800 dark:text-stone-200">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'origin' && (
            <motion.div
              key="origin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-stone-200">
                <img 
                  src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=1470" 
                  alt="Farm"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Authenticity Guaranteed</p>
                    <h4 className="text-xl font-bold">From the heart of Nature</h4>
                  </div>
                </div>
              </div>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
                {product.originStory || "Sourced from local farms using traditional methods and ethically sustainable practices to bring the best and safest food to your table."}
              </p>
              <div className="flex items-center gap-2 p-4 bg-primary-green/5 rounded-2xl border border-primary-green/20">
                <MapPin className="w-5 h-5 text-primary-green" />
                <span className="text-sm font-medium text-primary-green">Location Verified by MyBazar Logistics Team</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'nutrition' && (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h4 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-6">Nutrition Facts (Per 100g)</h4>
              <div className="space-y-3">
                {product.nutritionalInfo ? Object.entries(product.nutritionalInfo).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-stone-100 dark:border-stone-800 group">
                    <span className="text-stone-500 font-medium group-hover:text-stone-700 transition-colors">{key}</span>
                    <span className="text-stone-800 dark:text-stone-200 font-bold">{value}</span>
                  </div>
                )) : (
                  <p className="text-stone-500 italic">Nutritional details for this product are provided upon request or visible on the label.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
