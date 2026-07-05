'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAppStore, type Page } from '@/lib/store';

const navItems: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Services', page: 'services' },
  { label: 'Therapists', page: 'therapists' },
  { label: 'Journal', page: 'blog' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
];

export default function Navigation() {
  const { currentPage, navigate, isMobileMenuOpen, setMobileMenuOpen } = useAppStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gold/20" style={{ background: 'rgba(10, 10, 10, 0.7)', backdropFilter: 'blur(16px)' }}>
      <div className="container-tinas flex items-center justify-between h-16 md:h-[72px]">
        {/* Logo */}
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-pink-brand flex items-center justify-center text-[#0a0a0a] font-bold text-sm heading-display">
            TS
          </div>
          <span className="text-lg font-bold text-white heading-display tracking-tight group-hover:text-gold transition-colors">
            Tina&apos;s Sanctuary
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`text-[13px] tracking-wide transition-colors cursor-pointer ${
                currentPage === item.page
                  ? 'text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => navigate('membership')}
            className="text-[13px] bg-pink-brand text-white border-0 hover:bg-pink-600 rounded-full px-5 py-2 font-semibold cursor-pointer transition-all"
          >
            Become a Member
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 cursor-pointer"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gold/15 overflow-hidden"
            style={{ background: 'rgba(10, 10, 10, 0.95)' }}
          >
            <div className="container-tinas py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    navigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-sm transition-colors cursor-pointer ${
                    currentPage === item.page
                      ? 'bg-white/5 text-white font-semibold'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  navigate('membership');
                  setMobileMenuOpen(false);
                }}
                className="block w-full mt-2 bg-pink-brand text-white rounded-full py-3 text-sm font-semibold text-center cursor-pointer"
              >
                Become a Member
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}