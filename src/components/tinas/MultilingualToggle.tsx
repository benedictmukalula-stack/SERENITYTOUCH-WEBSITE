'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

type Lang = 'en' | 'ny';

const nyanjaPhrases = [
  { en: 'Welcome to Serenity Touch Spa', ny: 'Karibu ku Serenity Touch Spa' },
  { en: 'Thank you', ny: 'Zikomo' },
  { en: 'Good / Well', ny: 'Bwino' },
];

export default function MultilingualToggle() {
  const [lang, setLang] = useState<Lang>('en');
  const [showPhrases, setShowPhrases] = useState(false);

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col items-end gap-2">
      <span className="text-[9px] tracking-[0.2em] text-gold/40 uppercase font-medium mr-1">
        Language
      </span>

      <motion.div
        layout
        className="flex items-center rounded-full border border-gold/20 bg-black/80 backdrop-blur-md overflow-hidden"
      >
        {(['en', 'ny'] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => {
              setLang(l);
              if (l === 'ny') setShowPhrases(true);
              else setShowPhrases(false);
            }}
            className="relative px-3.5 py-1.5 text-xs font-semibold tracking-wider cursor-pointer transition-colors duration-300"
          >
            {lang === l && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-brand to-pink-deep z-0"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 ${
                lang === l ? 'text-white' : 'text-gold/50 hover:text-gold/80'
              } transition-colors`}
            >
              {l === 'en' ? 'EN' : 'NY'}
            </span>
          </button>
        ))}

        <span className="px-2 text-gold/30">
          <Globe className="w-3.5 h-3.5" />
        </span>
      </motion.div>

      <AnimatePresence>
        {showPhrases && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass-card rounded-xl p-4 min-w-[220px] max-w-[260px] border border-gold/15"
          >
            <p className="text-[10px] tracking-[0.15em] text-pink-brand/70 uppercase font-semibold mb-3 heading-display">
              Nyanja Preview
            </p>
            <div className="space-y-2.5">
              {nyanjaPhrases.map((phrase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <p className="text-sm text-gold-light font-medium body-serif">
                    {phrase.ny}
                  </p>
                  <p className="text-[11px] text-pink-glow/35 font-light">
                    {phrase.en}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}