"use client";

import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle, Zap } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/data/mockData';
import { useCartStore } from '@/store/useCartStore';

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    router.push('/checkout');
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm hover:shadow-primary-green/20 dark:hover:shadow-none transition-all duration-300 group border border-stone-100 dark:border-stone-800 flex flex-col h-full"
    >
      <Link href={`/product/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative w-full aspect-square bg-amber-50/50 dark:bg-stone-800 rounded-xl overflow-hidden mb-4">
          {product.badge && (
            <div className="absolute top-2 left-2 z-10 bg-primary-green/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse-slow">
              <Zap className="w-3 h-3 text-honey-gold-light" />
              {product.badge}
            </div>
          )}
          <motion.div 
            className="w-full h-full relative"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col">
          <p className="text-sm text-stone-500 mb-1">{product.bnName}</p>
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 leading-tight mb-2 line-clamp-2 group-hover:text-primary-green transition-colors">
            {product.name}
          </h3>
          
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary-green flex items-baseline">
                ৳{product.price} <span className="text-sm font-semibold text-stone-400 dark:text-stone-500 ml-1">/{product.unit}</span>
              </span>
              {product.originalPrice && (
                <del className="text-sm text-stone-400 dark:text-stone-600">৳{product.originalPrice} <span className="text-xs">/{product.unit}</span></del>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`flex items-center justify-center py-2.5 rounded-xl font-medium transition-all ${
            isAdded
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-none'
              : 'border-2 border-primary-green text-primary-green hover:bg-primary-green/5'
          }`}
        >
          {isAdded ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1"
            >
              <CheckCircle className="w-4 h-4" /> Added
            </motion.div>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Cart
            </span>
          )}
        </button>
        <button 
          onClick={handleBuyNow}
          className="bg-primary-green hover:bg-primary-green-hover text-white py-2.5 rounded-xl font-medium shadow-md shadow-primary-green/20 transition-all flex items-center justify-center"
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}
