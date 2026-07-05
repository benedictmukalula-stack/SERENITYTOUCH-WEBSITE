'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const plans = [
  { name: 'Silver', tagline: 'For wellness beginners', price: 'K800', icon: Sparkles, gradient: 'from-gray-400 to-gray-500', features: ['1 massage per month', '10% off additional services', 'Priority booking', 'Birthday special', 'Access to member lounge', 'Monthly wellness newsletter'], popular: false },
  { name: 'Gold', tagline: 'For regular enthusiasts', price: 'K1,600', icon: Crown, gradient: 'from-gold to-amber-600', features: ['2 massages per month', '20% off all services', 'VIP booking', 'Free aromatherapy upgrade', 'Quarterly wellness consult', 'Guest privileges', 'WhatsApp concierge', 'Exclusive events access'], popular: true },
  { name: 'Platinum', tagline: 'The exclusive experience', price: 'K3,200', icon: Crown, gradient: 'from-purple-500 to-pink-brand', features: ['Unlimited massages', '30% off all services', '24/7 concierge', 'Personal wellness plan', 'Private therapy room', 'Monthly spa day', 'Home visit services', 'Airport pickup', 'Priority WhatsApp line', 'Annual retreat invitation'], popular: false },
];

const membershipFaqs = [
  { q: 'How do I sign up for a membership?', a: 'You can sign up through our contact form, by calling us directly, or by visiting our sanctuary in Ibex Hill. Our team will guide you through the process.' },
  { q: 'Can I upgrade or downgrade my membership?', a: 'Yes! You can change your membership tier at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle.' },
  { q: 'What happens if I do not use all my monthly massages?', a: 'Unused massages roll over for one month for Gold members and indefinitely for Platinum members.' },
  { q: 'Is there a cancellation fee?', a: 'Memberships can be cancelled with 30 days notice. There is no cancellation fee for memberships held for 3 months or longer.' },
  { q: 'Can I share my membership benefits?', a: 'Gold and Platinum members have guest privileges. Platinum members receive one complimentary guest session per month.' },
];

export default function MembershipPage() {
  const { navigate } = useAppStore();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div>
      <section className="pt-32 pb-16" style={{ background: '#111111' }}>
        <div className="container-tinas text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.2em] text-gray-500 mb-4 heading-display">MEMBERSHIP</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">Invest in Your Wellness</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-400 max-w-2xl mx-auto body-serif">Choose the membership that fits your lifestyle. Every tier unlocks exclusive benefits and priority access.</motion.p>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {plans.map((plan, idx) => (
              <motion.div key={plan.name} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={idx} className={plan.popular ? 'md:-mt-4' : ''}>
                <div className="relative">
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-gold to-amber-600 text-[#0a0a0a] px-5 py-1.5 rounded-full text-[10px] font-bold tracking-wider shadow-lg">MOST POPULAR</span>
                    </div>
                  )}
                  <div className={`surface-raised rounded-2xl p-8 h-full transition-all duration-300 hover:border-gold/40 relative overflow-hidden ${selectedPlan === plan.name ? 'border-gold ring-4 ring-gold/10 shadow-xl shadow-gold/5' : plan.popular ? 'border-gold/40' : ''}`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.gradient} opacity-[0.04] rounded-bl-full`} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}><plan.icon className="w-5 h-5 text-white" /></div>
                        <h3 className="text-2xl font-bold heading-display">{plan.name}</h3>
                      </div>
                      <p className="text-gray-400 mb-6 text-sm">{plan.tagline}</p>
                      <div className="mb-8">
                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-gray-500 ml-1 text-sm">/month</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                            <span className="text-sm text-gray-300">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => { setSelectedPlan(plan.name); navigate('contact'); }}
                        className={`w-full py-3 text-sm font-semibold cursor-pointer transition-all ${plan.popular ? 'bg-gradient-to-r from-gold to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#0a0a0a] rounded-full' : 'btn-gold'}`}>
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
      <section className="section-padding" style={{ background: '#111111' }}>
        <div className="container-tinas max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display">Compare Plans</motion.h2>
            <motion.div variants={fadeUp} custom={1} className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/20">
                    <th className="text-left py-4 pr-4 text-gray-400 font-medium">Feature</th>
                    <th className="text-center py-4 px-4 heading-display font-bold">Silver</th>
                    <th className="text-center py-4 px-4 heading-display font-bold">Gold</th>
                    <th className="text-center py-4 pl-4 heading-display font-bold">Platinum</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {[
                    { feature: 'Monthly massages', silver: '1', gold: '2', platinum: 'Unlimited' },
                    { feature: 'Service discount', silver: '10%', gold: '20%', platinum: '30%' },
                    { feature: 'Booking priority', silver: '✓', gold: 'VIP', platinum: '24/7' },
                    { feature: 'Concierge access', silver: '—', gold: 'WhatsApp', platinum: '24/7' },
                    { feature: 'Guest privileges', silver: '—', gold: '✓', platinum: '1 free/mo' },
                    { feature: 'Home visits', silver: '—', gold: '—', platinum: '✓' },
                    { feature: 'Private room', silver: '—', gold: '—', platinum: '✓' },
                    { feature: 'Spa day', silver: '—', gold: '—', platinum: 'Monthly' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gold/10">
                      <td className="py-3.5 pr-4 font-medium text-white">{row.feature}</td>
                      <td className="py-3.5 px-4 text-center text-gray-400">{row.silver}</td>
                      <td className="py-3.5 px-4 text-center">{row.gold}</td>
                      <td className="py-3.5 pl-4 text-center">{row.platinum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas max-w-3xl">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display">Membership FAQ</motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-3">
            {membershipFaqs.map((item, idx) => (
              <div key={idx} className="surface-raised rounded-xl overflow-hidden">
                <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)} className="w-full p-5 text-left flex items-center justify-between hover:bg-white/[0.02] transition cursor-pointer">
                  <h3 className="font-bold text-[15px] heading-display pr-4 text-white">{item.q}</h3>
                  <svg className={`w-4 h-4 shrink-0 text-gray-500 transition-transform duration-300 ${expandedFaq === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 pb-5 text-gray-400 text-sm body-serif leading-relaxed border-t border-gold/15 pt-4">{item.a}</div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#111]">
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">Begin your membership journey</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto body-serif text-gray-400 leading-relaxed">Choose your tier and unlock a world of exclusive wellness benefits.</motion.p>
          <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} onClick={() => navigate('contact')} className="bg-gradient-to-r from-gold to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#0a0a0a] px-8 py-3.5 text-sm font-semibold cursor-pointer rounded-full transition-all">Get Started Today</motion.button>
        </div>
      </section>
    </div>
  );
}