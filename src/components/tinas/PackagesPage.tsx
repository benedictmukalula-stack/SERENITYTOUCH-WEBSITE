'use client';

import { motion } from 'framer-motion';
import { Clock, Sparkles, Crown } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const packages = [
  { name: 'Serenity Signature', duration: '90 min', price: 'K1,500', desc: 'Our signature full-body experience combining Swedish massage with aromatherapy. Includes a warm oil scalp treatment and complimentary herbal tea.', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80', popular: false },
  { name: 'Serenity Escape', duration: '2 hours', price: 'K2,200', desc: 'A two-hour journey of pure relaxation. Deep tissue massage followed by a hot stone session and finishing with a rejuvenating facial treatment.', img: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80', popular: true },
  { name: 'Thai Wellness Journey', duration: '2 hours', price: 'K2,500', desc: 'Traditional Thai massage combined with reflexology and stretching. An authentic wellness journey that restores balance and energy.', img: 'https://images.unsplash.com/photo-1517602436811-4ed606917e01?w=600&q=80', popular: false },
  { name: 'Ultimate Relaxation', duration: '3 hours', price: 'K3,500', desc: 'The ultimate half-day retreat. Full body massage, hot stone therapy, aromatherapy, facial treatment, and a complimentary lunch with herbal refreshments.', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80', popular: false },
  { name: 'Couples Retreat', duration: '2.5 hours', price: 'K4,000', desc: 'A shared wellness experience for two in our private couples suite. Side-by-side massages, aromatherapy, and a champagne toast to complete your escape.', img: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=600&q=80', popular: false },
  { name: 'Serenity Royal Experience', duration: '4 hours', price: 'K6,000', desc: 'Our flagship offering. A full-day royal treatment: private suite, personal therapist, four treatment modalities, gourmet lunch, unlimited refreshments, and a takeaway wellness kit.', img: 'https://images.unsplash.com/photo-1611073615830-4ebed33c0e5b?w=600&q=80', popular: true, flagship: true },
];

export default function PackagesPage() {
  const { navigate } = useAppStore();

  return (
    <div>
      <section className="pt-32 pb-16 section-dark">
        <div className="container-tinas text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display">SIGNATURE PACKAGES</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">Curated <span className="text-gradient-sexy">Wellness</span> Journeys</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-pink-glow/40 max-w-2xl mx-auto body-serif font-light">Multi-treatment experiences designed to transport you into deep, restorative relaxation. Each package is a carefully composed treatment.</motion.p>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {packages.map((pkg, idx) => (
              <motion.div key={pkg.name} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={idx}>
                <div className={`group surface-raised rounded-2xl overflow-hidden transition-all duration-500 hover:border-pink-brand/30 relative ${pkg.flagship ? 'border-gold/30 glow-gold' : pkg.popular ? 'border-pink-brand/15 glow-pink' : ''}`}>
                  {(pkg.popular || pkg.flagship) && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`${pkg.flagship ? 'badge-sexy' : 'bg-gradient-to-r from-gold to-pink-brand text-black'} px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider shadow-lg shadow-pink-brand/20`}>
                        {pkg.flagship ? 'FLAGSHIP EXPERIENCE' : 'MOST POPULAR'}
                      </span>
                    </div>
                  )}
                  <div className="h-56 relative overflow-hidden">
                    <img src={pkg.img} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0508] via-[#0a0508]/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-5">
                      <div className="flex items-center gap-2 text-xs text-gold/50">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{pkg.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <h3 className="text-xl md:text-2xl font-bold heading-display">{pkg.name}</h3>
                      <span className="text-2xl md:text-3xl font-bold text-gradient-gold shrink-0">{pkg.price}</span>
                    </div>
                    <p className="text-pink-glow/35 mb-6 text-sm body-serif font-light leading-relaxed">{pkg.desc}</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gold/8">
                      <button onClick={() => navigate('contact')}
                        className={`flex-1 py-3 text-sm font-semibold cursor-pointer transition-all rounded-full ${pkg.flagship ? 'bg-gradient-to-r from-gold to-pink-brand text-black hover:shadow-lg hover:shadow-gold/20' : 'btn-pink'}`}>
                        Book Package
                      </button>
                      {pkg.flagship && (
                        <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                          <Crown className="w-5 h-5 text-gold" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-center mb-8 heading-display">Package <span className="text-pink-brand">Perks</span></motion.h2>
            <motion.div variants={fadeUp} custom={1} className="surface-raised rounded-2xl p-8 md:p-10">
              <p className="text-pink-glow/35 mb-8 body-serif font-light leading-relaxed">Every package includes exclusive amenities to enhance your experience:</p>
              <div className="space-y-4">
                {[
                  { title: 'Complimentary Welcome Tea', desc: 'A selection of herbal teas prepared fresh upon your arrival' },
                  { title: 'Aromatherapy Lounge Access', desc: 'Relax before and after your treatment in our scented lounge' },
                  { title: 'Member Discount Applies', desc: 'Active members receive their tier discount on all packages' },
                  { title: 'Flexible Scheduling', desc: 'Reschedule up to 24 hours before at no additional cost' },
                  { title: 'Gift Wrapping Available', desc: 'All packages can be gifted — ask about our luxury gift presentation' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0 mt-0.5"><Sparkles className="w-3.5 h-3.5 text-gold" /></div>
                    <div><p className="font-semibold text-sm text-white">{item.title}</p><p className="text-sm text-pink-glow/35 body-serif font-light">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding gradient-sexy">
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">Ready for your <span className="text-gradient-sexy">journey</span>?</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto body-serif text-pink-glow/40 leading-relaxed font-light">Select your package and let us compose a wellness experience that will stay with you long after you leave.</motion.p>
          <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} onClick={() => navigate('contact')} className="btn-pink px-8 py-3.5 text-sm font-semibold cursor-pointer">Book a Package</motion.button>
        </div>
      </section>
    </div>
  );
}