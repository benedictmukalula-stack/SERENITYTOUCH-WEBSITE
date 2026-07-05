'use client';

import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Star, MessageCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const testimonials = [
  {
    text: "Tina's Sanctuary completely transformed my stress levels. After six months as a member I feel like a new person. The personalized rituals and attention to detail are unlike anything else in Zambia.",
    author: 'Chipo Mwale',
    location: 'Lusaka',
    rating: 5,
  },
  {
    text: 'The best wellness experience in Zambia. Professional, discreet, and absolutely worth every kwacha. The hot stone therapy is my absolute favourite.',
    author: 'Bwalya Nkomo',
    location: 'Kitwe',
    rating: 5,
  },
  {
    text: 'Exceptional service and attention to detail. Every visit feels like a personalized ritual crafted just for me. The aromatherapy blends are divine.',
    author: 'Grace Banda',
    location: 'Lusaka',
    rating: 5,
  },
  {
    text: 'A true sanctuary. The therapists are incredibly skilled and the discretion is unmatched. I recommend Tina\'s to all my colleagues.',
    author: 'Patricia Mulenga',
    location: 'Lusaka',
    rating: 5,
  },
];

const faqItems = [
  {
    question: "What makes Tina's Sanctuary different?",
    answer: 'Certified expertise, a private luxury setting in Ibex Hill and treatments personalised to every guest. We don\'t just provide treatments\u2014we craft personalized rituals that leave you feeling transformed.',
  },
  {
    question: 'How do I book?',
    answer: 'You can book through our website contact form, call us at +260 572 782 539, or email info@tinassanctuary.zm. Members enjoy priority booking through our WhatsApp concierge line.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made 24 hours in advance receive a full refund. Cancellations within 24 hours are subject to a 50% fee. No-shows will be charged in full.',
  },
  {
    question: 'Are your therapists certified?',
    answer: 'Yes, every practitioner is internationally certified and continually trained in the latest therapeutic techniques. We maintain the highest standards of professional excellence.',
  },
  {
    question: 'What should I bring to my appointment?',
    answer: 'Just bring yourself! We provide all linens, oils, and amenities. Arrive 10 minutes early to complete a brief wellness consultation.',
  },
];

const whyMembers = [
  { title: 'Certified therapists', desc: 'Every practitioner internationally certified and continually trained in the latest techniques.' },
  { title: 'Absolute discretion', desc: 'Private members-only sanctuary with encrypted booking and records.' },
  { title: 'Personalised rituals', desc: 'Treatments tailored to your body, mood and season.' },
  { title: 'Concierge care', desc: 'Direct WhatsApp line for Gold and Platinum members.' },
  { title: 'Zambian craft', desc: 'Locally-sourced botanicals and homegrown expertise.' },
  { title: 'Consistent excellence', desc: 'Every guest receives the same considered standard of care.' },
];

const membershipPlans = [
  {
    name: 'Silver',
    tagline: 'For wellness beginners',
    price: 'K800',
    features: ['1 massage per month', '10% off additional services', 'Priority booking', 'Birthday special', 'Access to member lounge'],
    popular: false,
  },
  {
    name: 'Gold',
    tagline: 'For regular enthusiasts',
    price: 'K1,600',
    features: ['2 massages per month', '20% off all services', 'VIP booking', 'Free aromatherapy upgrade', 'Quarterly wellness consult', 'Guest privileges'],
    popular: true,
  },
  {
    name: 'Platinum',
    tagline: 'The exclusive experience',
    price: 'K3,200',
    features: ['Unlimited massages', '30% off all services', '24/7 concierge', 'Personal wellness plan', 'Private therapy room', 'Monthly spa day', 'Home visit services'],
    popular: false,
  },
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

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, [nextTestimonial]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-[1]" />

        <div className="container-tinas relative z-10 text-center py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-block"
          >
            <div className="px-5 py-2.5 rounded-full border border-gold/40 bg-white/5 backdrop-blur-sm">
              <span className="text-[11px] tracking-[0.2em] text-gold heading-display font-medium">
                ✦ EXCLUSIVE WELLNESS SANCTUARY
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] text-white heading-display"
          >
            <span className="text-gold">Elevate</span> Your{' '}
            <span className="text-pink-brand">Wellness</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto mb-10 body-serif leading-relaxed"
          >
            Tina&apos;s Sanctuary is a private sanctuary in Ibex Hill, Lusaka — where certified therapists, silk-draped suites and considered rituals deliver the finest therapeutic experience in Zambia.
          </motion.p>

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
              Book Your Session
            </button>
            <button
              onClick={() => {
                navigate('services');
              }}
              className="btn-lime px-8 py-3.5 text-sm font-semibold cursor-pointer"
            >
              Explore Services
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 bg-gold rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Signature Treatments */}
      <section className="section-padding bg-white">
        <div className="container-tinas">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[11px] tracking-[0.2em] text-gray-400 mb-4 heading-display">
              SIGNATURE TREATMENTS
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold mb-4 heading-display">
              Ritual, refined.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 max-w-2xl mx-auto body-serif">
              Every treatment is composed for you — from the oils blended in-house to the temperature of the linen. All prices in Zambian Kwacha.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { duration: '60 min', name: 'Swedish Massage', desc: 'Classic full-body massage using long, flowing strokes to promote relaxation and improve circulation.', price: 'K800' },
              { duration: '90 min', name: 'Deep Tissue Massage', desc: 'Intensive massage targeting deep muscle layers to relieve tension and chronic pain.', price: 'K1,200' },
              { duration: '75 min', name: 'Hot Stone Therapy', desc: 'Heated basalt stones combined with massage to melt tension and induce deep relaxation.', price: 'K1,000' },
            ].map((service, idx) => (
              <motion.div
                key={service.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                custom={idx}
              >
                <div className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-gold/30 transition-all duration-300 h-full">
                  <p className="text-[11px] tracking-[0.15em] text-gray-400 mb-3">{service.duration.toUpperCase()}</p>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 heading-display">{service.name}</h3>
                  <p className="text-gray-500 mb-6 text-sm body-serif leading-relaxed">{service.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                    <button
                      onClick={() => navigate('services')}
                      className="text-sm text-gray-500 hover:text-gold transition-colors flex items-center gap-1 cursor-pointer group-hover:text-gold"
                    >
                      View details <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Members Choose Us */}
      <section className="section-padding bg-gray-50">
        <div className="container-tinas">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold heading-display">
              Why members choose us
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
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <span className="text-gold text-sm">✦</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2.5 heading-display">{item.title}</h3>
                  <p className="text-gray-500 text-sm body-serif leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-tinas">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold heading-display">
              In their words
            </motion.h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-50 p-10 md:p-14 rounded-2xl mb-8"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-lg md:text-xl mb-6 body-serif leading-relaxed text-gray-700">
                &ldquo;{testimonials[currentTestimonial].text}&rdquo;
              </p>
              <p className="font-bold text-sm tracking-wider text-gray-900">
                {testimonials[currentTestimonial].author.toUpperCase()} &middot;{' '}
                {testimonials[currentTestimonial].location.toUpperCase()}
              </p>
            </motion.div>

            <div className="flex items-center justify-between">
              <button
                onClick={prevTestimonial}
                className="p-2.5 hover:bg-gray-100 rounded-full transition cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentTestimonial
                        ? 'bg-gold w-8'
                        : 'bg-gray-300 w-2.5 hover:bg-gray-400'
                    }`}
                    aria-label={`Testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2.5 hover:bg-gray-100 rounded-full transition cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Membership */}
      <section className="section-padding bg-gray-50">
        <div className="container-tinas">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[11px] tracking-[0.2em] text-gray-400 mb-4 heading-display">
              MEMBERSHIP
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold heading-display">
              Three ways to belong
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
                      <span className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <div
                    className={`bg-white rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl ${
                      plan.popular
                        ? 'border-2 border-gray-900 shadow-lg'
                        : 'border border-gray-100'
                    }`}
                  >
                    <h3 className="text-3xl font-bold mb-2 heading-display">{plan.name}</h3>
                    <p className="text-gray-500 mb-6 text-sm">{plan.tagline}</p>
                    <div className="mb-8">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-3">
                          <span className="text-gold mt-0.5 text-xs">✦</span>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => navigate('membership')}
                      className="w-full btn-dark py-3 text-sm font-semibold cursor-pointer"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-tinas max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold heading-display">
              Questions, answered
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
                className="border border-gray-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-5 md:p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer"
                >
                  <h3 className="font-bold text-[15px] heading-display pr-4">{item.question}</h3>
                  <ChevronRight
                    className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                      expandedFaq === idx ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 md:px-6 pb-5 md:pb-6 text-gray-500 text-sm body-serif leading-relaxed border-t border-gray-100 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=40')] bg-cover bg-center opacity-5" />
        <div className="container-tinas text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-4xl md:text-5xl font-bold mb-6 heading-display"
            >
              Ready for your transformation?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-lg mb-10 max-w-2xl mx-auto body-serif text-gray-300 leading-relaxed"
            >
              Reserve your first ritual and discover why Tina&apos;s Sanctuary is Lusaka&apos;s most private wellness address.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={2}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate('contact')}
                className="btn-light-on-dark px-8 py-3.5 text-sm font-semibold cursor-pointer"
              >
                Book Your Session
              </button>
              <button
                onClick={() => navigate('about')}
                className="btn-outline-white px-8 py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2"
              >
                Meet Tina <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}