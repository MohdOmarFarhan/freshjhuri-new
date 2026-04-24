"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingCart, ShieldCheck, Heart, Share2, Star, CheckCircle2 } from 'lucide-react';
import { Product } from '@/data/mockData';
import { useCartStore } from '@/store/useCartStore';

interface BuyBoxProps {
  product: Product;
  variants: Product[]; // Other weights/sizes
  onVariantChange: (id: string) => void;
}

export function BuyBox({ product, variants, onVariantChange }: BuyBoxProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    setIsAdded(true);
    setIsFlying(true);
    addItem(product, quantity);
    
    // Reset "Added" state after 2s
    setTimeout(() => setIsAdded(false), 2000);
    // Reset "Flying" state after 0.8s (animation duration)
    setTimeout(() => setIsFlying(false), 800);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-stone-500 font-medium">
        <a href="/" className="hover:text-primary-green">Home</a>
        <span>/</span>
        <a href={`/category/${product.category}`} className="hover:text-primary-green capitalize">{product.category}</a>
        <span>/</span>
        <span className="text-stone-800 dark:text-stone-300 truncate max-w-[150px]">{product.name}</span>
      </nav>

      {/* Title & Badge */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {product.badge && (
            <span className="bg-honey-gold/10 text-amber-700 dark:text-honey-gold border border-honey-gold/30 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {product.badge}
            </span>
          )}
          {product.isOrganic && (
            <span className="flex items-center gap-1 text-primary-green text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Organic
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 leading-tight">
          {product.name}
        </h1>
        <p className="text-xl text-stone-500 dark:text-stone-400 font-bengali">
          {product.bnName}
        </p>
      </div>

      {/* Reviews Summary */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < Math.floor(product.reviews?.rating || 5) ? 'fill-honey-gold text-honey-gold' : 'text-stone-300'}`} 
            />
          ))}
        </div>
        <button 
          onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-sm font-semibold text-stone-500 hover:text-primary-green underline decoration-dotted"
        >
          ({product.reviews?.count || 0} Reviews)
        </button>
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="text-sm text-stone-500 font-medium">SKU: MB-{product.id.toUpperCase()}</span>
      </div>

      <div className="h-px bg-stone-100 dark:bg-stone-800/50" />

      {/* Pricing */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-primary-green">
            ৳{product.price}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-lg text-stone-400 line-through">৳{product.originalPrice}</span>
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                -{discount}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Price for {product.unit} (incl. all taxes)
        </p>
      </div>

      {/* Weight Selector */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wide">
          Select Weight
        </h3>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => onVariantChange(v.id)}
              className={`px-6 py-2.5 rounded-xl border-2 font-bold transition-all ${
                v.id === product.id
                  ? 'border-primary-green bg-primary-green/5 text-primary-green'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
              }`}
            >
              {v.weight}
            </button>
          ))}
        </div>
      </div>

      {/* Scarcity Pulse */}
      {product.stockCount && product.stockCount < 20 && (
        <div className="flex items-center gap-2 py-2 px-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <p className="text-sm font-bold text-red-600 dark:text-red-400">
            High Demand: Only {product.stockCount} {product.category === 'fruits' ? 'kg' : 'jars'} left in stock!
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex items-center bg-stone-100 dark:bg-stone-900 rounded-xl px-2">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="p-2 text-stone-600 dark:text-stone-400 hover:text-primary-green transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="w-10 text-center font-bold text-stone-800 dark:text-stone-100">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="p-2 text-stone-600 dark:text-stone-400 hover:text-primary-green transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative flex-grow">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAddToCart}
              className={`w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isAdded 
                  ? 'bg-green-600 text-white shadow-green-200 dark:shadow-none' 
                  : 'bg-stone-900 dark:bg-primary-green text-white shadow-stone-200 dark:shadow-none hover:bg-black dark:hover:bg-primary-green-hover'
              }`}
            >
              {isAdded ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </motion.button>

            {/* Flying Mini-Image Animation */}
            <AnimatePresence>
              {isFlying && (
                <motion.div
                  initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                  animate={{ 
                    scale: 0.2, 
                    x: 400, // Roughly towards the cart icon position
                    y: -500, 
                    opacity: 0 
                  }}
                  transition={{ duration: 0.8, ease: "circIn" }}
                  className="absolute left-1/2 top-1/2 -ml-8 -mt-8 w-16 h-16 rounded-full overflow-hidden border-2 border-primary-green shadow-xl z-[100] pointer-events-none"
                >
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button 
          onClick={handleBuyNow}
          className="w-full h-14 rounded-xl bg-honey-gold hover:bg-amber-600 text-white font-bold text-lg shadow-lg shadow-honey-gold/20 transition-all"
        >
          Buy Now
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        {[
          { icon: ShieldCheck, label: "Pure & Safe", sub: "Lab Tested" },
          { icon: Plus, label: "No Adulteration", sub: "Money Back" }, // Changed from CheckCircle for a different vibe
          { icon: Share2, label: "Eco-Friendly", sub: "Plastic Free" }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-center gap-1">
            <div className="w-10 h-10 rounded-full bg-stone-50 dark:bg-stone-900 flex items-center justify-center border border-stone-100 dark:border-stone-800">
              <item.icon className="w-5 h-5 text-primary-green" />
            </div>
            <span className="text-[10px] font-bold text-stone-800 dark:text-stone-200 uppercase tracking-tighter">{item.label}</span>
            <span className="text-[9px] text-stone-500 font-medium">{item.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
