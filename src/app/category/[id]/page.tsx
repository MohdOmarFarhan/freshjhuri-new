"use client";

import Image from 'next/image';
import Link from 'next/link';
import { use, useMemo, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  SlidersHorizontal, ArrowUpDown, LayoutGrid, List,
  X, ChevronRight, Leaf, ShoppingCart, CheckCircle, Zap
} from 'lucide-react';

import { mockProducts, categoryTree, Product } from '@/data/mockData';
import { useFilterStore, MAX_PRICE, MIN_PRICE } from '@/store/useFilterStore';
import { CatalogSidebar } from '@/components/product/CatalogSidebar';
import { SubCategoryPills } from '@/components/product/SubCategoryPills';
import { useCartStore } from '@/store/useCartStore';

// ─── Hero config per category ─────────────────────────────────────
const heroCfg: Record<string, { grad: string; img: string }> = {
  honey:      { grad: 'from-amber-50  to-stone-50  dark:from-amber-950/30  dark:to-stone-950', img: '/images/honey.png' },
  fruits:     { grad: 'from-green-50  to-stone-50  dark:from-green-950/30  dark:to-stone-950', img: '/images/mango.png' },
  dates:      { grad: 'from-orange-50 to-stone-50  dark:from-orange-950/30 dark:to-stone-950', img: '/images/dates.png' },
  cooking:    { grad: 'from-yellow-50 to-stone-50  dark:from-yellow-950/30 dark:to-stone-950', img: '/images/honey.png' },
  spices:     { grad: 'from-red-50    to-stone-50  dark:from-red-950/30    dark:to-stone-950', img: '/images/spices.png' },
  nuts:       { grad: 'from-amber-50  to-stone-50  dark:from-amber-950/30  dark:to-stone-950', img: '/images/dates.png' },
  superfoods: { grad: 'from-teal-50   to-stone-50  dark:from-teal-950/30   dark:to-stone-950', img: '/images/spices.png' },
  pickles:    { grad: 'from-lime-50   to-stone-50  dark:from-lime-950/30   dark:to-stone-950', img: '/images/spices.png' },
  tea:        { grad: 'from-emerald-50 to-stone-50 dark:from-emerald-950/30 dark:to-stone-950', img: '/images/spices.png' },
  all:        { grad: 'from-stone-100 to-stone-50  dark:from-stone-900/60  dark:to-stone-950', img: '/images/honey.png' },
};

// ─── Skeleton card ─────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-4 animate-pulse">
      <div className="aspect-square bg-stone-200 dark:bg-stone-800 rounded-xl mb-4" />
      <div className="h-2.5 bg-stone-200 dark:bg-stone-800 rounded w-1/3 mb-2" />
      <div className="h-4   bg-stone-200 dark:bg-stone-800 rounded w-3/4 mb-1.5" />
      <div className="h-4   bg-stone-200 dark:bg-stone-800 rounded w-1/2 mb-4" />
      <div className="h-px  bg-stone-200 dark:bg-stone-800 mb-3" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-9 bg-stone-200 dark:bg-stone-800 rounded-xl" />
        <div className="h-9 bg-stone-200 dark:bg-stone-800 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Product Card (Grid) ────────────────────────────────────────────
function GridCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    router.push('/checkout');
  };
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-4 hover:shadow-lg hover:shadow-stone-200/60 dark:hover:shadow-none transition-shadow group flex flex-col h-full"
    >
      <Link href={`/product/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative w-full aspect-square bg-amber-50 dark:bg-stone-800 rounded-xl overflow-hidden mb-4">
          {product.badge && (
            <div className="absolute top-2 left-2 z-10 bg-primary-green/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> {product.badge}
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              -{discount}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 z-10 bg-stone-900/60 flex items-center justify-center rounded-xl">
              <span className="bg-white/90 text-stone-800 text-xs font-bold px-3 py-1 rounded-full">
                {product.isPreOrder ? '🕐 Pre-Order' : 'Out of Stock'}
              </span>
            </div>
          )}
          <motion.div className="w-full h-full relative" whileHover={{ scale: 1.07 }} transition={{ duration: 0.4 }}>
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col">
          <p className="text-xs text-stone-400 mb-0.5">{product.bnName}</p>
          <h3 className="text-sm md:text-base font-semibold text-stone-800 dark:text-stone-100 leading-tight line-clamp-2 mb-1 group-hover:text-primary-green transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-stone-400 mb-3">{product.subCategory}</p>

          <div className="mt-auto">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary-green">৳{product.price.toLocaleString()}</span>
              <span className="text-xs text-stone-400">/{product.unit}</span>
            </div>
            {product.originalPrice && (
              <del className="text-xs text-stone-400">৳{product.originalPrice.toLocaleString()}</del>
            )}
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
        <button
          onClick={handleAdd}
          disabled={isAdded || !product.inStock}
          className={`flex items-center justify-center py-2 rounded-xl text-sm font-semibold transition-all ${
            isAdded
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : product.inStock
                ? 'border-2 border-primary-green text-primary-green hover:bg-primary-green/5'
                : 'border-2 border-stone-200 dark:border-stone-700 text-stone-400 cursor-not-allowed'
          }`}
        >
          {isAdded
            ? <><CheckCircle className="w-3.5 h-3.5 mr-1" />Added</>
            : <><ShoppingCart className="w-3.5 h-3.5 mr-1" />Cart</>
          }
        </button>
        <button
          disabled={!product.inStock}
          onClick={handleBuyNow}
          className={`py-2 rounded-xl text-sm font-semibold transition-all ${
            product.inStock
              ? 'bg-primary-green hover:bg-primary-green-hover text-white shadow-md shadow-primary-green/20'
              : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
          }`}
        >
          {product.isPreOrder ? 'Pre-Order' : 'Buy Now'}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Product Card (List) ────────────────────────────────────────────
function ListCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    router.push('/checkout');
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-4 md:p-5 flex gap-4 hover:shadow-md dark:hover:shadow-none transition-shadow group"
    >
      <Link href={`/product/${product.id}`} className="relative w-24 h-24 md:w-32 md:h-32 bg-amber-50 dark:bg-stone-800 rounded-xl overflow-hidden flex-shrink-0">
        {product.badge && (
          <div className="absolute top-1 left-1 z-10 bg-primary-green text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            {product.badge}
          </div>
        )}
        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
      </Link>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <Link href={`/product/${product.id}`}>
          <p className="text-xs text-stone-400">{product.bnName}</p>
          <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base leading-tight truncate group-hover:text-primary-green transition-colors">{product.name}</h3>
          <p className="text-xs text-stone-400 mb-1">{product.subCategory}</p>
          <p className="text-stone-500 dark:text-stone-400 text-sm line-clamp-2 hidden sm:block">{product.description}</p>
        </Link>
        <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
          <div>
            <span className="text-lg font-bold text-primary-green">৳{product.price.toLocaleString()}</span>
            <span className="text-xs text-stone-400 ml-1">/{product.unit}</span>
            {product.originalPrice && <del className="ml-2 text-xs text-stone-400">৳{product.originalPrice.toLocaleString()}</del>}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={isAdded}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${isAdded ? 'bg-green-100 text-green-700' : 'border-2 border-primary-green text-primary-green hover:bg-primary-green/5'}`}>
              {isAdded ? <><CheckCircle className="w-4 h-4" />Added</> : <><ShoppingCart className="w-4 h-4" />Cart</>}
            </button>
            <button 
              onClick={handleBuyNow}
              className="bg-primary-green hover:bg-primary-green-hover text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-primary-green/20 transition-all">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────
export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params);
  const categoryId = rawId.toLowerCase();
  const isAll = categoryId === 'all';

  const catNode = categoryTree.find(c => c.id === categoryId);
  const displayName = catNode?.name ?? (isAll ? 'All Products' : rawId);
  const displayIcon = catNode?.icon ?? '🛒';
  const bnName = catNode?.bnName ?? '';
  const hero = heroCfg[categoryId] ?? heroCfg.all;

  const { activeSubCategory, selectedWeight, priceRange, sortBy, setSortBy, clearSubFilters, getActiveCount } = useFilterStore();

  // Reset sub-filters on every category change
  useEffect(() => { clearSubFilters(); }, [categoryId]); // eslint-disable-line

  // View / mobile state
  const [viewMode,    setViewMode]    = useState<'grid' | 'list'>('grid');
  const [showFilter,  setShowFilter]  = useState(false);
  const [showSort,    setShowSort]    = useState(false);

  // Skeleton on filter change
  const [isSkeleton,  setIsSkeleton]  = useState(false);
  const skelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setIsSkeleton(true);
    if (skelTimer.current) clearTimeout(skelTimer.current);
    skelTimer.current = setTimeout(() => setIsSkeleton(false), 380);
    return () => { if (skelTimer.current) clearTimeout(skelTimer.current); };
  }, [activeSubCategory, selectedWeight, priceRange[0], priceRange[1], sortBy]);

  // Base products for this category page
  const baseProducts = useMemo(
    () => isAll ? mockProducts : mockProducts.filter(p => p.category === categoryId),
    [categoryId, isAll]
  );

  // Filtered + sorted products
  const filteredProducts = useMemo(() => {
    let r = baseProducts;
    if (activeSubCategory !== 'All') r = r.filter(p => p.subCategory === activeSubCategory);
    if (selectedWeight)               r = r.filter(p => p.weight === selectedWeight);
    r = r.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === 'price_asc')  r = [...r].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [baseProducts, activeSubCategory, selectedWeight, priceRange, sortBy]);

  const activeCount  = getActiveCount();

  const SORT_OPTIONS = [
    { value: 'relevant',   label: 'Most Relevant' },
    { value: 'price_asc',  label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
  ] as const;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-20 md:pb-6">

      {/* ─── Category Hero ──────────────────────────────── */}
      <div className={`w-full bg-gradient-to-br ${hero.grad} border-b border-stone-200/50 dark:border-white/5 relative overflow-hidden`}>
        <div className="absolute right-0 top-0 w-56 h-full opacity-10 dark:opacity-5 pointer-events-none">
          <Image src={hero.img} alt="" fill className="object-cover" />
        </div>
        <div className="absolute right-0 top-0 w-56 h-full bg-gradient-to-l from-transparent to-stone-50 dark:to-stone-950 pointer-events-none" />

        <div className="container mx-auto px-4 py-9 md:py-12 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-stone-400 mb-4">
            <Link href="/" className="hover:text-primary-green transition-colors font-medium">Home</Link>
            <ChevronRight className="w-3 h-3" />
            {!isAll && <><Link href="/category/all" className="hover:text-primary-green transition-colors">Shop</Link><ChevronRight className="w-3 h-3" /></>}
            <span className="text-stone-700 dark:text-stone-200 font-semibold">{displayName}</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center text-2xl shadow-md border border-white/80 dark:border-stone-700 shrink-0">
              {displayIcon}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">
                {displayName}
                {bnName && <span className="text-stone-400 dark:text-stone-500 font-normal ml-2 text-lg">· {bnName}</span>}
              </h1>
              <p className="text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-1 text-xs">
                <Leaf className="w-3 h-3 text-primary-green" /> 100% organic verified
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Sub-Category Pills (always visible on mobile) ── */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-[80px] z-30">
        <div className="container mx-auto px-4 py-3">
          <SubCategoryPills categoryId={categoryId} />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6">
        <div className="flex gap-6">

          {/* ─── Desktop Sidebar ─────────────────────────── */}
          <aside className="hidden md:block w-[220px] flex-shrink-0">
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sticky top-44 shadow-sm max-h-[calc(100vh-12rem)] overflow-y-auto">
              <CatalogSidebar activeCategoryId={categoryId} />
            </div>
          </aside>

          {/* ─── Main Content ─────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar row: pills (desktop) + right controls */}
            <div className="flex items-center gap-3 mb-5">
              {/* Pills — desktop only (mobile gets sticky bar above) */}
              <div className="flex-1 hidden md:block">
                <SubCategoryPills categoryId={categoryId} />
              </div>

              {/* Result count (mobile) */}
              <p className="text-sm text-stone-500 dark:text-stone-400 md:hidden flex-1">
                <strong className="text-stone-800 dark:text-stone-100">{filteredProducts.length}</strong> items
              </p>

              {/* Right controls */}
              <div className="flex items-center gap-2 shrink-0 ml-auto">
                {/* Result count (desktop) */}
                <span className="hidden md:inline text-sm text-stone-500 dark:text-stone-400">
                  <strong className="text-stone-800 dark:text-stone-100">{filteredProducts.length}</strong>
                  &nbsp;of {baseProducts.length}
                </span>

                {/* Sort dropdown (desktop) */}
                <div className="hidden md:flex items-center gap-1.5">
                  <ArrowUpDown className="w-4 h-4 text-stone-400" />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-green/30 cursor-pointer"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* View toggle */}
                <div className="flex bg-stone-100 dark:bg-stone-800 rounded-xl p-1 gap-1">
                  {(['grid', 'list'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setViewMode(m)}
                      className={`p-1.5 rounded-lg transition-all ${viewMode === m ? 'bg-white dark:bg-stone-700 shadow-sm text-primary-green' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                      {m === 'grid' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product grid / list */}
            <AnimatePresence mode="wait">
              {isSkeleton ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className={viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'flex flex-col gap-4'
                  }
                >
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </motion.div>
              ) : filteredProducts.length > 0 ? (
                <motion.div
                  key={`grid-${viewMode}-${activeSubCategory}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className={viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'flex flex-col gap-4'
                  }
                >
                  {filteredProducts.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      {viewMode === 'grid' ? <GridCard product={p} /> : <ListCard product={p} />}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-24 flex flex-col items-center text-center bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-700"
                >
                  <div className="text-6xl mb-5">{displayIcon}</div>
                  <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">No Products Found</h3>
                  <p className="text-stone-500 max-w-xs mb-7 text-sm">Try adjusting your price range or selecting a different sub-category.</p>
                  <button
                    onClick={clearSubFilters}
                    className="bg-primary-green hover:bg-primary-green-hover text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-primary-green/20"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Mobile Sticky Bottom Bar ─────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex shadow-lg">
        <button
          onClick={() => { setShowSort(true); setShowFilter(false); }}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-stone-700 dark:text-stone-200 font-bold text-sm"
        >
          <ArrowUpDown className="w-4 h-4" /> Sort
        </button>
        <div className="w-px bg-stone-200 dark:bg-stone-800" />
        <button
          onClick={() => { setShowFilter(true); setShowSort(false); }}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-stone-700 dark:text-stone-200 font-bold text-sm"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filter
          {activeCount > 0 && (
            <span className="bg-primary-green text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeCount}</span>
          )}
        </button>
      </div>

      {/* ─── Mobile Sort Sheet ──────────────────────────────── */}
      <AnimatePresence>
        {showSort && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSort(false)}
              className="fixed inset-0 bg-black/50 z-50 md:hidden" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.34 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-stone-950 rounded-t-3xl p-6 md:hidden"
            >
              <div className="w-10 h-1 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-5" />
              <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-4">Sort By</h3>
              {SORT_OPTIONS.map(o => (
                <button key={o.value} onClick={() => { setSortBy(o.value); setShowSort(false); }}
                  className={`w-full text-left px-4 py-3.5 rounded-xl mb-2 font-semibold transition-all ${sortBy === o.value ? 'bg-honey-gold/10 text-honey-gold border border-honey-gold/20' : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
                  {o.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Mobile Filter Bottom Sheet ─────────────────────── */}
      <AnimatePresence>
        {showFilter && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFilter(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.36 }}
              drag="y" dragConstraints={{ top: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => { if (info.offset.y > 100) setShowFilter(false); }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-stone-50 dark:bg-stone-950 rounded-t-3xl max-h-[85vh] flex flex-col md:hidden"
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-t-3xl">
                <h2 className="font-bold text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary-green" /> Filters
                </h2>
                <button onClick={() => setShowFilter(false)} className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <CatalogSidebar activeCategoryId={categoryId} />
              </div>
              <div className="p-5 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
                <button onClick={() => setShowFilter(false)}
                  className="w-full bg-primary-green hover:bg-primary-green-hover text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary-green/20">
                  View {filteredProducts.length} Products
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
