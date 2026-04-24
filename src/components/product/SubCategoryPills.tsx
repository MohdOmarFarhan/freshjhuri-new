"use client";

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { categoryTree, CategoryNode } from '@/data/mockData';
import { useFilterStore } from '@/store/useFilterStore';

interface SubCategoryPillsProps {
  categoryId: string;  // current page category ('honey', 'all', etc.)
}

const TOP_CATEGORIES = ['honey', 'fruits', 'dates', 'cooking', 'spices'];

export function SubCategoryPills({ categoryId }: SubCategoryPillsProps) {
  const router = useRouter();
  const { activeSubCategory, setSubCategory, clearSubFilters } = useFilterStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAll = categoryId === 'all';

  // Find sub-categories for the active parent
  const catNode: CategoryNode | undefined = isAll
    ? undefined
    : categoryTree.find(c => c.id === categoryId);

  // If "all", show top 5 categories
  // If specific category, show "All [Category]" + its sub-categories
  const pills = isAll
    ? TOP_CATEGORIES.map(id => categoryTree.find(c => c.id === id)).filter(Boolean) as CategoryNode[]
    : catNode
      ? [{ name: `All ${catNode.name}`, id: 'all_sub' }, ...catNode.subCategories.map(s => ({ name: s, id: s }))]
      : [];

  if (pills.length === 0) return null;

  const handleClick = (pill: any, index: number) => {
    if (isAll) {
      // Navigate to the category page
      clearSubFilters();
      router.push(`/category/${pill.id}`);
    } else {
      // Filter by sub-category
      setSubCategory(index === 0 ? 'All' : pill.name);
    }

    // Scroll the clicked pill into center view on mobile
    const container = scrollRef.current;
    const item = container?.children[index] as HTMLElement;
    if (item && container) {
      const offset = item.offsetLeft - container.offsetWidth / 2 + item.offsetWidth / 2;
      container.scrollTo({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide flex-nowrap"
    >
      {isAll && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mr-2 shrink-0">
          Popular:
        </span>
      )}
      {pills.map((pill, i) => {
        const title = (pill as any).name;
        const isActive = isAll
          ? false // parent categories aren't "active" in the filter sense here
          : i === 0
            ? activeSubCategory === 'All'
            : activeSubCategory === title;

        return (
          <motion.button
            key={(pill as any).id || title}
            onClick={() => handleClick(pill, i)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all border whitespace-nowrap ${
              isActive
                ? 'bg-primary-green border-primary-green text-white shadow-md shadow-primary-green/20'
                : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 hover:border-primary-green hover:text-primary-green dark:hover:border-primary-green'
            }`}
          >
            {isAll && <span className="mr-1.5">{(pill as any).icon}</span>}
            {title}
            {isActive && (
              <motion.span
                layoutId="pill-active-dot"
                className="inline-block ml-1.5 w-1.5 h-1.5 rounded-full bg-white/70"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
