import { create } from 'zustand';

export type Page = 'home' | 'services' | 'therapists' | 'about' | 'blog' | 'contact' | 'membership';

interface AppState {
  currentPage: Page;
  navigate: (page: Page) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  bookingSuccess: boolean;
  setBookingSuccess: (success: boolean) => void;
  activeBlogCategory: string;
  setActiveBlogCategory: (cat: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'home',
  navigate: (page) => {
    set({ currentPage: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  bookingSuccess: false,
  setBookingSuccess: (success) => set({ bookingSuccess: success }),
  activeBlogCategory: 'All',
  setActiveBlogCategory: (cat) => set({ activeBlogCategory: cat }),
}));