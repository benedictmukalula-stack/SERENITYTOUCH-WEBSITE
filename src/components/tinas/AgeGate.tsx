'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';

export default function AgeGate() {
  const { ageVerified, setAgeVerified } = useAppStore();

  if (ageVerified) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(24px)' }}
      >
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(233,30,99,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)' }} />

        <div className="text-center max-w-md mx-4 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Logo */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-black font-bold text-xl heading-display mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #E91E63 100%)' }}>
              ST
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold heading-display mb-3 text-white">
              Serenity Touch Spa
            </h1>
            <p className="text-[11px] tracking-[0.2em] text-gold/40 mb-8 heading-display uppercase">
              Premium Wellness Spa
            </p>

            <div className="surface-raised rounded-2xl p-8 mb-6">
              <div className="w-12 h-12 rounded-full bg-pink-brand/10 border border-pink-brand/25 flex items-center justify-center mx-auto mb-5">
                <span className="text-pink-brand text-xl font-bold">18</span>
              </div>
              <h2 className="text-xl font-semibold heading-display mb-3 text-white">Age Verification Required</h2>
              <p className="text-pink-glow/35 text-sm body-serif leading-relaxed mb-8 font-light">
                This website contains information about wellness services available exclusively to adults aged 18 and older. By entering, you confirm that you are at least 18 years of age.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setAgeVerified(true)}
                  className="w-full btn-pink py-3.5 text-sm font-semibold cursor-pointer"
                >
                  I am 18 or older — Enter Spa
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = 'https://www.google.com';
                    }
                  }}
                  className="w-full btn-outline-gold py-3 text-sm font-medium cursor-pointer"
                >
                  I am under 18 — Exit
                </button>
              </div>
            </div>

            <p className="text-[10px] text-gold/30 leading-relaxed">
              R18 &middot; Serenity Touch Spa is a wellness facility. All services require clients to be 18 years or older.
              By proceeding, you agree to our terms of service and privacy policy.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}