'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import AnimatedCounter from '@/components/tinas/AnimatedCounter';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const testimonials = [
  { text: "The deep tissue massage at Serenity Touch Spa was exactly what I needed. Professional therapists and a beautiful, calming environment.", author: 'Chipo Mwale', location: 'Lusaka', rating: 5, treatment: 'Deep Tissue Massage' },
  { text: "I've visited spas across Southern Africa and Serenity Touch is truly world-class. The Royal Experience package was unforgettable.", author: 'Bwalya Nkomo', location: 'Kitwe', rating: 5, treatment: 'Serenity Royal Experience' },
  { text: "The aromatherapy session was so relaxing. Patricia really knows her craft. The essential oils were heavenly.", author: 'Grace Banda', location: 'Lusaka', rating: 5, treatment: 'Aromatherapy Massage' },
  { text: "My husband and I had the Couples Retreat and it was the perfect anniversary treat. We'll definitely be back.", author: 'Thandiwe Phiri', location: 'Ndola', rating: 5, treatment: 'Couples Retreat' },
  { text: "The corporate wellness day they organized for our team was exceptional. Professional, calming, and exactly what our stressed employees needed.", author: 'Mwansa Chisenga', location: 'Lusaka', rating: 5, treatment: 'Corporate Wellness' },
  { text: "Great service and beautiful facilities. The hot stone therapy melted all my tension away. Four stars only because I wish the session was longer!", author: 'Joseph Mwanza', location: 'Livingstone', rating: 4, treatment: 'Hot Stone Therapy' },
  { text: "As a Platinum member, the 24/7 concierge service is a game-changer. I can book anytime and the home visit service is fantastic.", author: 'Natasha Simwinga', location: 'Lusaka', rating: 5, treatment: 'Swedish Massage' },
  { text: "The pregnancy massage was so gentle and soothing. Finally found a spa that understands prenatal care. Highly recommend for expecting mothers.", author: 'Chimwemwe Banda', location: 'Lusaka', rating: 5, treatment: 'Pregnancy Massage' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`w-3.5 h-3.5 ${star <= rating ? 'text-gold fill-gold' : 'text-gold/20'}`} />
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const { navigate } = useAppStore();

  return (
    <div>
      <section className="pt-32 pb-16 section-dark">
        <div className="container-tinas text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display">GUEST REVIEWS</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">What Our <span className="text-gradient-sexy">Guests</span> Say</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-pink-glow/40 max-w-2xl mx-auto body-serif font-light">Real experiences from those who&apos;ve discovered the spa. Their words mean more than ours ever could.</motion.p>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {testimonials.map((t, idx) => (
              <motion.div key={t.author} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={idx}>
                <div className="surface-raised rounded-2xl p-7 md:p-8 h-full hover:border-gold/20 transition-all duration-300 relative group">
                  <div className="absolute top-6 right-7 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity">
                    <Quote className="w-12 h-12 text-gold" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <StarRating rating={t.rating} />
                      <span className="text-[10px] font-semibold text-pink-brand/60 uppercase tracking-wider border border-pink-brand/15 px-3 py-1 rounded-full">{t.treatment}</span>
                    </div>
                    <p className="text-pink-glow/50 text-sm md:text-[15px] body-serif font-light leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center justify-between pt-5 border-t border-gold/8">
                      <div>
                        <p className="font-semibold text-sm text-white heading-display">{t.author}</p>
                        <p className="text-xs text-gold/40 mt-0.5 body-serif font-light">{t.location}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-brand/20 to-gold/10 border border-gold/15 flex items-center justify-center">
                        <span className="text-gold text-xs font-bold heading-display">{t.author.charAt(0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display">The <span className="text-pink-brand">Numbers</span> Speak</motion.h2>
            <motion.div variants={fadeUp} custom={1} className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="surface-raised rounded-2xl p-6 text-center">
                <AnimatedCounter value="2,500+" label="Happy Guests" />
              </div>
              <div className="surface-raised rounded-2xl p-6 text-center">
                <AnimatedCounter value="4.9" label="Average Rating" />
              </div>
              <div className="surface-raised rounded-2xl p-6 text-center">
                <AnimatedCounter value="98%" label="Would Return" />
              </div>
              <div className="surface-raised rounded-2xl p-6 text-center">
                <AnimatedCounter value="15,000+" label="Treatments Delivered" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding gradient-sexy">
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">Join Our <span className="text-gradient-sexy">Story</span></motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto body-serif text-pink-glow/40 leading-relaxed font-light">Your transformation awaits. Book your first session and become part of the Serenity Touch experience.</motion.p>
          <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} onClick={() => navigate('contact')} className="btn-pink px-8 py-3.5 text-sm font-semibold cursor-pointer">Book Your Session</motion.button>
        </div>
      </section>
    </div>
  );
}