'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const therapists = [
  { id: 1, name: 'Taonga Phiri', title: 'Founder & Lead Therapist', specialties: ['Swedish Massage', 'Deep Tissue', 'Aromatherapy'], certification: 'International Spa & Wellness Association (ISWA)', experience: '15+ years', bio: 'Taonga founded Serenity Touch Spa with a vision to bring world-class wellness to Lusaka. Her holistic approach combines traditional techniques with modern therapeutic practices, creating a sanctuary of calm in the heart of Zambia.', image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80' },
  { id: 2, name: 'Grace Banda', title: 'Senior Massage Therapist', specialties: ['Hot Stone Therapy', 'Reflexology', 'Swedish Massage'], certification: 'National Board of Certification for Therapeutic Massage (NBCTM)', experience: '12+ years', bio: 'Grace brings warmth and intuition to every session. Her expertise in hot stone therapy and reflexology helps guests achieve deep relaxation.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
  { id: 3, name: 'Patricia Nkomo', title: 'Aromatherapy Specialist', specialties: ['Aromatherapy', 'Essential Oil Blending', 'Wellness Consultation'], certification: 'International Federation of Aromatherapists (IFA)', experience: '10+ years', bio: "Patricia's passion for botanical wellness shines through her personalized aromatherapy treatments. She sources and blends our signature oils with care.", image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80' },
  { id: 4, name: 'Chipo Mwale', title: 'Therapeutic Massage Specialist', specialties: ['Deep Tissue', 'Sports Massage', 'Couples Massage'], certification: 'Sports Massage Association (SMA)', experience: '8+ years', bio: 'Chipo specializes in therapeutic and sports massage, helping clients recover from tension and injury. Her strong technique is balanced with genuine care.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
];

export default function TherapistsPage() {
  const { navigate } = useAppStore();

  return (
    <div>
      <section className="pt-32 pb-16 section-dark">
        <div className="container-tinas text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">Meet Our Team</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-pink-glow/35 max-w-2xl mx-auto body-serif font-light">Every therapist at Serenity Touch Spa is internationally certified and continually trained.</motion.p>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {therapists.map((t, idx) => (
              <motion.div key={t.id} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={idx}>
                <div className="group surface-raised rounded-2xl overflow-hidden glow-gold hover:border-gold/30 transition-all duration-300">
                  <div className="md:flex">
                    <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden">
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0508]/80 to-transparent" />
                    </div>
                    <div className="p-6 md:p-8 md:w-3/5">
                      <h3 className="text-xl md:text-2xl font-bold mb-1 heading-display">{t.name}</h3>
                      <p className="text-sm font-semibold text-pink-brand mb-4">{t.title}</p>
                      <p className="text-pink-glow/35 mb-5 text-sm body-serif font-light leading-relaxed">{t.bio}</p>
                      <div className="space-y-3 mb-5 text-sm">
                        <div><p className="text-[10px] font-semibold text-gold/50 tracking-wider mb-0.5">EXPERIENCE</p><p className="text-pink-glow/45">{t.experience}</p></div>
                        <div><p className="text-[10px] font-semibold text-gold/50 tracking-wider mb-1">CERTIFICATION</p><p className="text-pink-glow/45 text-xs body-serif font-light leading-relaxed">{t.certification}</p></div>
                        <div>
                          <p className="text-[10px] font-semibold text-gold/50 tracking-wider mb-2">SPECIALTIES</p>
                          <div className="flex flex-wrap gap-1.5">
                            {t.specialties.map((s, i) => (<span key={i} className="px-3 py-1 bg-gold/8 text-pink-glow/45 rounded-full text-xs border border-gold/12">{s}</span>))}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => navigate('contact')} className="w-full btn-pink py-2.5 text-sm cursor-pointer">Book with {t.name.split(' ')[0]}</button>
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
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display">Our Commitment to Excellence</motion.h2>
            <motion.div variants={fadeUp} custom={1}>
              <div className="surface-raised rounded-2xl p-8 md:p-10">
                <div className="space-y-6">
                  {[
                    { title: 'International Certifications', desc: 'All practitioners hold recognized international credentials from leading wellness organisations.' },
                    { title: 'Annual Workshops', desc: 'Ongoing education in new techniques and wellness modalities ensures our team stays at the cutting edge.' },
                    { title: 'Client-Centered Approach', desc: 'Personalized treatments tailored to individual needs, preferences and wellness goals.' },
                    { title: 'Wellness Consultation', desc: 'Pre-treatment consultations to understand your wellness goals and customize your experience.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0 mt-0.5"><span className="text-gold text-xs">✦</span></div>
                      <div><p className="font-semibold text-sm text-white">{item.title}</p><p className="text-sm text-pink-glow/35 body-serif font-light leading-relaxed">{item.desc}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">Experience expert care</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto body-serif font-light text-pink-glow/35 leading-relaxed">Book a session with one of our certified therapists.</motion.p>
          <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} onClick={() => navigate('contact')} className="btn-outline-pink px-8 py-3.5 text-sm font-semibold cursor-pointer">Book Your Session</motion.button>
        </div>
      </section>
    </div>
  );
}