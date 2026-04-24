"use client";

import { useAuthStore, OrderRecord, UserProfile } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  LogOut, 
  CheckCircle, 
  Clock, 
  Truck, 
  ChevronRight, 
  Save, 
  ShoppingBag,
  Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Section = 'overview' | 'orders' | 'address' | 'preferences';

export default function DashboardPage() {
  const router = useRouter();
  const { user, orders, logout, isAuthenticated, updateProfile } = useAuthStore();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) router.push('/auth');
  }, [isAuthenticated, router]);

  if (!isMounted || !user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'address', label: 'Address Book', icon: MapPin },
    { id: 'preferences', label: 'Preferences', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950/20 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 rounded-2xl bg-primary-green/10 flex items-center justify-center text-primary-green overflow-hidden">
                   <img src={`https://ui-avatars.com/api/?name=${user.name}&background=E7F3E8&color=10B981&bold=true`} alt={user.name} />
                </div>
                <div>
                  <h2 className="font-black text-stone-900 dark:text-stone-50 italic font-sans italic text-lg">{user.name}</h2>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">{user.phone}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as Section)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                      activeSection === item.id 
                        ? 'bg-primary-green text-white shadow-lg shadow-primary-green/20' 
                        : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-white' : 'text-stone-400'}`} />
                    {item.label}
                  </button>
                ))}
                
                <div className="h-px bg-stone-100 dark:bg-stone-800 my-4" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeSection === 'overview' && <OverviewSection key="overview" user={user} orders={orders} />}
              {activeSection === 'orders' && <OrdersSection key="orders" orders={orders} />}
              {activeSection === 'address' && <AddressSection key="address" user={user} updateProfile={updateProfile} />}
              {activeSection === 'preferences' && <PreferencesSection key="preferences" user={user} updateProfile={updateProfile} />}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function OverviewSection({ user, orders }: { user: UserProfile, orders: OrderRecord[] }) {
  const isProfileIncomplete = !user.detailedAddress || !user.district;
  const [typedTitle, setTypedTitle] = useState("");

  useEffect(() => {
    const text = `Welcome back, ${user.name.split(' ')[0]}!`;
    let i = 0;
    const timer = setInterval(() => {
      setTypedTitle(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [user.name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 p-10 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 italic font-sans italic min-h-[1em]">
            {typedTitle}<span className="animate-pulse text-primary-green">|</span>
          </h1>
          <p className="text-stone-500 mt-4 text-lg max-w-lg leading-relaxed">
            Your premium household dashboard. Manage your organic pantry and track your journey to safe food.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <ShoppingBag className="w-48 h-48 text-primary-green" />
        </div>
      </div>

      {isProfileIncomplete && (
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-[2rem] border border-amber-100 dark:border-amber-900/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm shadow-amber-500/5">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-amber-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-amber-900 dark:text-amber-200 text-lg italic font-sans italic">Profile Incomplete</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Add your shipping details now for a lightning-fast checkout later.</p>
            </div>
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 h-12 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/10">
             Complete Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-500' },
          { label: 'Active Orders', value: orders.filter(o => o.status !== 'delivered').length, icon: Clock, color: 'text-primary-green' },
          { label: 'Saved Addresses', value: user.detailedAddress ? 1 : 0, icon: MapPin, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-100 dark:border-stone-800 p-8 flex items-center gap-6 shadow-sm">
            <div className={`w-14 h-14 rounded-2xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h4 className="text-3xl font-black text-stone-900 dark:text-stone-50">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function OrdersSection({ orders }: { orders: OrderRecord[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400';
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
      case 'shipped': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
      default: return 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-sm"
    >
      <div className="p-8 border-b border-stone-50 dark:border-stone-800 flex justify-between items-center">
        <h2 className="text-2xl font-black text-stone-900 dark:text-stone-50 italic font-sans italic">Order History</h2>
        <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest bg-stone-50 dark:bg-stone-800 px-4 py-2 rounded-full">
           <Package className="w-3 h-3" />
           {orders.length} Orders
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stone-50 dark:border-stone-800">
              <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Order ID</th>
              <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Date</th>
              <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Total</th>
              <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50 dark:divide-stone-800/50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/20 transition-colors group">
                <td className="px-8 py-6 font-black text-stone-900 dark:text-stone-200">#{order.id}</td>
                <td className="px-8 py-6 text-sm font-bold text-stone-500">{order.date}</td>
                <td className="px-8 py-6 font-black text-stone-900 dark:text-stone-200">৳{order.total}</td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                    <button className="h-9 px-4 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Track</button>
                    <button className="h-9 px-4 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-[10px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-stone-800">Reorder</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function AddressSection({ user, updateProfile }: { user: UserProfile, updateProfile: (p: Partial<UserProfile>) => void }) {
  const [formData, setFormData] = useState(user);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 p-10 shadow-sm"
    >
      <div className="mb-10">
        <h2 className="text-2xl font-black text-stone-900 dark:text-stone-50 italic font-sans italic mb-2">Address Book</h2>
        <p className="text-sm text-stone-500 font-medium tracking-tight">Save your delivery locations for 1-click checkout.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full h-14 px-6 bg-stone-50/50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Alt. Phone</label>
            <input 
              type="tel" 
              placeholder="01XXXXXXXXX"
              value={formData.alternativePhone || ''}
              onChange={(e) => setFormData({...formData, alternativePhone: e.target.value})}
              className="w-full h-14 px-6 bg-stone-50/50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Division</label>
            <select 
              value={formData.division || ''}
              onChange={(e) => setFormData({...formData, division: e.target.value})}
              className="w-full h-14 px-6 bg-stone-50/50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm font-bold"
            >
              <option value="">Select Division</option>
              {['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Barisal', 'Rangpur', 'Mymensingh'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">District</label>
            <input 
              type="text" 
              placeholder="e.g. Dhaka, Bogra"
              value={formData.district || ''}
              onChange={(e) => setFormData({...formData, district: e.target.value})}
              className="w-full h-14 px-6 bg-stone-50/50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm font-bold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Detailed Address</label>
          <textarea 
            rows={3}
            required
            placeholder="House #, Road #, Block/Sector, Area"
            value={formData.detailedAddress || ''}
            onChange={(e) => setFormData({...formData, detailedAddress: e.target.value})}
            className="w-full p-6 bg-stone-50/50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm font-bold resize-none"
          />
        </div>

        <button 
          type="submit"
          disabled={isSaved}
          className={`h-16 px-12 rounded-2xl font-black transition-all flex items-center gap-3 ${
            isSaved 
              ? 'bg-primary-green text-white scale-95 shadow-lg shadow-primary-green/20' 
              : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:scale-[1.02] shadow-xl shadow-stone-200 dark:shadow-none'
          }`}
        >
          {isSaved ? <><CheckCircle className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Address</>}
        </button>
      </form>
    </motion.div>
  );
}

function PreferencesSection({ user, updateProfile }: { user: UserProfile, updateProfile: (p: Partial<UserProfile>) => void }) {
  const [selectedPayment, setSelectedPayment] = useState(user.preferredPayment || 'cod');

  const handleUpdate = (method: 'cod' | 'online') => {
    setSelectedPayment(method);
    updateProfile({ preferredPayment: method });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 p-10 shadow-sm"
    >
      <div className="mb-10">
        <h2 className="text-2xl font-black text-stone-900 dark:text-stone-50 italic font-sans italic mb-2">Shopping Preferences</h2>
        <p className="text-sm text-stone-500 font-medium tracking-tight">Customize your checkout experience.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Default Payment Method</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive the product', icon: Truck },
              { id: 'online', label: 'Online Payment', sub: 'bKash, Nagad or Cards', icon: CreditCard, disabled: true },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => !method.disabled && handleUpdate(method.id as any)}
                className={`p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${
                  selectedPayment === method.id 
                    ? 'border-primary-green bg-primary-green/5 shadow-md' 
                    : method.disabled
                      ? 'border-stone-50 dark:border-stone-800 opacity-50 cursor-not-allowed'
                      : 'border-stone-100 dark:border-stone-800 hover:border-stone-200'
                }`}
              >
                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                   <div className="flex justify-between items-start">
                      <method.icon className={`w-8 h-8 ${selectedPayment === method.id ? 'text-primary-green' : 'text-stone-400'}`} />
                      {selectedPayment === method.id && <div className="w-5 h-5 bg-primary-green rounded-full flex items-center justify-center text-white"><CheckCircle className="w-3 h-3" /></div>}
                      {method.disabled && <span className="text-[8px] font-black uppercase tracking-widest bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">Coming Soon</span>}
                   </div>
                   <div>
                      <h4 className="font-black text-stone-900 dark:text-stone-50 text-sm italic font-sans italic mb-1">{method.label}</h4>
                      <p className="text-[10px] font-medium text-stone-500 uppercase tracking-tight leading-relaxed">{method.sub}</p>
                   </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
