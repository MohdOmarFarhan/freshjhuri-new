import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/mockData';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingDetails {
  name: string;
  phone: string;
  address: string;
}

export const FREE_SHIPPING_THRESHOLD = 2000;

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  deliveryZone: 'dhaka' | 'outside';
  shippingDetails: ShippingDetails;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // UI Actions
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setDeliveryZone: (zone: 'dhaka' | 'outside') => void;
  updateShippingDetails: (details: Partial<ShippingDetails>) => void;
  
  // Derived
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getGrandTotal: () => number;
  isCheckoutValid: () => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      deliveryZone: 'dhaka',
      shippingDetails: {
        name: '',
        phone: '',
        address: '',
      },

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          let newItems;
          if (existing) {
            newItems = state.items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
          } else {
            newItems = [...state.items, { product, quantity }];
          }
          return { 
            items: newItems,
            isDrawerOpen: true // Auto-open drawer when adding item
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      setDeliveryZone: (zone) => set({ deliveryZone: zone }),
      
      updateShippingDetails: (details) => 
        set((state) => ({
          shippingDetails: { ...state.shippingDetails, ...details }
        })),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
        return get().deliveryZone === 'dhaka' ? 70 : 130;
      },

      getGrandTotal: () => {
        return get().getSubtotal() + get().getDeliveryFee();
      },

      isCheckoutValid: () => {
        const { name, phone, address } = get().shippingDetails;
        // Simple validation: check if non-empty and phone length roughly correct
        return (
          name.trim().length > 2 &&
          phone.trim().length >= 11 &&
          address.trim().length > 5 &&
          get().items.length > 0
        );
      },
    }),
    {
      name: 'cart-storage',
      // only persist items, delivery zone, and shipping details
      partialize: (state) => ({ 
        items: state.items, 
        deliveryZone: state.deliveryZone,
        shippingDetails: state.shippingDetails
      }),
    }
  )
);
