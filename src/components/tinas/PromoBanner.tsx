'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function PromoBanner() {
  const [visible, setVisible] = useState(false);
  const navigate = useAppStore((s) => s.navigate);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('st-promo-dismissed');
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('st-promo-dismissed', 'true');
  };

  const handleCta = () => {
    navigate('contact');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, rgba(212,175,55,0.08), rgba(233,30,99,0.06))',
            borderBottom: '1px solid rgba(212,175,55,0.12)',
          }}
        >
          <div className="container-tinas flex items-center justify-center gap-4 py-2.5 px-4">
            <p className="heading-display text-sm md:text-base text-pink-glow/70 text-center flex items-center flex-wrap justify-center gap-2">
              <span className="text-gold/80">🌿 July Wellness Special</span>
              <span className="hidden sm:inline text-pink-glow/40">—</span>
              <span>
                20% off all treatments this month. Use code{' '}
                <span className="text-gold font-semibold tracking-wide">WELLNESS20</span>
              </span>
            </p>
            <button
              onClick={handleCta}
              className="btn-outline-gold text-xs px-3 py-1 rounded-full shrink-0 transition-all hover:shadow-[0_0_12px_rgba(212,175,55,0.3)]"
            >
              Book Now
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss promotion"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-glow/40 hover:text-gold transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}