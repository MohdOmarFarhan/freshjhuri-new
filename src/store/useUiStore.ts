import { create } from 'zustand';

interface UiState {
  isMobileMenuOpen: boolean;
  language: 'en' | 'bn';
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleLanguage: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobileMenuOpen: false,
  language: 'en',
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'bn' : 'en' })),
}));
