"use client";

import { useCartStore } from '@/store/useCartStore';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const { items } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          <div className="w-24 h-24 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-12 h-12 text-stone-300" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 italic font-sans italic">Your basket is empty</h1>
            <p className="text-stone-500 max-w-sm mx-auto">Add some premium safe food to your cart before proceeding to checkout.</p>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950/20 py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 mb-3 italic font-sans italic">Secure Checkout</h1>
            <div className="flex items-center gap-4 text-sm font-bold text-stone-400 uppercase tracking-widest">
              <span>Checkout</span>
              <div className="w-1 h-1 rounded-full bg-stone-300" />
              <span className="text-primary-green">Frictionless Flow</span>
            </div>
          </div>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 font-bold transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white dark:bg-stone-900 flex items-center justify-center shadow-sm group-hover:bg-stone-100">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Categories
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Checkout Forms */}
          <div className="lg:col-span-7 bg-white dark:bg-stone-900/40 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 p-8 md:p-12 shadow-sm">
            <CheckoutForm />
          </div>

          {/* Right: Sticky Order Summary */}
          <div className="lg:col-span-5">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
