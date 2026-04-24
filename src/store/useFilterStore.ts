import { create } from 'zustand';

export type SortBy = 'relevant' | 'price_asc' | 'price_desc';

export const MIN_PRICE = 0;
export const MAX_PRICE = 5000;

interface FilterStore {
  activeSubCategory: string;   // 'All' or a specific sub-category name
  selectedWeight: string;      // '' = no filter, or '250g' | '500g' | '1kg' | '5kg'
  priceRange: [number, number];
  sortBy: SortBy;

  setSubCategory: (sub: string) => void;
  toggleWeight: (w: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: SortBy) => void;
  clearSubFilters: () => void; // called on parent category change
  clearAll: () => void;
  getActiveCount: () => number;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  activeSubCategory: 'All',
  selectedWeight: '',
  priceRange: [MIN_PRICE, MAX_PRICE],
  sortBy: 'relevant',

  setSubCategory: (sub) => set({ activeSubCategory: sub }),

  toggleWeight: (w) =>
    set(state => ({ selectedWeight: state.selectedWeight === w ? '' : w })),

  setPriceRange: (range) => set({ priceRange: range }),

  setSortBy: (sort) => set({ sortBy: sort }),

  clearSubFilters: () =>
    set({
      activeSubCategory: 'All',
      selectedWeight: '',
      priceRange: [MIN_PRICE, MAX_PRICE],
      sortBy: 'relevant',
    }),

  clearAll: () =>
    set({
      activeSubCategory: 'All',
      selectedWeight: '',
      priceRange: [MIN_PRICE, MAX_PRICE],
      sortBy: 'relevant',
    }),

  getActiveCount: () => {
    const s = get();
    let count = 0;
    if (s.activeSubCategory !== 'All') count++;
    if (s.selectedWeight) count++;
    if (s.priceRange[0] > MIN_PRICE || s.priceRange[1] < MAX_PRICE) count++;
    return count;
  },
}));
