"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, MessageCircle, ShieldCheck, Lock, Mail, Phone, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const { clearCart } = useCartStore();
  const { isAuthenticated, signup } = useAuthStore();
  const [orderId, setOrderId] = useState('');
  const [showHook, setShowHook] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Generate a mock order ID
    const id = 'MB' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderId(id);
    
    // Clear cart after a small delay to allow for animations/state reads
    const timer = setTimeout(() => {
      clearCart();
    }, 1000);

    // Show the registration hook after celebratory animation
    const hookTimer = setTimeout(() => {
      if (!isAuthenticated) setShowHook(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hookTimer);
    };
  }, [clearCart, isAuthenticated]);

  const handleHandleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd take the phone from the order details
    signup({ 
      phone: '01700000000', 
      email: formData.email, 
      password: formData.password 
    });
    setIsRegistered(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-2xl px-6">
        
        {/* Celebration Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="w-24 h-24 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-primary-green" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-5xl font-black text-stone-900 dark:text-stone-100 mb-4 italic font-sans italic"
          >
            Thank You!
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-stone-500 font-medium"
          >
            Your order <span className="text-stone-900 dark:text-stone-100 font-bold">{orderId}</span> has been successfully placed.
          </motion.p>
        </div>

        {/* Post-Purchase Registration Hook */}
        <AnimatePresence>
          {showHook && !isRegistered && (
            <motion.div
              initial={{ height: 0, opacity: 0, scale: 0.95 }}
              animate={{ height: 'auto', opacity: 1, scale: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-primary-green/20 p-8 mb-8 shadow-xl shadow-primary-green/5 relative overflow-hidden"
            >
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 p-4 opacity-5">
                  <ShieldCheck className="w-24 h-24 text-primary-green" />
               </div>

               <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-primary-green/10 text-primary-green px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Lock className="w-3 h-3" />
                  Secure Invitation
                </div>
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Track & Save Faster</h2>
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
                  Secure your order history and save your delivery details for a 1-click checkout next time. Just set your password below.
                </p>

                <form onSubmit={handleHandleSignup} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input 
                        required
                        type="email" 
                        placeholder="Email Address"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full h-12 pl-12 pr-4 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input 
                        required
                        type="password" 
                        placeholder="Set Secure Password"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full h-12 pl-12 pr-4 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm"
                      />
                    </div>
                  </div>
                  <button className="w-full h-14 bg-stone-900 dark:bg-primary-green text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:gap-4 transition-all shadow-lg">
                    Create Secure Account <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowHook(false)}
                    className="w-full text-center text-xs font-bold text-stone-400 hover:text-stone-600 uppercase tracking-widest pt-2"
                  >
                    Skip for now
                  </button>
                </form>
               </div>
            </motion.div>
          )}

          {isRegistered && (
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-green-50 dark:bg-green-950/20 rounded-3xl p-6 mb-8 text-center border border-green-100 dark:border-green-900/30"
             >
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-green-800 dark:text-green-200">Account Secured!</h3>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">Your details have been saved for a frictionless checkout next time.</p>
             </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Confirmation */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 mb-8 shadow-sm border border-stone-100 dark:border-stone-800">
           <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="text-center md:text-left">
                 <h3 className="font-bold text-stone-800 dark:text-stone-100 text-lg mb-1">Confirm via WhatsApp</h3>
                 <p className="text-sm text-stone-500">Get real-time tracking updates directly on your phone.</p>
              </div>
              <Link 
                href={`https://wa.me/8801700000000?text=Hi, myBazar! My Order ID is ${orderId}. Please confirm my order.`}
                target="_blank"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-green-500/20 transition-all hover:scale-[1.05]"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                Confirm on WhatsApp
              </Link>
           </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/"
            className="flex items-center justify-center h-14 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-200 rounded-2xl font-bold hover:bg-stone-200 transition-colors"
          >
            Back to Home
          </Link>
          <Link 
            href="/category/all"
            className="flex items-center justify-center h-14 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded-2xl font-bold hover:bg-stone-50 transition-colors gap-2"
          >
            Track Order <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
