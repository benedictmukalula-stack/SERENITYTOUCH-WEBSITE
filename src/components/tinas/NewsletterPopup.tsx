'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('st-newsletter-dismissed');
    if (dismissed) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('st-newsletter-dismissed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    sessionStorage.setItem('st-newsletter-dismissed', 'true');
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          onClick={handleDismiss}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="surface-raised relative z-10 w-full max-w-md rounded-2xl p-8"
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              aria-label="Close newsletter popup"
              className="absolute top-4 right-4 text-pink-glow/40 hover:text-gold transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {!submitted ? (
              <>
                {/* Icon */}
                <div
                  className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(233,30,99,0.2), rgba(212,175,55,0.2))',
                    boxShadow: '0 0 20px rgba(212,175,55,0.15)',
                  }}
                >
                  <Mail className="h-6 w-6 text-gold" />
                </div>

                {/* Headline */}
                <h3 className="heading-display text-gradient-sexy text-2xl font-bold text-center mb-2">
                  Unlock 10% Off Your First Visit
                </h3>

                {/* Subtext */}
                <p className="body-serif text-pink-glow/60 text-sm text-center mb-6 leading-relaxed">
                  Join our inner circle for monthly wellness tips, exclusive offers,
                  and first access to new treatments.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full rounded-lg border border-pink-glow/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-pink-glow/30 outline-none transition-all focus:border-gold/40 focus:shadow-[0_0_12px_rgba(212,175,55,0.1)]"
                  />
                  <button type="submit" className="btn-pink w-full rounded-lg py-3 text-sm font-semibold tracking-wide">
                    Subscribe & Save
                  </button>
                </form>

                <p className="text-[11px] text-pink-glow/25 text-center mt-4">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6"
              >
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(233,30,99,0.2))',
                    boxShadow: '0 0 24px rgba(212,175,55,0.2)',
                  }}
                >
                  <Mail className="h-6 w-6 text-gold" />
                </div>
                <h3 className="heading-display text-gradient-gold text-xl font-bold mb-2">
                  Welcome! Check your inbox.
                </h3>
                <p className="body-serif text-pink-glow/50 text-sm">
                  Your 10% discount code is on its way.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}