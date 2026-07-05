'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogIn } from 'lucide-react';
import Breadcrumbs from '@/components/tinas/Breadcrumbs';
import { useAppStore, type Page } from '@/lib/store';

const navItems: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Treatments', page: 'services' },
  { label: 'Packages', page: 'packages' },
  { label: 'Membership', page: 'membership' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
];

export default function Navigation() {
  const { currentPage, navigate, isMobileMenuOpen, setMobileMenuOpen, isMemberLoggedIn, member } = useAppStore();

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(24px) saturate(180%)', borderBottom: '1px solid rgba(212, 175, 55, 0.08)' }}>
      <div className="container-tinas flex items-center justify-between h-16 md:h-[72px]">
        {/* Logo */}
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-black font-bold text-sm heading-display" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #E91E63 100%)' }}>ST</div>
          <span className="text-lg font-semibold text-white heading-display tracking-tight group-hover:text-gold transition-colors">
            Serenity Touch Spa
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`text-[13px] tracking-wide transition-colors cursor-pointer ${
                currentPage === item.page
                  ? 'text-gold font-semibold'
                  : 'text-pink-glow/35 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-3">
          {isMemberLoggedIn && member ? (
            <>
              <button
                onClick={() => navigate('dashboard')}
                className={`flex items-center gap-2 text-[12px] font-medium px-3 py-1.5 rounded-full border cursor-pointer transition ${
                  currentPage === 'dashboard'
                    ? 'border-gold/30 bg-gold/10 text-gold'
                    : 'border-gold/15 text-pink-glow/45 hover:text-white hover:border-gold/30'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{member.name.split(' ')[0]}</span>
                <span className="text-[10px] text-pink-brand">({member.tier})</span>
              </button>
              <button
                onClick={() => navigate('membership')}
                className="text-[12px] text-black border-0 rounded-full px-4 py-2 font-semibold cursor-pointer transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #E91E63 100%)' }}
              >
                {member.tier} Member
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('login')}
                className="flex items-center gap-1.5 text-[12px] text-pink-glow/45 hover:text-white transition cursor-pointer px-3 py-1.5 rounded-full border border-gold/15 hover:border-gold/30"
              >
                <LogIn className="w-3.5 h-3.5" />
                Member Login
              </button>
              <button
                onClick={() => navigate('membership')}
                className="text-[12px] text-black border-0 rounded-full px-4 py-2 font-semibold cursor-pointer transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8960B 100%)' }}
              >
                Become a Member
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-gold/50 cursor-pointer"
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
            className="lg:hidden overflow-hidden"
            style={{ background: 'rgba(0, 0, 0, 0.95)', borderBottom: '1px solid rgba(212, 175, 55, 0.08)' }}
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
                      ? 'bg-gold/10 text-gold font-semibold'
                      : 'text-pink-glow/35 hover:bg-gold/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-gold/8 pt-3 mt-3 space-y-2">
                {isMemberLoggedIn && member ? (
                  <button
                    onClick={() => { navigate('dashboard'); setMobileMenuOpen(false); }}
                    className="block w-full px-4 py-3 rounded-lg text-sm bg-gold/10 text-gold font-semibold cursor-pointer"
                  >
                    Dashboard — {member.name.split(' ')[0]} ({member.tier})
                  </button>
                ) : (
                  <button
                    onClick={() => { navigate('login'); setMobileMenuOpen(false); }}
                    className="block w-full px-4 py-3 rounded-lg text-sm text-pink-glow/35 hover:bg-gold/5 cursor-pointer"
                  >
                    Member Login
                  </button>
                )}
                <button
                  onClick={() => { navigate('membership'); setMobileMenuOpen(false); }}
                  className="block w-full mt-2 text-black rounded-full py-3 text-sm font-semibold text-center cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8960B 100%)' }}
                >
                  Become a Member
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    {currentPage !== 'home' && (
      <div className="pt-[72px] md:pt-[80px] section-dark border-b border-gold/8">
        <div className="container-tinas py-3">
          <Breadcrumbs items={[
            { label: 'Home', page: 'home' },
            { label: currentPage === 'services' ? 'Treatments' : currentPage === 'packages' ? 'Packages' : currentPage === 'membership' ? 'Membership' : currentPage === 'corporate' ? 'Corporate Wellness' : currentPage === 'vouchers' ? 'Gift Vouchers' : currentPage === 'gallery' ? 'Gallery' : currentPage === 'testimonials' ? 'Testimonials' : currentPage === 'blog' ? 'Wellness Journal' : currentPage === 'about' ? 'About' : currentPage === 'contact' ? 'Contact' : currentPage === 'therapists' ? 'Our Team' : currentPage === 'login' ? 'Login' : currentPage === 'register' ? 'Register' : currentPage === 'dashboard' ? 'Dashboard' : currentPage === 'analytics' ? 'Analytics' : currentPage.charAt(0).toUpperCase() + currentPage.slice(1) }
          ]} />
        </div>
      </div>
    )}
    </>
  );
}