"use client";

import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Package, RotateCcw, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Reusable Number Ticker (matches Cart Drawer)
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

export function CheckoutSummary() {
  const router = useRouter();
  const { 
    items, 
    getSubtotal, 
    getDeliveryFee, 
    getGrandTotal, 
    isCheckoutValid 
  } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const grandTotal = getGrandTotal();
  const isValid = isCheckoutValid();

  const handlePlaceOrder = async () => {
    if (!isValid) return;
    setIsProcessing(true);
    // Simulate API delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/order-success');
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm sticky top-40">
      <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-6 italic font-sans italic">Order Summary</h3>
      
      {/* Items List (Simplified) */}
      <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-4 items-center">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-stone-100">
              <img src={item.product.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-stone-900 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200 truncate">{item.product.name}</p>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{item.product.weight}</p>
            </div>
            <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
              ৳{item.product.price * item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code */}
      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input 
            type="text" 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Coupon Code"
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 text-sm focus:ring-2 focus:ring-primary-green/20 outline-none transition-all"
          />
        </div>
        <button className="px-6 h-11 bg-stone-900 dark:bg-stone-800 text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform active:scale-95">
          Apply
        </button>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 mb-8">
        <div className="flex justify-between items-center text-stone-500 font-medium tracking-tight">
          <span>Subtotal</span>
          <span className="text-stone-800 dark:text-stone-200 font-bold">৳{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-stone-500 font-medium tracking-tight">
          <span>Delivery Fee</span>
          <span className={`${deliveryFee === 0 ? 'text-primary-green font-black uppercase text-xs' : 'text-stone-800 dark:text-stone-200 font-bold'}`}>
            {deliveryFee === 0 ? 'Free Shipping' : `৳${deliveryFee}`}
          </span>
        </div>
        <div className="h-px bg-stone-100 dark:bg-stone-800 my-2" />
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-bold text-stone-900 dark:text-stone-100 italic font-sans italic">Order Total</span>
          <span className="text-3xl font-black text-primary-green">
            <NumberTicker value={grandTotal} />
          </span>
        </div>
      </div>

      {/* Action and Badges */}
      <div className="space-y-6">
        <div className="space-y-3">
          <button 
            onClick={handlePlaceOrder}
            disabled={isProcessing || !isValid}
            className={`w-full h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${
              isProcessing 
                ? 'bg-stone-400 cursor-wait' 
                : !isValid
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed shadow-none border-dashed border-2 border-stone-200 dark:border-stone-700'
                  : 'bg-primary-green hover:bg-primary-green-hover text-white shadow-primary-green/20 hover:scale-[1.02] active:scale-98'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Securing Order...
              </div>
            ) : (
              <>
                Place Order
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 opacity-50" />
                <div className="text-sm opacity-80 uppercase tracking-widest font-sans">Payment on Delivery</div>
              </>
            )}
          </button>
          
          {!isValid && items.length > 0 && (
            <p className="text-[10px] text-center font-bold text-red-500 uppercase tracking-widest animate-pulse">
              Please complete contact & shipping details
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: ShieldCheck, label: "100% Safe" },
            { icon: Package, label: "Care Pack" },
            { icon: RotateCcw, label: "Returns" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-stone-400" />
              </div>
              <span className="text-[9px] font-bold text-stone-500 uppercase tracking-tighter text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
