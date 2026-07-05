'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import ImageLightbox from '@/components/tinas/ImageLightbox';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const categories = ['All', 'Spa Interiors', 'Treatment Rooms', 'Products', 'Our Space'];

const images = [
  { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80', category: 'Spa Interiors', alt: 'Spa treatment room with warm ambient lighting' },
  { src: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80', category: 'Treatment Rooms', alt: 'Massage table with soft linens and candles' },
  { src: 'https://images.unsplash.com/photo-1517602436811-4ed606917e01?w=600&q=80', category: 'Treatment Rooms', alt: 'Hot stone therapy setup with heated stones' },
  { src: 'https://images.unsplash.com/photo-1611073615830-4ebed33c0e5b?w=600&q=80', category: 'Products', alt: 'Essential oils and aromatherapy products' },
  { src: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=600&q=80', category: 'Our Space', alt: 'Couples massage suite with ambient lighting' },
  { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80', category: 'Spa Interiors', alt: 'Spa reception and relaxation area' },
  { src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80', category: 'Spa Interiors', alt: 'Treatment room with calming decor' },
  { src: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80', category: 'Products', alt: 'Natural spa products and botanical ingredients' },
  { src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80', category: 'Our Space', alt: 'Outdoor relaxation garden area' },
  { src: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=600&q=80', category: 'Our Space', alt: 'Wellness spa entrance and welcome area' },
  { src: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&q=80', category: 'Treatment Rooms', alt: 'Luxury treatment room with modern amenities' },
  { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', category: 'Products', alt: 'Premium skincare and massage oils' },
];

export default function GalleryPage() {
  const { navigate } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = activeCategory === 'All' ? images : images.filter((img) => img.category === activeCategory);

  return (
    <div>
      <section className="pt-32 pb-16 section-dark">
        <div className="container-tinas text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display">VISUAL JOURNEY</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">Our <span className="text-gradient-sexy">Gallery</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-pink-glow/40 max-w-2xl mx-auto body-serif font-light">A glimpse into the spa. Every space is designed to envelop you in tranquility and luxury.</motion.p>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas">
          <div className="flex justify-center gap-3 mb-14 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeCategory === cat ? 'bg-gold text-black font-semibold' : 'bg-gold/8 text-pink-glow/35 hover:bg-white/10 border border-gold/12'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {filteredImages.map((img, idx) => (
              <motion.div key={img.src} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={idx}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => setLightboxIndex(idx)}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0508]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Camera className="w-3.5 h-3.5 text-gold" />
                    <span className="text-[10px] font-semibold text-gold/70 uppercase tracking-wider">{img.category}</span>
                  </div>
                  <p className="text-sm text-white/80 body-serif font-light">{img.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-20">
              <Camera className="w-12 h-12 text-gold/20 mx-auto mb-4" />
              <p className="text-pink-glow/35 body-serif font-light">No images in this category yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={filteredImages.map(img => ({ src: img.src.replace('w=600', 'w=1200'), alt: img.alt }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <section className="section-padding section-dark">
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">Experience It <span className="text-pink-brand">In Person</span></motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto body-serif font-light text-pink-glow/35 leading-relaxed">Photos only tell half the story. Visit our spa and feel the difference.</motion.p>
          <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} onClick={() => navigate('contact')} className="btn-outline-pink px-8 py-3.5 text-sm font-semibold cursor-pointer">Book a Visit</motion.button>
        </div>
      </section>
    </div>
  );
}