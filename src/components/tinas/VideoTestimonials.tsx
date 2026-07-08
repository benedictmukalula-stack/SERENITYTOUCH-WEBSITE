'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Clock, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const videoTestimonials = [
  {
    name: 'Chipo Mwale',
    treatment: 'Deep Tissue Massage',
    quote: 'Life-changing experience',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
    duration: '2:34',
  },
  {
    name: 'Grace Banda',
    treatment: 'Aromatherapy',
    quote: 'The oils were divine',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
    duration: '1:58',
  },
  {
    name: 'Bwalya Nkomo',
    treatment: 'Thai Massage',
    quote: 'Best massage in Zambia',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80',
    duration: '3:12',
  },
];

export default function VideoTestimonials() {
  const { navigate } = useAppStore();
  const [activeModal, setActiveModal] = useState<number | null>(null);

  return (
    <div>
      {/* Header */}
      <section className="pt-32 pb-16 section-dark">
        <div className="container-tinas text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display"
          >
            VIDEO STORIES
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display"
          >
            Hear Their <span className="text-gradient-sexy">Voices</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-pink-glow/40 max-w-2xl mx-auto body-serif font-light"
          >
            Watch real guests share their Serenity Touch Spa stories in their own words.
          </motion.p>
        </div>
      </section>

      {/* Video Grid */}
      <section className="section-padding surface-base">
        <div className="container-tinas">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {videoTestimonials.map((item, idx) => (
              <motion.div
                key={item.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                custom={idx}
                className="group"
              >
                <div className="surface-raised rounded-2xl overflow-hidden hover-lift">
                  {/* Video thumbnail */}
                  <div
                    className="relative aspect-video overflow-hidden cursor-pointer"
                    onClick={() => setActiveModal(idx)}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Duration badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-gold/15">
                      <Clock className="w-3 h-3 text-gold/60" />
                      <span className="text-[10px] text-gold-light font-medium">
                        {item.duration}
                      </span>
                    </div>

                    {/* Play overlay */}
                    <div className="video-overlay" style={{ opacity: 1 }}>
                      <div className="video-play-btn">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>

                    {/* Guest info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-white font-bold text-sm heading-display mb-0.5 text-shadow-sexy">
                        {item.name}
                      </p>
                      <p className="text-pink-glow/70 text-xs body-serif font-light italic text-shadow-sexy">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="p-5 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-pink-brand/60 uppercase tracking-wider border border-pink-brand/15 px-3 py-1 rounded-full">
                      {item.treatment}
                    </span>
                    <button
                      onClick={() => setActiveModal(idx)}
                      className="text-gold/50 hover:text-gold transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    >
                      Watch
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-sexy">
        <div className="container-tinas text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold mb-4 heading-display"
          >
            Ready to Create Your <span className="text-gradient-sexy">Story?</span>
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-pink-glow/40 mb-8 max-w-xl mx-auto body-serif font-light"
          >
            Book your session today and become our next guest to share their experience.
          </motion.p>
          <motion.button
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            onClick={() => navigate('contact')}
            className="btn-pink px-8 py-3.5 text-sm font-semibold cursor-pointer"
          >
            Book Your Session
          </motion.button>
        </div>
      </section>

      {/* "Video Coming Soon" Modal */}
      <AnimatePresence>
        {activeModal !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="surface-raised rounded-2xl p-8 md:p-10 max-w-md w-full text-center relative"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gold/[0.06] border border-gold/15 flex items-center justify-center text-gold/50 hover:text-gold hover:bg-gold/[0.1] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-brand/20 to-gold/10 border border-gold/15 flex items-center justify-center mx-auto mb-6">
                <Play className="w-7 h-7 text-pink-brand ml-1" />
              </div>

              <h3 className="text-xl font-bold heading-display mb-2">
                Video Coming Soon
              </h3>
              <p className="text-pink-glow/40 text-sm body-serif font-light mb-6 leading-relaxed">
                We&apos;re capturing the perfect moments with our guests. Check back soon to watch{' '}
                <span className="text-gold-light font-medium">
                  {videoTestimonials[activeModal].name}
                </span>
                &apos;s full testimonial about their{' '}
                <span className="text-gold-light font-medium">
                  {videoTestimonials[activeModal].treatment}
                </span>{' '}
                experience.
              </p>

              <div className="divider-sexy mb-6" />

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="btn-outline-gold px-5 py-2 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    navigate('contact');
                  }}
                  className="btn-pink px-5 py-2 text-xs font-semibold cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}