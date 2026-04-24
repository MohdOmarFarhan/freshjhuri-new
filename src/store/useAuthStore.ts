import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  alternativePhone?: string;
  division?: string;
  district?: string;
  detailedAddress?: string;
  preferredPayment?: 'cod' | 'online';
}

export interface OrderRecord {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  orders: OrderRecord[];
  isAuthModalOpen: boolean;
  
  // Actions
  login: (credentials: { id: string; password?: string }) => void;
  signup: (userData: UserProfile & { password?: string }) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  
  // Modal Actions
  openModal: () => void;
  closeModal: () => void;
}

const MOCK_ORDERS: OrderRecord[] = [
  { id: 'MB-7829', date: '2024-03-24', total: 1250, status: 'delivered', items: 3 },
  { id: 'MB-9123', date: '2024-04-10', total: 2400, status: 'processing', items: 2 },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      orders: MOCK_ORDERS,
      isAuthModalOpen: false,

      login: (credentials) => {
        // Mock login
        set({ 
          isAuthenticated: true, 
          user: { 
            phone: credentials.id.includes('@') ? '01700000000' : credentials.id,
            email: credentials.id.includes('@') ? credentials.id : 'user@example.com',
            name: 'Mohd Omar Farhan',
            detailedAddress: 'House 12, Road 5, Block B, Banani',
            division: 'Dhaka',
            district: 'Dhaka',
            preferredPayment: 'cod'
          },
          isAuthModalOpen: false
        });
      },

      signup: (userData) => {
        set({ 
          isAuthenticated: true, 
          user: userData,
          isAuthModalOpen: false
        });
      },

      logout: () => {
        set({ isAuthenticated: false, user: null });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        }));
      },

      openModal: () => set({ isAuthModalOpen: true }),
      closeModal: () => set({ isAuthModalOpen: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        user: state.user,
        orders: state.orders
      }),
    }
  )
);
