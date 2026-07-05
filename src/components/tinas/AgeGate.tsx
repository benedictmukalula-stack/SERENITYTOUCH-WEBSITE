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
        style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <div className="text-center max-w-md mx-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Logo */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-pink-brand flex items-center justify-center text-[#0a0a0a] font-bold text-xl heading-display mx-auto mb-6">
              TS
            </div>

            <h1 className="text-3xl md:text-4xl font-bold heading-display mb-3">
              Tina&apos;s Sanctuary
            </h1>
            <p className="text-[11px] tracking-[0.2em] text-gray-500 mb-8 heading-display">
              EXCLUSIVE WELLNESS SANCTUARY
            </p>

            <div className="surface-raised rounded-2xl p-8 mb-6">
              <div className="w-12 h-12 rounded-full bg-pink-brand/10 border border-pink-brand/30 flex items-center justify-center mx-auto mb-5">
                <span className="text-pink-brand text-xl font-bold">18</span>
              </div>
              <h2 className="text-xl font-bold heading-display mb-3">Age Verification Required</h2>
              <p className="text-gray-400 text-sm body-serif leading-relaxed mb-8">
                This website contains information about wellness services available exclusively to adults aged 18 and older. By entering, you confirm that you are at least 18 years of age.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setAgeVerified(true)}
                  className="w-full btn-pink py-3.5 text-sm font-semibold cursor-pointer"
                >
                  I am 18 or older — Enter Sanctuary
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = 'https://www.google.com';
                    }
                  }}
                  className="w-full btn-outline-white py-3 text-sm font-medium cursor-pointer"
                >
                  I am under 18 — Exit
                </button>
              </div>
            </div>

            <p className="text-[10px] text-gray-600 leading-relaxed">
              R18 &middot; Tina&apos;s Sanctuary is a wellness facility. All services require clients to be 18 years or older.
              By proceeding, you agree to our terms of service and privacy policy.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}