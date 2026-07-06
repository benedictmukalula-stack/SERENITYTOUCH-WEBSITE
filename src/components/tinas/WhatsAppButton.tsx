'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 rounded-2xl shadow-2xl p-5 w-72" style={{ background: 'linear-gradient(145deg, #0a0508, #100a0e)', border: '1px solid rgba(212, 175, 55, 0.15)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm heading-display text-white">Serenity Touch Spa</p>
                <p className="text-[11px] text-green-400">Online now</p>
              </div>
            </div>
            <p className="text-sm text-pink-glow/35 body-serif mb-4">
              Chat with us on WhatsApp or call directly to book your treatment.
            </p>
            <a
              href="https://wa.me/260761404555?text=Hello%20Serenity%20Touch%20Spa!%20I'd%20like%20to%20learn%20more%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2.5 rounded-xl text-sm font-semibold transition"
            >
              Open WhatsApp
            </a>
            <a
              href="tel:+260572782539"
              className="block w-full border border-gold/15 text-gold text-center py-2.5 rounded-xl text-sm font-semibold hover:bg-gold/10 transition mt-2"
            >
              Call +260 572 782 539
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer ${
          isOpen ? 'bg-gold/10 hover:bg-gold/15 border border-gold/20' : 'bg-green-500 hover:bg-green-600'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open WhatsApp chat'}
      >
        {isOpen ? <X className="w-6 h-6 text-pink-brand" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </motion.button>
    </div>
  );
}