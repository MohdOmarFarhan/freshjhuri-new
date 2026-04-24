"use client";

import { motion } from 'framer-motion';
import { Plus, Check, ShoppingBag } from 'lucide-react';
import { Product, mockProducts } from '@/data/mockData';
import { useCartStore } from '@/store/useCartStore';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
}

export function FrequentlyBoughtTogether({ currentProduct }: FrequentlyBoughtTogetherProps) {
  const addItem = useCartStore(state => state.addItem);

  // Find a complementary product
  const getComplementary = () => {
    if (currentProduct.category === 'honey') return mockProducts.find(p => p.category === 'nuts');
    if (currentProduct.category === 'nuts') return mockProducts.find(p => p.category === 'honey');
    if (currentProduct.category === 'dates') return mockProducts.find(p => p.category === 'honey');
    return mockProducts.find(p => p.category === 'spices' && p.id !== currentProduct.id);
  };

  const bundleProduct = getComplementary() || mockProducts[0];
  const totalPrice = currentProduct.price + bundleProduct.price;
  const bundlePrice = Math.round(totalPrice * 0.95); // 5% discount

  const handleAddBundle = () => {
    addItem(currentProduct);
    addItem(bundleProduct);
  };

  return (
    <div className="py-12 border-t border-stone-100 dark:border-stone-800">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">Frequently Bought Together</h3>
          <p className="text-sm text-stone-500">Add these complementary items for a healthy breakfast combo.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-amber-50/30 dark:bg-stone-900/40 rounded-3xl border border-amber-100/50 dark:border-stone-800">
          <div className="flex items-center gap-4">
            {/* Current Product Mini */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white dark:border-stone-800 shadow-sm">
              <img src={currentProduct.image} alt="" className="w-full h-full object-cover" />
            </div>

            <Plus className="w-5 h-5 text-stone-400" />

            {/* Bundle Product Mini */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white dark:border-stone-800 shadow-sm">
              <img src={bundleProduct.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-1 right-1 bg-primary-green text-white p-0.5 rounded-full">
                <Check className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 flex-grow">
            <h4 className="font-bold text-stone-800 dark:text-stone-200">
              Bundle: {currentProduct.name.split(' ')[0]} + {bundleProduct.name.split(' ')[0]}
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary-green">৳{bundlePrice}</span>
              <span className="text-sm text-stone-400 line-through">৳{totalPrice}</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">Save 5%</span>
            </div>
          </div>

          <button 
            onClick={handleAddBundle}
            className="w-full md:w-auto px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-black/5"
          >
            <ShoppingBag className="w-5 h-5" />
            Add Bundle to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
