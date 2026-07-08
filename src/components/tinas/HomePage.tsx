'use client';

import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Star, ArrowRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import AnimatedCounter from '@/components/tinas/AnimatedCounter';
import VideoTestimonials from '@/components/tinas/VideoTestimonials';
import ReferralProgram from '@/components/tinas/ReferralProgram';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const testimonials = [
  { text: "Serenity Touch Spa is my go-to wellness destination. The deep tissue massage was exactly what I needed after weeks of stress. Truly world-class.", author: 'Chipo Mwale', location: 'Lusaka', rating: 5 },
  { text: 'The hot stone therapy was incredible. I left feeling completely rejuvenated. The ambiance, the service, everything was perfect. Highly recommend.', author: 'Bwalya Nkomo', location: 'Kitwe', rating: 5 },
  { text: "Patricia's aromatherapy session was a beautiful, calming experience. The essential oils were divine and the technique was flawless. I'll be back.", author: 'Grace Banda', location: 'Lusaka', rating: 5 },
  { text: 'Professional, luxurious, and deeply relaxing. I recommend Serenity Touch Spa to anyone seeking genuine, world-class pampering in Lusaka.', author: 'Patricia Mulenga', location: 'Lusaka', rating: 5 },
];

const faqItems = [
  { question: "What makes Serenity Touch Spa special?", answer: "Certified expertise meets luxurious comfort. Our private suites, premium products, and personalised treatments create a wellness experience that goes beyond ordinary massage." },
  { question: 'How do I book?', answer: 'Book through our form, call +260 572 782 539, or message us on WhatsApp at +260 761 404 555. Gold and Platinum members enjoy priority booking through our dedicated concierge.' },
  { question: 'What is your cancellation policy?', answer: "24-hour notice for full refund. Within 24 hours: 50% fee. No-shows charged in full. We respect your time and our therapists' schedules." },
  { question: 'Are your therapists certified?', answer: 'Every therapist holds international certifications and is trained in the most advanced therapeutic techniques. Excellence and professionalism are our standards.' },
  { question: 'What should I bring?', answer: 'Nothing but yourself. We provide everything — fresh linens, premium oils, and a serene environment. Just arrive 10 minutes early for your wellness consultation.' },
];

const whyMembers = [
  { title: 'Expert Therapists', desc: 'Internationally certified therapists trained in the most advanced wellness techniques.' },
  { title: 'Private & Peaceful', desc: 'Private treatment suites designed for your absolute comfort and tranquility.' },
  { title: 'Personalised Treatments', desc: 'Every treatment is tailored to your body, your needs, and your wellness goals.' },
  { title: 'Dedicated Concierge', desc: 'Gold and Platinum members get a direct WhatsApp line for priority booking.' },
  { title: 'Premium Products', desc: 'Locally-sourced essential oils and internationally acclaimed wellness products.' },
  { title: 'Attention to Detail', desc: 'Every detail — from room temperature to ambient scent — is carefully considered.' },
];

const membershipPlans = [
  { name: 'Silver', tagline: 'A taste of wellness', price: 'K800', features: ['1 massage per month', '10% off additional services', 'Priority booking', 'Birthday treat', 'Access to member lounge'], popular: false },
  { name: 'Gold', tagline: 'For the dedicated', price: 'K1,600', features: ['2 massages per month', '20% off all services', 'VIP booking', 'Free aromatherapy upgrade', 'Quarterly wellness consult', 'Guest privileges', 'WhatsApp concierge', 'Exclusive events access'], popular: true },
  { name: 'Platinum', tagline: 'The ultimate experience', price: 'K3,200', features: ['Unlimited massages', '30% off everything', '24/7 concierge', 'Personal wellness plan', 'Private therapy suite', 'Monthly spa day', 'Home visit service', 'Airport pickup', 'Priority WhatsApp line', 'Annual retreat invitation'], popular: false },
];

export default function HomePage() {
  const { navigate } = useAppStore();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, [nextTestimonial]);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image — dark, moody spa */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#030102',
          }}
        />
        {/* Dark gradient overlay with pink-gold tint */}
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(160deg, rgba(0,0,0,0.82) 0%, rgba(10,5,8,0.6) 35%, rgba(173,20,87,0.15) 70%, rgba(212,175,55,0.08) 100%)' }} />
        {/* Bottom fade to black */}
        <div className="absolute bottom-0 left-0 right-0 h-48 z-[2]" style={{ background: 'linear-gradient(to top, #000000, transparent)' }} />
        {/* Top ambient glow */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] z-[1] rounded-full" style={{ background: 'radial-gradient(circle, rgba(233,30,99,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] z-[1] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)' }} />

        <div className="container-tinas relative z-10 text-center py-32">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 inline-block"
          >
            <div className="badge-sexy">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-brand inline-block" />
              LUSAKA&apos;S PREMIER LUXURY SPA
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold mb-6 leading-[1.05] heading-display text-shadow-sexy"
          >
            <span className="text-gradient-sexy">Relax</span>{' '}
            <span className="text-white">• Restore</span>{' '}
            <span className="text-gradient-gold">• Rejuvenate</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-pink-glow/60 max-w-2xl mx-auto mb-10 body-serif leading-relaxed font-light"
          >
            Serenity Touch Spa is a premium wellness destination in Ibex Hill, Lusaka — where certified therapists, warm oils, and tranquil suites deliver the finest therapeutic experience.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('contact')}
              className="btn-pink px-8 py-3.5 text-sm font-semibold cursor-pointer"
            >
              Book Appointment
            </button>
            <button
              onClick={() => navigate('services')}
              className="btn-outline-gold px-8 py-3.5 text-sm font-semibold cursor-pointer"
            >
              Explore Our Treatments
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-gold/20 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 bg-pink-brand rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SIGNATURE TREATMENTS ===== */}
      <section className="section-padding section-dark">
        <div className="container-tinas">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[11px] tracking-[0.25em] text-pink-brand/50 mb-4 heading-display uppercase">
              Signature Treatments
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-semibold mb-4 heading-display">
              Designed for <span className="text-pink-brand">Wellness</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-pink-glow/40 max-w-2xl mx-auto body-serif text-lg font-light">
              Every treatment is a crafted experience — from the oils blended in-house to the temperature of the silk against your skin.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { duration: '60 min', name: 'Swedish Massage', desc: 'Long, flowing strokes that melt away the world. Full-body relaxation that leaves you floating.', price: 'K800', img: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80' },
              { duration: '90 min', name: 'Deep Tissue Massage', desc: 'Intense, deliberate pressure that targets your deepest tension. For those who seek release.', price: 'K1,200', img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80' },
              { duration: '75 min', name: 'Hot Stone Therapy', desc: 'Heated stones glide across your body, melting resistance and inducing deep, euphoric relaxation.', price: 'K1,000', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
            ].map((service, idx) => (
              <motion.div
                key={service.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                custom={idx}
              >
                <div className="group surface-raised rounded-2xl overflow-hidden hover:border-pink-brand/25 transition-all duration-500 h-full">
                  <div className="h-48 relative overflow-hidden">
                    <img src={service.img} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0508] via-[#0a0508]/40 to-transparent" />
                  </div>
                  <div className="p-7">
                    <p className="text-[10px] tracking-[0.2em] text-gold/60 mb-2 uppercase">{service.duration}</p>
                    <h3 className="text-xl font-semibold mb-3 heading-display">{service.name}</h3>
                    <p className="text-pink-glow/35 mb-6 text-sm body-serif leading-relaxed font-light">{service.desc}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-semibold text-gradient-gold">{service.price}</span>
                      <button
                        onClick={() => navigate('services')}
                        className="text-sm text-pink-brand/50 hover:text-pink-brand transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Discover <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold-Pink Divider */}
      <div className="divider-sexy" />

      {/* ===== WHY MEMBERS CHOOSE US ===== */}
      <section className="section-padding gradient-sexy">
        <div className="container-tinas">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-semibold heading-display">
              Why Our <span className="text-pink-brand">Guests Return</span>
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {whyMembers.map((item, idx) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                custom={idx}
              >
                <div className="group">
                  <div className="w-10 h-10 rounded-full bg-pink-brand/8 border border-pink-brand/15 flex items-center justify-center mb-4 group-hover:bg-pink-brand/15 group-hover:border-pink-brand/25 transition-all">
                    <span className="text-gold text-sm">&#10022;</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2.5 heading-display">{item.title}</h3>
                  <p className="text-pink-glow/35 text-sm body-serif leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="py-16 gradient-sexy">
        <div className="container-tinas">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <AnimatedCounter value="2,500+" label="Happy Guests" />
            <AnimatedCounter value="4.9" label="Average Rating" />
            <AnimatedCounter value="98%" label="Would Return" />
            <AnimatedCounter value="15,000+" label="Treatments Delivered" />
          </div>
        </div>
      </section>

      {/* ===== BEFORE & AFTER ===== */}
      <section className="section-padding section-dark">
        <div className="container-tinas">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display uppercase">Real Transformations</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold heading-display">The <span className="text-pink-brand">Difference</span> We Make</motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { guest: 'Chipo Mwale', treatment: 'Deep Tissue — 4 Sessions', before: 'Chronic lower back pain for 2 years. Could barely sit at my desk for more than 30 minutes without severe discomfort.', after: 'After 4 sessions, the pain is virtually gone. I can work a full day without any discomfort. Life-changing.', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80' },
              { guest: 'Grace Banda', treatment: 'Aromatherapy — 6 Sessions', before: 'Severe insomnia and anxiety. Averaging 3-4 hours of sleep per night and feeling constantly on edge.', after: 'Now sleeping 7-8 hours consistently. My anxiety levels have dropped dramatically. The essential oil blends are magical.', image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&q=80' },
              { guest: 'Bwalya Nkomo', treatment: 'Thai Massage — 3 Sessions', before: 'Office stress causing migraines and neck stiffness. Taking painkillers almost daily.', after: 'Migraines reduced from weekly to almost never. Neck mobility is fully restored. I wish I had found Serenity Touch sooner.', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80' },
            ].map((story, idx) => (
              <motion.div key={story.guest} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={idx}>
                <div className="surface-raised rounded-2xl overflow-hidden h-full hover:border-gold/20 transition-all duration-300">
                  <div className="h-40 relative overflow-hidden">
                    <img src={story.image} alt={story.guest} className="w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0508] via-[#0a0508]/60 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <p className="font-bold text-sm text-white heading-display">{story.guest}</p>
                      <p className="text-[10px] text-gold/50">{story.treatment}</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-pink-brand/60 tracking-wider uppercase mb-2">Before</p>
                      <p className="text-sm text-pink-glow/40 body-serif font-light leading-relaxed">{story.before}</p>
                    </div>
                    <div className="border-t border-gold/8 pt-4">
                      <p className="text-[10px] font-bold text-gold/60 tracking-wider uppercase mb-2">After</p>
                      <p className="text-sm text-gold/60 body-serif font-light leading-relaxed">{story.after}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-padding section-dark">
        <div className="container-tinas">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-semibold heading-display">
              Whispers from our <span className="text-pink-brand">guests</span>
            </motion.h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="surface-raised p-10 md:p-14 rounded-2xl mb-8 glow-pink"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-lg md:text-xl mb-6 body-serif leading-relaxed text-pink-glow/70 font-light italic">
                &ldquo;{testimonials[currentTestimonial].text}&rdquo;
              </p>
              <p className="font-semibold text-sm tracking-wider text-gradient-gold">
                {testimonials[currentTestimonial].author.toUpperCase()} &middot;{' '}
                {testimonials[currentTestimonial].location.toUpperCase()}
              </p>
            </motion.div>

            <div className="flex items-center justify-between">
              <button
                onClick={prevTestimonial}
                className="p-2.5 hover:bg-gold/8 rounded-full transition cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-gold/40" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentTestimonial
                        ? 'bg-pink-brand w-8'
                        : 'bg-white/10 w-2.5 hover:bg-white/25'
                    }`}
                    aria-label={`Testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2.5 hover:bg-gold/8 rounded-full transition cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-gold/40" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VIDEO TESTIMONIALS ===== */}
      <VideoTestimonials />

      {/* ===== MEMBERSHIP ===== */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, #080406 0%, #000000 100%)' }}>
        <div className="container-tinas">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display uppercase">
              Membership
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-semibold heading-display">
              Three Ways to Invest in <span className="text-gradient-sexy">Your Wellness</span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {membershipPlans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                custom={idx}
                className={plan.popular ? 'md:-mt-4' : ''}
              >
                <div className="relative">
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-gold to-pink-brand text-black px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider shadow-lg shadow-gold/20" style={{ color: '#000' }}>
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <div
                    className={`surface-raised rounded-2xl p-8 h-full transition-all duration-500 hover:border-pink-brand/25 ${
                      plan.popular ? 'border-gold/30 glow-gold' : ''
                    }`}
                  >
                    <h3 className="text-3xl font-semibold mb-2 heading-display">{plan.name}</h3>
                    <p className="text-pink-glow/35 mb-6 text-sm font-light">{plan.tagline}</p>
                    <div className="mb-8">
                      <span className="text-4xl font-semibold text-gradient-gold">{plan.price}</span>
                      <span className="text-pink-brand/35 ml-1">/month</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-3">
                          <span className="text-gold mt-0.5 text-xs">&#10022;</span>
                          <span className="text-sm text-pink-glow/50 font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => navigate('membership')}
                      className={`w-full py-3 text-sm cursor-pointer font-semibold transition-all ${
                        plan.popular
                          ? 'btn-gold'
                          : 'btn-outline-pink'
                      }`}
                    >
                      {plan.popular ? 'Enjoy Now' : 'Enquire'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section-padding section-dark">
        <div className="container-tinas max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-semibold heading-display">
              Frequently Asked <span className="text-pink-brand">Questions</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={fadeUp}
            custom={1}
            className="space-y-3"
          >
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="surface-raised rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-5 md:p-6 text-left flex items-center justify-between hover:bg-pink-brand/[0.02] transition cursor-pointer"
                >
                  <h3 className="font-semibold text-[15px] heading-display pr-4 text-white">{item.question}</h3>
                  <ChevronRight
                    className={`w-5 h-5 shrink-0 text-gold/40 transition-transform duration-300 ${
                      expandedFaq === idx ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 md:px-6 pb-5 md:pb-6 text-pink-glow/35 text-sm body-serif leading-relaxed border-t border-gold/8 pt-4 font-light">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="section-padding relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #080406 0%, #100a0e 30%, #0d0510 60%, #000000 100%)' }}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=40')] bg-cover bg-center opacity-[0.03]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-pink-brand/[0.03] blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-gold/[0.03] blur-[80px]" />
        <div className="container-tinas text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-4xl md:text-5xl font-semibold mb-6 heading-display"
            >
              Ready to Experience <span className="text-gradient-sexy">Serenity</span>?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-lg mb-10 max-w-2xl mx-auto body-serif text-pink-glow/40 leading-relaxed font-light"
            >
              Book your first appointment and discover why Serenity Touch Spa is Lusaka's premier wellness destination.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={2}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate('contact')}
                className="btn-pink px-8 py-3.5 text-sm font-semibold cursor-pointer"
              >
                Book Appointment
              </button>
              <button
                onClick={() => navigate('about')}
                className="btn-outline-gold px-8 py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2"
              >
                Learn About Us <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== REFERRAL PROGRAM ===== */}
      <ReferralProgram />
    </div>
  );
}