'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Navigation from '@/components/tinas/Navigation';
import Footer from '@/components/tinas/Footer';
import HomePage from '@/components/tinas/HomePage';
import ServicesPage from '@/components/tinas/ServicesPage';
import TherapistsPage from '@/components/tinas/TherapistsPage';
import AboutPage from '@/components/tinas/AboutPage';
import BlogPage from '@/components/tinas/BlogPage';
import ContactPage from '@/components/tinas/ContactPage';
import MembershipPage from '@/components/tinas/MembershipPage';
import WhatsAppButton from '@/components/tinas/WhatsAppButton';
import { useAppStore } from '@/lib/store';

const pageComponents: Record<string, React.ComponentType> = {
  home: HomePage,
  services: ServicesPage,
  therapists: TherapistsPage,
  about: AboutPage,
  blog: BlogPage,
  contact: ContactPage,
  membership: MembershipPage,
};

export default function AppPage() {
  const { currentPage } = useAppStore();
  const PageComponent = pageComponents[currentPage] || HomePage;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <Navigation />
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
    </div>
  );
}