"use client";

import Link from 'next/link';
import { useState } from 'react';
import { categoryTree } from '@/data/mockData';
import { useFilterStore, MAX_PRICE, MIN_PRICE } from '@/store/useFilterStore';

// ─── Dual Range Price Slider ──────────────────────────────────────
function DualRangeSlider({
  value, onChange,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [min, max] = value;
  const minPct = ((min - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maxPct = ((max - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div>
      <style>{`
        .price-thumb {
          position: absolute; width: 100%; height: 4px;
          -webkit-appearance: none; appearance: none;
          background: transparent; pointer-events: none;
        }
        .price-thumb::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          height: 17px; width: 17px; border-radius: 50%;
          background: white; border: 2.5px solid #3d7a45;
          cursor: pointer; pointer-events: all;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .price-thumb::-moz-range-thumb {
          height: 17px; width: 17px; border-radius: 50%;
          background: white; border: 2.5px solid #3d7a45;
          cursor: pointer; pointer-events: all;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
      `}</style>

      <div className="relative h-5 flex items-center mb-3">
        <div className="absolute w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full">
          <div
            className="absolute h-full bg-primary-green rounded-full"
            style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
          />
        </div>
        <input type="range" className="price-thumb" step={50}
          min={MIN_PRICE} max={MAX_PRICE} value={min}
          style={{ zIndex: min > MAX_PRICE * 0.95 ? 5 : 3 }}
          onChange={e => onChange([Math.min(+e.target.value, max - 100), max])}
        />
        <input type="range" className="price-thumb" step={50}
          min={MIN_PRICE} max={MAX_PRICE} value={max}
          style={{ zIndex: max < MIN_PRICE + MAX_PRICE * 0.05 ? 5 : 4 }}
          onChange={e => onChange([min, Math.max(+e.target.value, min + 100)])}
        />
      </div>
      <div className="flex justify-between text-sm font-bold text-stone-700 dark:text-stone-200">
        <span>৳{min.toLocaleString()}</span>
        <span>৳{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────
export function CatalogSidebar({ activeCategoryId }: { activeCategoryId: string }) {
  const { selectedWeight, toggleWeight, priceRange, setPriceRange, clearSubFilters } = useFilterStore();
  const WEIGHTS = ['250g', '500g', '1kg', '5kg'];

  const headingClass = 'text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3';

  return (
    <div className="space-y-7">

      {/* ── Categories ── */}
      <div>
        <p className={headingClass}>Categories</p>
        <nav className="space-y-0.5">
          {/* All Products */}
          <Link
            href="/category/all"
            onClick={clearSubFilters}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeCategoryId === 'all'
                ? 'bg-primary-green text-white shadow-md shadow-primary-green/20'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span className="text-base leading-none">🛒</span> All Products
          </Link>

          {categoryTree.map(cat => {
            const isActive = cat.id === activeCategoryId;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                onClick={clearSubFilters}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary-green text-white shadow-md shadow-primary-green/20'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span className="text-base leading-none">{cat.icon}</span>
                <span className="flex-1">{cat.name}</span>
                {isActive && (
                  <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full">
                    {cat.bnName}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="w-full h-px bg-stone-100 dark:bg-stone-800" />

      {/* ── Product Weight ── */}
      <div>
        <p className={headingClass}>Weight / Size</p>
        <div className="flex flex-wrap gap-2">
          {WEIGHTS.map(w => (
            <button
              key={w}
              onClick={() => toggleWeight(w)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                selectedWeight === w
                  ? 'bg-primary-green border-primary-green text-white shadow-sm'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 hover:border-primary-green hover:text-primary-green'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* ── Price Range ── */}
      <div>
        <p className={headingClass}>Price Range</p>
        <DualRangeSlider value={priceRange} onChange={setPriceRange} />
      </div>

    </div>
  );
}
