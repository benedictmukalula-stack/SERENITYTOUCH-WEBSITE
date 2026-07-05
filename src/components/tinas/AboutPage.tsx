'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const values = [
  { title: 'Authenticity', description: 'We believe in genuine care, not superficial luxury. Every interaction reflects our commitment to your wellbeing and long-term health.' },
  { title: 'Excellence', description: 'We maintain the highest standards in every aspect — from therapist certification to the quality of our oils and linens.' },
  { title: 'Discretion', description: 'Your privacy is paramount. We maintain encrypted records and create a confidential space for your wellness journey.' },
  { title: 'Personalization', description: 'No two guests are the same. We tailor every treatment to your unique needs, preferences, and wellness goals.' },
  { title: 'Community', description: 'We celebrate Zambian talent and source locally-produced botanicals to support our community and economy.' },
  { title: 'Sustainability', description: "We're committed to ethical practices and environmentally conscious choices in everything we do." },
];

export default function AboutPage() {
  const { navigate } = useAppStore();

  return (
    <div>
      <section className="pt-32 pb-16 section-dark">
        <div className="container-tinas text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">About Serenity Touch Spa</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-pink-glow/35 max-w-2xl mx-auto body-serif font-light">A private wellness spa dedicated to delivering the finest therapeutic experience in Lusaka.</motion.p>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-8 heading-display">Our Story</motion.h2>
            <motion.div variants={fadeUp} custom={1} className="space-y-5 text-pink-glow/45 body-serif font-light leading-relaxed">
              <p>Serenity Touch Spa was founded with a singular vision: to create a private, luxurious wellness space where the finest therapeutic practices meet personalized care. Located in the heart of Ibex Hill, Lusaka, our spa represents more than a spa — it&apos;s a refuge for those seeking genuine transformation.</p>
              <p>Every detail has been carefully considered, from the silk-draped treatment suites to the in-house blended oils. We believe that true wellness comes from treatments designed specifically for you — treatments that honor your body, respect your time, and celebrate your commitment to self-care.</p>
              <p>Our team of internationally certified therapists brings decades of combined experience and an unwavering commitment to excellence. We don&apos;t just provide treatments; we craft personalized treatments that leave you feeling transformed, renewed, and deeply cared for.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold heading-display">Our Values</motion.h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, idx) => (
              <motion.div key={v.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={idx}>
                <div className="surface-raised rounded-2xl p-7 h-full hover:border-gold/25 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-gold/8 border border-gold/15 flex items-center justify-center mb-4"><span className="text-gold text-sm">✦</span></div>
                  <h3 className="text-lg font-bold mb-2.5 heading-display">{v.title}</h3>
                  <p className="text-pink-glow/35 text-sm body-serif font-light leading-relaxed">{v.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative rounded-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=1200&q=80" alt="Serenity Touch Spa interior" className="w-full h-[400px] md:h-[500px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0508]/90 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <blockquote className="text-white text-xl md:text-2xl heading-display leading-relaxed max-w-2xl">
                &ldquo;Wellness isn&apos;t a luxury — it&apos;s a way of being. I created this space so every guest could experience that truth.&rdquo;
              </blockquote>
              <p className="text-gradient-gold mt-4 font-semibold text-sm">— Tina Mulenga, Founder</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spa Etiquette */}
      <section className="section-padding section-dark">
        <div className="container-tinas max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display uppercase">FIRST VISIT?</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold heading-display">Spa <span className="text-pink-brand">Etiquette</span></motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-pink-glow/35 mt-4 max-w-2xl mx-auto body-serif font-light">Everything you need to know for the perfect first visit.</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3} className="grid sm:grid-cols-2 gap-5">
            {[
              { title: 'Arrive 10 Minutes Early', desc: 'This gives us time to prepare your treatment room and discuss your preferences. Rushing in defeats the purpose of relaxation.' },
              { title: 'Silence Your Phone', desc: 'We kindly ask that you put your phone on silent. This is your time to disconnect and recharge — let the outside world wait.' },
              { title: 'Communicate Openly', desc: 'Tell your therapist about any pain, preferences, or allergies. Your comfort and safety are our absolute priority.' },
              { title: 'Hygiene & Comfort', desc: 'Shower before your appointment if possible. We provide fresh linens, robes, and slippers for your comfort.' },
              { title: 'Cancellations', desc: 'Please give 24 hours notice for cancellations. Late cancellations may incur a 50% fee. No-shows are charged in full.' },
              { title: 'Gratuities', desc: 'Tipping is appreciated but never expected. If you wish to tip, it can be added to your payment or given directly.' },
              { title: 'What to Wear', desc: 'Wear whatever makes you comfortable. We provide disposable undergarments and robes. You will always be properly draped.' },
              { title: 'After Your Treatment', desc: 'Drink plenty of water and avoid heavy meals for an hour. Take it easy — let the treatment benefits settle in.' },
            ].map((item, i) => (
              <div key={i} className="surface-raised rounded-xl p-5 hover:border-gold/20 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0 mt-0.5"><span className="text-gold text-xs">{i + 1}</span></div>
                  <div>
                    <p className="font-semibold text-sm text-white mb-1.5">{item.title}</p>
                    <p className="text-sm text-pink-glow/35 body-serif font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold heading-display mb-4">Join Our Community</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-pink-glow/35 body-serif font-light">Become a member and unlock exclusive benefits, priority booking, and personalized wellness experiences.</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="grid sm:grid-cols-3 gap-5">
            {[
              { name: 'Silver', price: 'K800', border: 'border-gold/15' },
              { name: 'Gold', price: 'K1,600', border: 'border-gold/20' },
              { name: 'Platinum', price: 'K3,200', border: 'border-gold/20' },
            ].map((p) => (
              <div key={p.name} className={`surface-raised rounded-2xl p-6 text-center ${p.border}`}>
                <h3 className="text-xl font-bold mb-2 heading-display">{p.name}</h3>
                <p className="text-2xl font-bold text-white mb-5">{p.price}<span className="text-sm text-pink-brand/40 font-normal">/mo</span></p>
                <button onClick={() => navigate('membership')} className="btn-pink px-6 py-2.5 text-sm cursor-pointer w-full">Learn More</button>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">Begin Your Transformation</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto body-serif font-light text-pink-glow/35 leading-relaxed">Experience the spa that&apos;s changing how Lusaka approaches wellness.</motion.p>
          <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} onClick={() => navigate('contact')} className="btn-outline-pink px-8 py-3.5 text-sm font-semibold cursor-pointer">Book Your First Session</motion.button>
        </div>
      </section>
    </div>
  );
}