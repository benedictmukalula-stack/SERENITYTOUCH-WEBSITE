'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const plans = [
  {
    name: 'Silver',
    tagline: 'For wellness beginners',
    price: 'K800',
    icon: Sparkles,
    features: [
      '1 massage per month',
      '10% off additional services',
      'Priority booking',
      'Birthday special',
      'Access to member lounge',
      'Monthly wellness newsletter',
    ],
    popular: false,
    color: 'from-gray-400 to-gray-500',
    bgTint: 'bg-gray-50',
  },
  {
    name: 'Gold',
    tagline: 'For regular enthusiasts',
    price: 'K1,600',
    icon: Crown,
    features: [
      '2 massages per month',
      '20% off all services',
      'VIP booking',
      'Free aromatherapy upgrade',
      'Quarterly wellness consult',
      'Guest privileges',
      'WhatsApp concierge',
      'Exclusive events access',
    ],
    popular: true,
    color: 'from-gold to-amber-600',
    bgTint: 'bg-amber-50/50',
  },
  {
    name: 'Platinum',
    tagline: 'The exclusive experience',
    price: 'K3,200',
    icon: Crown,
    features: [
      'Unlimited massages',
      '30% off all services',
      '24/7 concierge',
      'Personal wellness plan',
      'Private therapy room',
      'Monthly spa day',
      'Home visit services',
      'Airport pickup',
      'Priority WhatsApp line',
      'Annual retreat invitation',
    ],
    popular: false,
    color: 'from-purple-500 to-pink-brand',
    bgTint: 'bg-purple-50/50',
  },
];

const membershipFaqs = [
  {
    q: 'How do I sign up for a membership?',
    a: 'You can sign up through our contact form, by calling us directly, or by visiting our sanctuary in Ibex Hill. Our team will guide you through the process and help you choose the right tier for your needs.',
  },
  {
    q: 'Can I upgrade or downgrade my membership?',
    a: 'Yes! You can change your membership tier at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle. We make the process seamless and hassle-free.',
  },
  {
    q: 'What happens if I do not use all my monthly massages?',
    a: 'Unused massages roll over for one month for Gold members and indefinitely for Platinum members. Silver members can carry over up to one unused session. We want you to enjoy every benefit of your membership.',
  },
  {
    q: 'Is there a cancellation fee?',
    a: 'Memberships can be cancelled with 30 days notice. There is no cancellation fee for memberships held for 3 months or longer. Early cancellation within the first 3 months incurs a small administrative fee.',
  },
  {
    q: 'Can I share my membership benefits?',
    a: 'Gold and Platinum members have guest privileges that allow them to share certain benefits with friends or family. Platinum members receive one complimentary guest session per month.',
  },
];

export default function MembershipPage() {
  const { navigate } = useAppStore();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="container-tinas text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] tracking-[0.2em] text-gray-400 mb-4 heading-display"
          >
            MEMBERSHIP
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display"
          >
            Invest in Your Wellness
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto body-serif"
          >
            Choose the membership that fits your lifestyle. Every tier unlocks exclusive benefits and priority access to our world-class therapists.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding bg-white">
        <div className="container-tinas">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {plans.map((plan, idx) => (
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
                      <span className="bg-gradient-to-r from-gold to-amber-600 text-white px-5 py-1.5 rounded-full text-[10px] font-bold tracking-wider shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-2xl relative overflow-hidden ${
                      selectedPlan === plan.name
                        ? 'border-2 border-gold shadow-xl ring-4 ring-gold/10'
                        : plan.popular
                          ? 'border-2 border-gray-900 shadow-lg'
                          : 'border border-gray-100 hover:border-gold/30'
                    }`}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-5 rounded-bl-full`} />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                          <plan.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold heading-display">{plan.name}</h3>
                        </div>
                      </div>
                      <p className="text-gray-500 mb-6 text-sm">{plan.tagline}</p>
                      <div className="mb-8">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-500 ml-1 text-sm">/month</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, fidx) => (
                          <li key={fidx} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => {
                          setSelectedPlan(plan.name);
                          navigate('contact');
                        }}
                        className={`w-full py-3 text-sm font-semibold cursor-pointer transition-all ${
                          plan.popular
                            ? 'bg-gradient-to-r from-gold to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full'
                            : 'btn-dark'
                        }`}
                      >
                        {selectedPlan === plan.name ? 'Selected ✓' : 'Get Started'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-gray-50">
        <div className="container-tinas max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display">
              Compare Plans
            </motion.h2>
            <motion.div variants={fadeUp} custom={1} className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 pr-4 text-gray-500 font-medium">Feature</th>
                    <th className="text-center py-4 px-4 text-gray-900 font-bold heading-display">Silver</th>
                    <th className="text-center py-4 px-4 text-gray-900 font-bold heading-display">Gold</th>
                    <th className="text-center py-4 pl-4 text-gray-900 font-bold heading-display">Platinum</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {[
                    { feature: 'Monthly massages', silver: '1', gold: '2', platinum: 'Unlimited' },
                    { feature: 'Service discount', silver: '10%', gold: '20%', platinum: '30%' },
                    { feature: 'Booking priority', silver: '✓', gold: 'VIP', platinum: '24/7' },
                    { feature: 'Concierge access', silver: '—', gold: 'WhatsApp', platinum: '24/7' },
                    { feature: 'Guest privileges', silver: '—', gold: '✓', platinum: '1 free/mo' },
                    { feature: 'Home visits', silver: '—', gold: '—', platinum: '✓' },
                    { feature: 'Private room', silver: '—', gold: '—', platinum: '✓' },
                    { feature: 'Spa day', silver: '—', gold: '—', platinum: 'Monthly' },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3.5 pr-4 font-medium text-gray-700">{row.feature}</td>
                      <td className="py-3.5 px-4 text-center">{row.silver}</td>
                      <td className="py-3.5 px-4 text-center font-medium">{row.gold}</td>
                      <td className="py-3.5 pl-4 text-center font-medium">{row.platinum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Membership FAQ */}
      <section className="section-padding bg-white">
        <div className="container-tinas max-w-3xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display"
          >
            Membership FAQ
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="space-y-3"
          >
            {membershipFaqs.map((item, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer"
                >
                  <h3 className="font-bold text-[15px] heading-display pr-4">{item.q}</h3>
                  <svg
                    className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-300 ${
                      expandedFaq === idx ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 pb-5 text-gray-500 text-sm body-serif leading-relaxed border-t border-gray-100 pt-4">
                    {item.a}
                  </div>
                )}
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
            Begin your membership journey
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-lg mb-8 max-w-2xl mx-auto body-serif text-gray-300 leading-relaxed"
          >
            Choose your tier and unlock a world of exclusive wellness benefits. Our team is ready to welcome you.
          </motion.p>
          <motion.button
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            onClick={() => navigate('contact')}
            className="bg-gradient-to-r from-gold to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3.5 text-sm font-semibold cursor-pointer rounded-full transition-all"
          >
            Get Started Today
          </motion.button>
        </div>
      </section>
    </div>
  );
}