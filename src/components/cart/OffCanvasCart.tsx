"use client";

import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCartStore, FREE_SHIPPING_THRESHOLD } from '@/store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// --- Price Ticker Component ---
function NumberTicker({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 100, damping: 30 });
  const displayValue = useTransform(spring, (current) => Math.round(current));
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return displayValue.on("change", (latest) => setCurrent(latest));
  }, [displayValue]);

  return <span>৳{current.toLocaleString()}</span>;
}

export function OffCanvasCart() {
  const { 
    items, 
    isDrawerOpen, 
    closeDrawer, 
    updateQuantity, 
    removeItem, 
    getSubtotal 
  } = useCartStore();

  const subtotal = getSubtotal();
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-stone-950 shadow-[-20px_0_50px_rgba(0,0,0,0.2)] z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-primary-green" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">Your Basket</h2>
                    <p className="text-xs text-stone-500 font-medium">{items.length} items selected</p>
                  </div>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2.5 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-full transition-colors group"
                >
                  <X className="w-5 h-5 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-100" />
                </button>
              </div>

              {/* Gamified Free Shipping Bar */}
              <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-primary-green" />
                    {subtotal >= FREE_SHIPPING_THRESHOLD 
                      ? "You've unlocked FREE Delivery!" 
                      : `Add ৳${remaining} more for FREE Delivery!`}
                  </span>
                  <span className="text-[10px] font-bold text-primary-green uppercase tracking-wider">
                    Goal: ৳{FREE_SHIPPING_THRESHOLD}
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full transition-colors duration-500 ${subtotal >= FREE_SHIPPING_THRESHOLD ? 'bg-green-500' : 'bg-honey-gold'}`}
                  />
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-stone-50 dark:bg-stone-900 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-10 h-10 text-stone-200" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-stone-800 dark:text-stone-200">Your cart is empty</p>
                      <p className="text-sm text-stone-500">Looks like you haven't added any safe food yet.</p>
                    </div>
                    <button 
                      onClick={closeDrawer}
                      className="text-primary-green font-bold text-sm hover:underline"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        layout
                        key={item.product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className="group relative flex gap-4 p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 hover:border-stone-200 dark:hover:border-stone-700 transition-colors shadow-sm"
                      >
                        <div className="relative w-20 h-20 bg-stone-50 dark:bg-stone-800 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-stone-800 dark:text-stone-100 text-sm truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-2">
                            Weight: {item.product.weight}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-primary-green">
                              ৳{item.product.price}
                            </div>
                            
                            <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800 px-2 py-1 rounded-lg border border-stone-100 dark:border-stone-700">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 text-stone-400 hover:text-primary-green transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-bold text-stone-700 dark:text-stone-200 min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 text-stone-400 hover:text-primary-green transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-stone-800 shadow-lg rounded-full flex items-center justify-center text-stone-300 hover:text-red-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 border border-stone-100 dark:border-stone-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-stone-50 dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Subtotal</span>
                    <div className="text-3xl font-black text-stone-900 dark:text-stone-50">
                      <NumberTicker value={subtotal} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-stone-400 uppercase leading-none mb-1">Shipping</p>
                    <p className="text-xs font-bold text-primary-green">Calculated at Checkout</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link 
                    href="/checkout"
                    onClick={closeDrawer}
                    className="w-full bg-primary-green hover:bg-primary-green-hover text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary-green/20 transition-all hover:scale-[1.02] active:scale-98"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Secure & Safe Checkout Guarantee
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
