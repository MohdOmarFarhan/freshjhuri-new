"use client";

import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

export function CheckoutForm() {
  const { 
    setDeliveryZone, 
    deliveryZone, 
    shippingDetails, 
    updateShippingDetails 
  } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  // "Magic Connection": Auto-fill checkout with saved profile data
  useEffect(() => {
    if (isAuthenticated && user) {
      updateShippingDetails({
        name: user.name || shippingDetails.name,
        phone: user.phone || shippingDetails.phone,
        address: user.detailedAddress || shippingDetails.address
      });
      
      if (user.district) {
        setDeliveryZone(user.district.toLowerCase().includes('dhaka') ? 'dhaka' : 'outside');
      }
    }
  }, [isAuthenticated, user, updateShippingDetails, setDeliveryZone]);

  const handleInputChange = (field: keyof typeof shippingDetails, value: string) => {
    updateShippingDetails({ [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <section>
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-6 flex items-center gap-2">
          <span className="w-7 h-7 bg-stone-900 dark:bg-stone-50 text-white dark:text-stone-900 rounded-full flex items-center justify-center text-xs">1</span>
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Mohd Omar Farhan"
              value={shippingDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-primary-green/20 outline-none transition-all placeholder:text-stone-300 dark:placeholder:text-stone-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Mobile Number</label>
            <input 
              type="tel" 
              placeholder="e.g. 017XXXXXXXX"
              value={shippingDetails.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-primary-green/20 outline-none transition-all placeholder:text-stone-300 dark:placeholder:text-stone-600"
            />
          </div>
        </div>
      </section>

      {/* Shipping Address */}
      <section>
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-6 flex items-center gap-2">
          <span className="w-7 h-7 bg-stone-900 dark:bg-stone-50 text-white dark:text-stone-900 rounded-full flex items-center justify-center text-xs">2</span>
          Shipping Address
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Full Address</label>
            <textarea 
              rows={3}
              placeholder="House #, Road #, Area, City"
              value={shippingDetails.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-primary-green/20 outline-none transition-all resize-none placeholder:text-stone-300 dark:placeholder:text-stone-600"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setDeliveryZone('dhaka')}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                deliveryZone === 'dhaka' 
                  ? 'border-primary-green bg-primary-green/5 shadow-md shadow-primary-green/5' 
                  : 'border-stone-100 dark:border-stone-800 hover:border-stone-200'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-bold ${deliveryZone === 'dhaka' ? 'text-primary-green' : 'text-stone-800 dark:text-stone-200'}`}>Inside Dhaka</span>
                <span className="text-xs font-black">৳70</span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium uppercase tracking-tight">Delivery in 24-48 Hours</p>
            </button>

            <button 
              onClick={() => setDeliveryZone('outside')}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                deliveryZone === 'outside' 
                  ? 'border-primary-green bg-primary-green/5 shadow-md shadow-primary-green/5' 
                  : 'border-stone-100 dark:border-stone-800 hover:border-stone-200'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-bold ${deliveryZone === 'outside' ? 'text-primary-green' : 'text-stone-800 dark:text-stone-200'}`}>Outside Dhaka</span>
                <span className="text-xs font-black">৳130</span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium uppercase tracking-tight">Delivery in 3-5 Days</p>
            </button>
          </div>
        </div>
      </section>

      {/* Payment Method */}
      <section>
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-6 flex items-center gap-2">
          <span className="w-7 h-7 bg-stone-900 dark:bg-stone-50 text-white dark:text-stone-900 rounded-full flex items-center justify-center text-xs">3</span>
          Payment Method
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-5 rounded-2xl border-2 border-primary-green bg-primary-green/5 cursor-pointer shadow-md shadow-primary-green/5">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full border-4 border-primary-green bg-white" />
              <div>
                <span className="block font-bold text-stone-900 dark:text-stone-100 italic font-sans italic">Cash on Delivery</span>
                <span className="text-[11px] font-medium text-stone-500 uppercase tracking-widest text-bengali">ক্যাশ অন ডেলিভারি</span>
              </div>
            </div>
            <img src="https://img.icons8.com/color/48/hand-shake.png" className="w-8 h-8 opacity-50" />
          </label>

          <label className="flex items-center justify-between p-5 rounded-2xl border-2 border-stone-100 dark:border-stone-800 opacity-60 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full border-2 border-stone-200" />
              <div>
                <span className="block font-bold text-stone-400 italic font-sans italic">Online Payment</span>
                <span className="text-[11px] font-medium text-stone-400 uppercase tracking-widest">bKash / Card (Coming Soon)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <img src="https://img.icons8.com/color/48/visa.png" className="w-6 h-6 grayscale" />
              <img src="https://img.icons8.com/color/48/mastercard.png" className="w-6 h-6 grayscale" />
            </div>
          </label>
        </div>
      </section>
    </div>
  );
}
