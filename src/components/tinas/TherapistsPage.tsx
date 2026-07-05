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
  {
    id: 1,
    name: 'Tina Mulenga',
    title: 'Founder & Lead Therapist',
    specialties: ['Swedish Massage', 'Deep Tissue', 'Aromatherapy'],
    certification: 'International Spa & Wellness Association (ISWA)',
    experience: '15+ years',
    bio: 'Tina founded Sanctuary with a vision to bring world-class wellness to Lusaka. Her holistic approach combines traditional techniques with modern therapeutic practices.',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80',
  },
  {
    id: 2,
    name: 'Grace Banda',
    title: 'Senior Massage Therapist',
    specialties: ['Hot Stone Therapy', 'Reflexology', 'Swedish Massage'],
    certification: 'National Board of Certification for Therapeutic Massage (NBCTM)',
    experience: '12+ years',
    bio: 'Grace brings warmth and intuition to every session. Her expertise in hot stone therapy and reflexology helps guests achieve deep relaxation and balance.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  },
  {
    id: 3,
    name: 'Patricia Nkomo',
    title: 'Aromatherapy Specialist',
    specialties: ['Aromatherapy', 'Essential Oil Blending', 'Wellness Consultation'],
    certification: 'International Federation of Aromatherapists (IFA)',
    experience: '10+ years',
    bio: "Patricia's passion for botanical wellness shines through her personalized aromatherapy treatments. She sources and blends our signature oils with care.",
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  },
  {
    id: 4,
    name: 'Chipo Mwale',
    title: 'Therapeutic Massage Specialist',
    specialties: ['Deep Tissue', 'Sports Massage', 'Couples Massage'],
    certification: 'Sports Massage Association (SMA)',
    experience: '8+ years',
    bio: 'Chipo specializes in therapeutic and sports massage, helping clients recover from tension and injury. Her strong technique is balanced with genuine care.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  },
];

export default function TherapistsPage() {
  const { navigate } = useAppStore();

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="container-tinas text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display"
          >
            Meet Our Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto body-serif"
          >
            Every therapist at Tina&apos;s Sanctuary is internationally certified and continually trained in the latest therapeutic techniques.
          </motion.p>
        </div>
      </section>

      {/* Therapists Grid */}
      <section className="section-padding bg-white">
        <div className="container-tinas">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {therapists.map((therapist, idx) => (
              <motion.div
                key={therapist.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                custom={idx}
              >
                <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gold/30 transition-all duration-300">
                  <div className="md:flex">
                    <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden">
                      <img
                        src={therapist.image}
                        alt={therapist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 md:p-8 md:w-3/5">
                      <h3 className="text-xl md:text-2xl font-bold mb-1 text-gray-900 heading-display">{therapist.name}</h3>
                      <p className="text-sm font-semibold text-pink-brand mb-4">{therapist.title}</p>
                      <p className="text-gray-500 mb-5 text-sm body-serif leading-relaxed">{therapist.bio}</p>

                      <div className="space-y-3 mb-5 text-sm">
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 tracking-wider mb-0.5">EXPERIENCE</p>
                          <p className="text-gray-700">{therapist.experience}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 tracking-wider mb-1">CERTIFICATION</p>
                          <p className="text-gray-700 text-xs leading-relaxed">{therapist.certification}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 tracking-wider mb-2">SPECIALTIES</p>
                          <div className="flex flex-wrap gap-1.5">
                            {therapist.specialties.map((specialty, sidx) => (
                              <span key={sidx} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs border border-gray-100">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate('contact')}
                        className="w-full btn-dark py-2.5 text-sm font-semibold cursor-pointer"
                      >
                        Book with {therapist.name.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-tinas max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display">
              Our Commitment to Excellence
            </motion.h2>
            <motion.div variants={fadeUp} custom={1}>
              <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10">
                <div className="space-y-6">
                  {[
                    { title: 'International Certifications', desc: 'All practitioners hold recognized international credentials from leading wellness organisations.' },
                    { title: 'Annual Workshops', desc: 'Ongoing education in new techniques and wellness modalities ensures our team stays at the cutting edge.' },
                    { title: 'Client-Centered Approach', desc: 'Personalized treatments tailored to individual needs, preferences and wellness goals.' },
                    { title: 'Wellness Consultation', desc: 'Pre-treatment consultations to understand your wellness goals and customize your experience.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-gold text-xs">✦</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500 body-serif leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container-tinas text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-4xl md:text-5xl font-bold mb-6 heading-display"
          >
            Experience expert care
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-lg mb-8 max-w-2xl mx-auto body-serif text-gray-300 leading-relaxed"
          >
            Book a session with one of our certified therapists and discover the difference expert care makes.
          </motion.p>
          <motion.button
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            onClick={() => navigate('contact')}
            className="btn-light-on-dark px-8 py-3.5 text-sm font-semibold cursor-pointer"
          >
            Book Your Session
          </motion.button>
        </div>
      </section>
    </div>
  );
}