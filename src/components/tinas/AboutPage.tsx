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

const values = [
  {
    title: 'Authenticity',
    description: 'We believe in genuine care, not superficial luxury. Every interaction reflects our commitment to your wellbeing and long-term health.',
  },
  {
    title: 'Excellence',
    description: 'We maintain the highest standards in every aspect — from therapist certification to the quality of our oils and linens.',
  },
  {
    title: 'Discretion',
    description: 'Your privacy is paramount. We maintain encrypted records and create a confidential space for your wellness journey.',
  },
  {
    title: 'Personalization',
    description: 'No two guests are the same. We tailor every treatment to your unique needs, preferences, and wellness goals.',
  },
  {
    title: 'Community',
    description: 'We celebrate Zambian talent and source locally-produced botanicals to support our community and economy.',
  },
  {
    title: 'Sustainability',
    description: "We're committed to ethical practices and environmentally conscious choices in everything we do.",
  },
];

export default function AboutPage() {
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
            About Tina&apos;s Sanctuary
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto body-serif"
          >
            A private wellness sanctuary dedicated to delivering the finest therapeutic experience in Lusaka.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-tinas max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-8 heading-display">
              Our Story
            </motion.h2>
            <motion.div variants={fadeUp} custom={1} className="space-y-5 text-gray-600 body-serif leading-relaxed">
              <p>
                Tina&apos;s Sanctuary was founded with a singular vision: to create a private, luxurious wellness space where the finest therapeutic practices meet personalized care. Located in the heart of Ibex Hill, Lusaka, our sanctuary represents more than a spa — it&apos;s a refuge for those seeking genuine transformation.
              </p>
              <p>
                Every detail has been carefully considered, from the silk-draped treatment suites to the in-house blended oils. We believe that true wellness comes from rituals composed specifically for you — treatments that honor your body, respect your time, and celebrate your commitment to self-care.
              </p>
              <p>
                Our team of internationally certified therapists brings decades of combined experience and an unwavering commitment to excellence. We don&apos;t just provide treatments; we craft personalized rituals that leave you feeling transformed, renewed, and deeply cared for.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-tinas">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold heading-display">
              Our Values
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                custom={idx}
              >
                <div className="bg-white border border-gray-100 rounded-2xl p-7 h-full hover:shadow-lg hover:border-gold/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                    <span className="text-gold text-sm">✦</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2.5 heading-display">{value.title}</h3>
                  <p className="text-gray-500 text-sm body-serif leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image & Quote */}
      <section className="section-padding bg-white">
        <div className="container-tinas max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80"
              alt="Tina's Sanctuary interior"
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <blockquote className="text-white text-xl md:text-2xl heading-display leading-relaxed max-w-2xl">
                &ldquo;Wellness isn&apos;t a luxury — it&apos;s a way of being. I created this space so every guest could experience that truth.&rdquo;
              </blockquote>
              <p className="text-gold mt-4 font-semibold text-sm">— Tina Mulenga, Founder</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Membership Preview */}
      <section className="section-padding bg-gray-50">
        <div className="container-tinas max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold heading-display mb-4">
              Join Our Community
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-gray-500 body-serif">
              Become a member and unlock exclusive benefits, priority booking, and personalized wellness experiences.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="grid sm:grid-cols-3 gap-5"
          >
            {[
              { name: 'Silver', price: 'K800', color: 'bg-gray-100' },
              { name: 'Gold', price: 'K1,600', color: 'bg-amber-50' },
              { name: 'Platinum', price: 'K3,200', color: 'bg-purple-50' },
            ].map((plan) => (
              <div key={plan.name} className={`${plan.color} rounded-2xl p-6 text-center`}>
                <h3 className="text-xl font-bold mb-2 heading-display">{plan.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-5">
                  {plan.price}
                  <span className="text-sm text-gray-500 font-normal">/mo</span>
                </p>
                <button
                  onClick={() => navigate('membership')}
                  className="btn-dark px-6 py-2.5 text-sm font-semibold cursor-pointer w-full"
                >
                  Learn More
                </button>
              </div>
            ))}
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
            Begin Your Transformation
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-lg mb-8 max-w-2xl mx-auto body-serif text-gray-300 leading-relaxed"
          >
            Experience the sanctuary that&apos;s changing how Lusaka approaches wellness.
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
            Book Your First Session
          </motion.button>
        </div>
      </section>
    </div>
  );
}