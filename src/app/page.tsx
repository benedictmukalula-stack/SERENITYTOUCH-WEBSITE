'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Navigation from '@/components/tinas/Navigation';
import Footer from '@/components/tinas/Footer';
import HomePage from '@/components/tinas/HomePage';
import ServicesPage from '@/components/tinas/ServicesPage';
import PackagesPage from '@/components/tinas/PackagesPage';
import CorporatePage from '@/components/tinas/CorporatePage';
import VouchersPage from '@/components/tinas/VouchersPage';
import GalleryPage from '@/components/tinas/GalleryPage';
import TestimonialsPage from '@/components/tinas/TestimonialsPage';
import TherapistsPage from '@/components/tinas/TherapistsPage';
import AboutPage from '@/components/tinas/AboutPage';
import BlogPage from '@/components/tinas/BlogPage';
import ContactPage from '@/components/tinas/ContactPage';
import MembershipPage from '@/components/tinas/MembershipPage';
import LoginPage from '@/components/tinas/LoginPage';
import MemberRegistration from '@/components/tinas/MemberRegistration';
import MemberDashboard from '@/components/tinas/MemberDashboard';
import AnalyticsDashboard from '@/components/tinas/AnalyticsDashboard';
import AgeGate from '@/components/tinas/AgeGate';
import WhatsAppButton from '@/components/tinas/WhatsAppButton';
import BackToTop from '@/components/tinas/BackToTop';
import PromoBanner from '@/components/tinas/PromoBanner';
import NewsletterPopup from '@/components/tinas/NewsletterPopup';
import MultilingualToggle from '@/components/tinas/MultilingualToggle';
import { useAppStore } from '@/lib/store';

const pageComponents: Record<string, React.ComponentType> = {
  home: HomePage,
  services: ServicesPage,
  packages: PackagesPage,
  corporate: CorporatePage,
  vouchers: VouchersPage,
  gallery: GalleryPage,
  testimonials: TestimonialsPage,
  therapists: TherapistsPage,
  about: AboutPage,
  blog: BlogPage,
  contact: ContactPage,
  membership: MembershipPage,
  login: LoginPage,
  register: MemberRegistration,
  dashboard: MemberDashboard,
  analytics: AnalyticsDashboard,
};

export default function AppPage() {
  const { currentPage, ageVerified } = useAppStore();
  const PageComponent = pageComponents[currentPage] || HomePage;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#000000' }}>
      {/* R18 Age Gate */}
      <AgeGate />

      {/* Main App */}
      <Navigation />
      <PromoBanner />
      <MultilingualToggle />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <PageComponent />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <NewsletterPopup />
    </div>
  );
}