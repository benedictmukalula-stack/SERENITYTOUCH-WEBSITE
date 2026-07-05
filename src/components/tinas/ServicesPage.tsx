'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const services = [
  {
    id: 1,
    name: 'Swedish Massage',
    duration: '60 min',
    price: 'K800',
    description: 'Classic full-body massage using long, flowing strokes to promote relaxation and improve circulation. Perfect for first-time visitors seeking gentle therapeutic relief.',
    benefits: ['Improved circulation', 'Reduced muscle tension', 'Enhanced relaxation', 'Better sleep quality'],
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80',
  },
  {
    id: 2,
    name: 'Deep Tissue Massage',
    duration: '90 min',
    price: 'K1,200',
    description: 'Intensive massage targeting deep muscle layers to relieve tension and chronic pain. Ideal for those with persistent muscle tightness or athletic recovery.',
    benefits: ['Chronic pain relief', 'Improved mobility', 'Muscle recovery', 'Tension release'],
    image: 'https://images.unsplash.com/photo-1517602436811-4ed606917e01?w=600&q=80',
  },
  {
    id: 3,
    name: 'Hot Stone Therapy',
    duration: '75 min',
    price: 'K1,000',
    description: 'Heated basalt stones combined with massage to melt tension and induce deep relaxation. The warmth penetrates muscles for therapeutic healing.',
    benefits: ['Deep muscle relaxation', 'Improved blood flow', 'Stress relief', 'Detoxification'],
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
  },
  {
    id: 4,
    name: 'Aromatherapy Treatment',
    duration: '60 min',
    price: 'K900',
    description: 'Personalized aromatherapy session using locally-sourced essential oils blended in-house. Tailored to your mood, season, and wellness goals.',
    benefits: ['Emotional balance', 'Mental clarity', 'Stress reduction', 'Holistic wellness'],
    image: 'https://images.unsplash.com/photo-1611073615830-4ebed33c0e5b?w=600&q=80',
  },
  {
    id: 5,
    name: 'Couples Massage',
    duration: '90 min',
    price: 'K2,000',
    description: 'Synchronized massage experience for two in our private couples suite. Share a moment of relaxation and connection in our most intimate setting.',
    benefits: ['Shared wellness', 'Quality time', 'Synchronized relaxation', 'Intimate experience'],
    image: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=600&q=80',
  },
  {
    id: 6,
    name: 'Reflexology',
    duration: '60 min',
    price: 'K850',
    description: 'Ancient healing practice targeting reflex points on feet and hands to promote whole-body wellness and balance.',
    benefits: ['Energy balance', 'Improved circulation', 'Stress relief', 'Holistic healing'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80',
  },
];

export default function ServicesPage() {
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
            Our Signature Treatments
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto body-serif"
          >
            Every treatment is composed for you — from the oils blended in-house to the temperature of the linen. Discover the ritual that speaks to your wellness journey.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-tinas">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                custom={idx}
              >
                <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gold/30 transition-all duration-300">
                  <div className="md:flex">
                    <div className="md:w-2/5 h-52 md:h-auto relative overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 md:p-8 md:w-3/5">
                      <p className="text-[11px] tracking-[0.15em] text-gray-400 mb-2">{service.duration.toUpperCase()}</p>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 heading-display">{service.name}</h3>
                      <p className="text-gray-500 mb-5 text-sm body-serif leading-relaxed">{service.description}</p>

                      <div className="mb-5">
                        <p className="text-[10px] font-semibold text-gray-400 tracking-wider mb-2.5">KEY BENEFITS</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {service.benefits.map((benefit, bidx) => (
                            <div key={bidx} className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="text-gold text-[10px]">✦</span>
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xl md:text-2xl font-bold text-gray-900">{service.price}</span>
                        <button
                          onClick={() => navigate('contact')}
                          className="btn-dark px-5 py-2 text-xs font-semibold cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customization Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-tinas max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display">
              Personalized Rituals
            </motion.h2>
            <motion.div variants={fadeUp} custom={1}>
              <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10">
                <h3 className="text-2xl font-bold mb-4 heading-display">Customize Your Experience</h3>
                <p className="text-gray-500 mb-8 body-serif leading-relaxed">
                  Every guest is unique. We offer customization options for all treatments including:
                </p>
                <div className="space-y-5">
                  {[
                    { title: 'Oil Selection', desc: 'Choose from our collection of locally-sourced essential oils' },
                    { title: 'Pressure Preference', desc: 'Light, medium, or deep pressure tailored to your comfort' },
                    { title: 'Temperature Control', desc: 'Adjust room temperature and linen warmth to your preference' },
                    { title: 'Duration Extension', desc: 'Add 15 or 30 minutes to any treatment for deeper relaxation' },
                    { title: 'Aromatherapy Upgrade', desc: 'Enhance any treatment with our signature essential oil blends' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-gold text-xs">✦</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500 body-serif">{item.desc}</p>
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
            Ready to book your ritual?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-lg mb-8 max-w-2xl mx-auto body-serif text-gray-300 leading-relaxed"
          >
            Contact us to reserve your personalized treatment experience.
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