'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import ComparisonTable from '@/components/tinas/ComparisonTable';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' },
  }),
};

const services = [
  { id: 1, name: 'Head & Scalp Massage', duration: '30 min', price: 'K400', description: 'A deeply relaxing treatment focusing on the scalp, neck, and shoulders. Ideal for relieving tension headaches and promoting mental clarity.', benefits: ['Stress relief', 'Improved circulation', 'Hair health', 'Mental clarity'], image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&q=80' },
  { id: 2, name: 'Foot Massage', duration: '45 min', price: 'K500', description: 'Therapeutic foot massage targeting pressure points to relieve fatigue, improve circulation, and promote whole-body wellness.', benefits: ['Pain relief', 'Improved circulation', 'Stress reduction', 'Better sleep'], image: 'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=600&q=80' },
  { id: 3, name: 'Back, Neck & Shoulder', duration: '45 min', price: 'K600', description: 'Focused therapeutic massage targeting the areas most affected by modern life. Perfect for desk workers and those with upper body tension.', benefits: ['Tension release', 'Improved posture', 'Pain relief', 'Increased mobility'], image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80' },
  { id: 4, name: 'Swedish Massage', duration: '60 min', price: 'K800', description: 'Classic full-body massage using long, flowing strokes to promote relaxation and improve circulation. Perfect for first-time visitors.', benefits: ['Improved circulation', 'Reduced muscle tension', 'Enhanced relaxation', 'Better sleep quality'], image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80' },
  { id: 5, name: 'Deep Tissue Massage', duration: '90 min', price: 'K1,200', description: 'Intensive massage targeting deep muscle layers to relieve tension and chronic pain. Ideal for persistent muscle tightness or athletic recovery.', benefits: ['Chronic pain relief', 'Improved mobility', 'Muscle recovery', 'Tension release'], image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80' },
  { id: 6, name: 'Thai Massage', duration: '90 min', price: 'K1,100', description: 'Traditional Thai massage combining stretching, acupressure, and rhythmic compression to restore balance, flexibility, and energy flow.', benefits: ['Improved flexibility', 'Energy balance', 'Stress relief', 'Joint mobility'], image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
  { id: 7, name: 'Aromatherapy Massage', duration: '60 min', price: 'K900', description: 'Personalised aromatherapy session using locally-sourced essential oils blended in-house. Tailored to your mood, season, and wellness goals.', benefits: ['Emotional balance', 'Mental clarity', 'Stress reduction', 'Holistic wellness'], image: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=600&q=80' },
  { id: 8, name: 'Reflexology', duration: '60 min', price: 'K850', description: 'Ancient healing practice targeting reflex points on feet and hands to promote whole-body wellness and natural balance.', benefits: ['Energy balance', 'Improved circulation', 'Stress relief', 'Holistic healing'], image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80' },
  { id: 9, name: 'Pregnancy Massage', duration: '60 min', price: 'K900', description: 'Gentle, nurturing massage specially designed for expectant mothers. Eases pregnancy-related aches and promotes deep relaxation.', benefits: ['Back pain relief', 'Reduced swelling', 'Better sleep', 'Emotional wellbeing'], image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80' },
  { id: 10, name: 'Full Body Massage', duration: '90 min', price: 'K1,000', description: 'Comprehensive full-body treatment combining multiple techniques for head-to-toe relaxation. Our most popular therapeutic experience.', benefits: ['Total relaxation', 'Muscle recovery', 'Improved circulation', 'Stress elimination'], image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&q=80' },
  { id: 11, name: 'Couples Massage', duration: '90 min', price: 'K2,000', description: 'Synchronised massage experience for two in our private couples suite. Share a moment of relaxation and connection.', benefits: ['Shared wellness', 'Quality time', 'Synchronised relaxation', 'Intimate experience'], image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80' },
];

export default function ServicesPage() {
  const { navigate } = useAppStore();

  return (
    <div>
      <section className="pt-32 pb-16" style={{ background: '#030102' }}>
        <div className="container-tinas text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">Massage <span className="text-pink-brand">Therapies</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-pink-glow/35 font-light max-w-2xl mx-auto body-serif">
            Relax • Restore • Rejuvenate. Every treatment is designed for you — from the oils blended in-house to the temperature of the linen.
          </motion.p>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, idx) => (
              <motion.div key={service.id} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={idx}>
                <div className="group surface-raised rounded-2xl overflow-hidden hover:border-pink-brand/30 transition-all duration-300 glow-gold">
                  <div className="md:flex">
                    <div className="md:w-2/5 h-52 md:h-auto relative overflow-hidden">
                      <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0508] via-[#0a0508]/50 to-transparent"></div>
                    </div>
                    <div className="p-6 md:p-8 md:w-3/5">
                      <p className="text-[11px] tracking-[0.15em] text-gold/50 mb-2">{service.duration.toUpperCase()}</p>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 heading-display">{service.name}</h3>
                      <p className="text-pink-glow/35 mb-5 text-sm font-light body-serif leading-relaxed">{service.description}</p>
                      <div className="mb-5">
                        <p className="text-[10px] font-semibold text-gold/50 tracking-wider mb-2.5">KEY BENEFITS</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {service.benefits.map((b, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-pink-glow/45">
                              <span className="text-gold text-[10px]">✦</span>
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gold/8">
                        <span className="text-xl md:text-2xl font-bold text-gradient-gold">{service.price}</span>
                        <button onClick={() => navigate('contact')} className="btn-pink px-5 py-2 text-xs cursor-pointer">Book Now</button>
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
        <div className="container-tinas">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
              <p className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display uppercase">Compare</p>
              <h2 className="text-3xl md:text-4xl font-bold heading-display">Find Your Perfect <span className="text-pink-brand">Treatment</span></h2>
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <ComparisonTable />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call-Out Fees Section */}
      <section className="section-padding surface-base">
        <div className="container-tinas max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl md:text-4xl font-bold heading-display">Call-Out <span className="text-pink-brand">Service</span></h2>
            </motion.div>
            <motion.p variants={fadeUp} custom={1} className="text-pink-glow/35 mb-8 font-light body-serif leading-relaxed">Can&apos;t make it to us? We&apos;ll bring the spa experience to your doorstep. Call-out fees are added to your chosen service price.</motion.p>
            <motion.div variants={fadeUp} custom={2} className="surface-raised rounded-2xl overflow-hidden glow-gold">
              {[
                { zone: 'Zone 1 — Ibex Hill & Surrounds', desc: 'Within 5km radius (Ibex Hill, Woodlands, Kabulonga)', fee: 'K200' },
                { zone: 'Zone 2 — Lusaka Central', desc: '5–15km (CBD, Northmead, Rhodes Park, Longacres)', fee: 'K350' },
                { zone: 'Zone 3 — Greater Lusaka', desc: '15–30km (Manda Hill, East Park, Chelstone, Roma)', fee: 'K500' },
                { zone: 'Zone 4 — Outside Lusaka', desc: '30km+ (Kabwe, Chongwe, Kafue, etc.)', fee: 'Custom Quote' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-5 ${i > 0 ? 'border-t border-gold/10' : ''}`}>
                  <div>
                    <p className="text-sm font-bold text-white">{item.zone}</p>
                    <p className="text-xs text-pink-glow/35 mt-1 body-serif font-light">{item.desc}</p>
                  </div>
                  <span className={`text-xl font-bold shrink-0 ${item.fee === 'Custom Quote' ? 'text-pink-brand' : 'text-gradient-gold'}`}>{item.fee}</span>
                </div>
              ))}
              <div className="p-5 border-t border-gold/10 bg-pink-brand/5">
                <p className="text-xs text-pink-glow/50 body-serif font-light leading-relaxed">Call-out fees cover therapist travel and equipment transport. Fees are per visit, not per service. For Zone 4, we&apos;ll provide a custom quote. Book a call-out via our booking form or WhatsApp.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding" style={{ background: '#030102' }}>
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">Ready to book your treatment?</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto font-light body-serif text-pink-glow/35 leading-relaxed">Contact us to reserve your personalised treatment experience.</motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} onClick={() => navigate('contact')} className="btn-pink px-8 py-3.5 text-sm font-semibold cursor-pointer">Book Appointment</motion.button>
            <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3} onClick={() => navigate('packages')} className="btn-outline-gold px-8 py-3.5 text-sm font-semibold cursor-pointer">View Spa Packages</motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}