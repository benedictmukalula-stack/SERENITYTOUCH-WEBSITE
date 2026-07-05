import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Page = 'home' | 'services' | 'packages' | 'therapists' | 'about' | 'blog' | 'contact' | 'membership' | 'corporate' | 'vouchers' | 'gallery' | 'testimonials' | 'login' | 'register' | 'dashboard' | 'analytics';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  memberSince: string;
  bookingsUsed: number;
  bookingsRemaining: number;
  nextBilling: string;
}

interface AppState {
  currentPage: Page;
  navigate: (page: Page) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  bookingSuccess: boolean;
  setBookingSuccess: (success: boolean) => void;
  activeBlogCategory: string;
  setActiveBlogCategory: (cat: string) => void;
  // Auth
  isMemberLoggedIn: boolean;
  member: Member | null;
  loginMember: (member: Member) => void;
  logoutMember: () => void;
  // Age gate
  ageVerified: boolean;
  setAgeVerified: (verified: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
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
      // Auth
      isMemberLoggedIn: false,
      member: null,
      loginMember: (member) => set({ isMemberLoggedIn: true, member }),
      logoutMember: () => set({ isMemberLoggedIn: false, member: null, currentPage: 'home' }),
      // Age gate
      ageVerified: false,
      setAgeVerified: (verified) => set({ ageVerified: verified }),
    }),
    {
      name: 'serenity-touch-storage',
      partialize: (state) => ({
        isMemberLoggedIn: state.isMemberLoggedIn,
        member: state.member,
        ageVerified: state.ageVerified,
      }),
    }
  )
);