"use client";

import { Search, ShoppingCart, Menu, Moon, Sun, Globe, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useUiStore } from '@/store/useUiStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import { categories } from '@/data/mockData';

export function Header() {
  const { language, toggleLanguage } = useUiStore();
  const { items, toggleDrawer } = useCartStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { openModal, isAuthenticated, user } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-stone-950/90 backdrop-blur-md shadow-sm' 
          : 'bg-white/80 dark:bg-stone-950/80 backdrop-blur-sm'
      }`}
    >
      {/* Top Tier: Branding, Search, Actions */}
      <div className="border-b border-gray-200/60 dark:border-white/5 py-3 md:py-4">
        <div className="container mx-auto px-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 md:gap-8">
          
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1 text-stone-700 dark:text-stone-300 hover:text-primary-green transition">
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-green tracking-tight font-sans leading-none">
                my<span className="text-honey-gold">Bazar</span>
              </h1>
              <span className="text-[10px] text-stone-500 uppercase tracking-widest hidden md:block mt-1 font-semibold">Agro Products</span>
            </Link>
          </div>

          {/* Expanded Search Bar */}
          <div className="order-last md:order-none w-full md:flex-1 max-w-2xl">
            <div className="relative w-full flex items-center bg-stone-100 dark:bg-stone-900 border border-transparent dark:border-stone-800 rounded-full transition-all focus-within:ring-2 focus-within:ring-primary-green/50 focus-within:border-primary-green/50">
              <div className="pl-4 pr-2 text-stone-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder={language === 'en' ? "Search products, brands, or categories" : "মধু, খেজুর, মসলা খুঁজুন..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2.5 outline-none text-stone-700 dark:text-stone-200 text-sm md:text-base placeholder-stone-400 dark:placeholder-stone-500"
              />
              <div className="pr-1.5 py-1.5">
                <button className="bg-primary-green hover:bg-primary-green-hover text-white text-sm font-bold px-5 py-1.5 rounded-full transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Toggle (Styled as a switch pill) */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center bg-stone-100 dark:bg-stone-900 rounded-full p-1 border border-stone-200 dark:border-stone-800 transition-colors"
              title="Toggle Language"
            >
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${language === 'en' ? 'bg-honey-gold text-white shadow-sm' : 'text-stone-500'}`}>EN</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${language === 'bn' ? 'bg-primary-green text-white shadow-sm' : 'text-stone-500'}`}>BN</span>
            </button>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 flex flex-col items-center justify-center rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                title="Toggle Dark Mode"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={resolvedTheme}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            )}

            {/* User Login / My Account */}
            <Link 
              href={isAuthenticated ? "/my-account" : "/auth"}
              className="px-4 h-10 flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors gap-2"
            >
              <User className="w-4 h-4" />
              {isAuthenticated && user?.name ? (
                <span className="text-xs font-bold truncate max-w-[80px] hidden lg:block">
                  {user.name.split(' ')[0]}
                </span>
              ) : (
                <span className="text-xs font-bold hidden lg:block">Login</span>
              )}
            </Link>

            {/* Cart Icon */}
            <button
              onClick={toggleDrawer}
              className="relative w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors ml-1"
            >
              <ShoppingCart className="w-4 h-4" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span
                    key={cartItemCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-honey-gold text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white dark:border-stone-950"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tier: Category Pills */}
      <div className="container mx-auto px-4 py-2.5 hidden md:flex items-center gap-3 overflow-x-auto no-scrollbar">
        {/* Products Pill */}
        <Link href="/category/all" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-stone-800 dark:bg-stone-800 hover:bg-black dark:hover:bg-stone-700 text-white text-sm font-semibold transition-colors shrink-0">
          All Products
        </Link>

        {/* Categories */}
        {categories.map((cat, i) => (
          <Link
            key={i}
            href={`/category/${cat.id}`}
            className="px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm font-medium transition-colors shrink-0"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </header>
  );
}
