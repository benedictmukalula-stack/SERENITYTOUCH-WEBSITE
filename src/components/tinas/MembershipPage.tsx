'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, Car, MapPin } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const plans = [
  { name: 'Silver', tagline: 'A taste of indulgence', price: 'K800', icon: Sparkles, gradient: 'from-gray-400 to-gray-500', features: ['1 sensual massage per month', '10% off additional services', 'Priority booking', 'Birthday treat', 'Access to member lounge', 'Monthly wellness newsletter'], popular: false },
  { name: 'Gold', tagline: 'For the devoted', price: 'K1,600', icon: Crown, gradient: 'from-pink-brand to-pink-deep', features: ['2 massages per month', '20% off all services', 'VIP booking', 'Free aromatherapy upgrade', 'Quarterly wellness consult', 'Guest privileges', 'WhatsApp concierge', 'Exclusive events access'], popular: true },
  { name: 'Platinum', tagline: 'The ultimate surrender', price: 'K3,200', icon: Crown, gradient: 'from-gold to-pink-hot', features: ['Unlimited massages', '30% off everything', '24/7 concierge', 'Personal wellness plan', 'Private therapy suite', 'Monthly spa day', 'Home visit service', 'Airport pickup', 'Priority WhatsApp line', 'Annual retreat invitation'], popular: false },
];

const membershipFaqs = [
  { q: 'How do I sign up?', a: 'Sign up through our contact form, call us directly, or visit our sanctuary in Ibex Hill. Our team will guide you through the process and find your perfect tier.' },
  { q: 'Can I upgrade or downgrade?', a: 'Yes! Change your tier at any time. Upgrades take effect immediately; downgrades apply at your next billing cycle.' },
  { q: 'What if I don\'t use all my monthly massages?', a: 'Unused massages roll over for one month for Gold members and indefinitely for Platinum members.' },
  { q: 'Is there a cancellation fee?', a: 'Cancel with 30 days notice. No fee for memberships held for 3 months or longer.' },
  { q: 'Can I share my benefits?', a: 'Gold and Platinum members have guest privileges. Platinum members receive one complimentary guest session per month.' },
  { q: 'How do call-out fees work for members?', a: 'Silver members pay standard call-out fees (K200\u2013K500). Gold members get 25% off all call-out fees. Platinum members enjoy free call-outs within Lusaka (Zones 1\u20133) and 50% off for Zone 4 (outside Lusaka).' },
];

export default function MembershipPage() {
  const { navigate } = useAppStore();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div>
      <section className="pt-32 pb-16 section-dark">
        <div className="container-tinas text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display">MEMBERSHIP</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">Invest in Your <span className="text-gradient-sexy">Pleasure</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-pink-glow/40 max-w-2xl mx-auto body-serif font-light">Choose the tier that fits your desires. Every level unlocks exclusive benefits and priority access.</motion.p>
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
                      <span className="bg-gradient-to-r from-gold to-pink-brand text-black px-5 py-1.5 rounded-full text-[10px] font-bold tracking-wider shadow-lg shadow-pink-brand/30">MOST DESIRED</span>
                    </div>
                  )}
                  <div className={`surface-raised rounded-2xl p-8 h-full transition-all duration-500 hover:border-pink-brand/30 relative overflow-hidden ${selectedPlan === plan.name ? 'border-gold ring-4 ring-gold/10 shadow-xl shadow-gold/5' : plan.popular ? 'border-gold/30 glow-gold' : ''}`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.gradient} opacity-[0.06] rounded-bl-full`} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}><plan.icon className="w-5 h-5 text-white" /></div>
                        <h3 className="text-2xl font-bold heading-display">{plan.name}</h3>
                      </div>
                      <p className="text-pink-glow/35 mb-6 text-sm font-light">{plan.tagline}</p>
                      <div className="mb-8">
                        <span className="text-4xl font-bold text-gold">{plan.price}</span>
                        <span className="text-gold/50 ml-1 text-sm">/month</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-pink-brand mt-0.5 shrink-0" />
                            <span className="text-sm text-pink-glow/60 font-light">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => { setSelectedPlan(plan.name); navigate('contact'); }}
                        className={`w-full py-3 text-sm font-semibold cursor-pointer transition-all ${plan.popular ? 'bg-gradient-to-r from-pink-brand to-pink-hot hover:from-pink-hot hover:to-pink-brand text-white rounded-full shadow-lg shadow-pink-brand/20' : 'btn-gold'}`}>
                        {selectedPlan === plan.name ? 'Selected ✓' : 'Indulge Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Call-Out Benefits */}
      <section className="section-padding surface-base">
        <div className="container-tinas max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-3">
              <Car className="w-6 h-6 text-pink-brand" />
              <h2 className="text-3xl md:text-4xl font-bold heading-display">Member <span className="text-pink-brand">Call-Out</span> Perks</h2>
            </motion.div>
            <motion.p variants={fadeUp} custom={1} className="text-pink-glow/35 mb-8 font-light body-serif leading-relaxed">Members enjoy exclusive call-out benefits that make our mobile service even more rewarding.</motion.p>
            <motion.div variants={fadeUp} custom={2} className="grid md:grid-cols-3 gap-6">
              <div className="surface-raised rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center mx-auto mb-4"><Sparkles className="w-6 h-6 text-white" /></div>
                <h3 className="text-lg font-bold heading-display mb-2">Silver</h3>
                <p className="text-2xl font-bold text-gradient-gold mb-2">K200</p>
                <p className="text-xs text-pink-glow/35 body-serif font-light">Standard call-out fees apply. K200–K500 depending on zone.</p>
              </div>
              <div className="surface-raised rounded-2xl p-6 text-center border-pink-brand/20 glow-gold">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-brand to-pink-deep flex items-center justify-center mx-auto mb-4"><Crown className="w-6 h-6 text-white" /></div>
                <h3 className="text-lg font-bold heading-display mb-2 text-pink-brand">Gold</h3>
                <p className="text-2xl font-bold text-gradient-gold mb-2">K150</p>
                <p className="text-xs text-pink-glow/35 body-serif font-light">25% off all call-out fees across every zone.</p>
              </div>
              <div className="surface-raised rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-pink-hot flex items-center justify-center mx-auto mb-4"><Crown className="w-6 h-6 text-white" /></div>
                <h3 className="text-lg font-bold heading-display mb-2">Platinum</h3>
                <p className="text-2xl font-bold text-gradient-gold mb-2">FREE</p>
                <p className="text-xs text-pink-glow/35 body-serif font-light">All call-out fees waived within Lusaka. Zone 4 at 50% off.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} custom={3} className="mt-6 surface-raised rounded-xl p-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white mb-1">Call-Out Zones &amp; Standard Fees</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {[
                      { zone: 'Ibex Hill & Surrounds', fee: 'K200' },
                      { zone: 'Lusaka Central', fee: 'K350' },
                      { zone: 'Greater Lusaka', fee: 'K500' },
                      { zone: 'Outside Lusaka', fee: 'Custom' },
                    ].map((z, i) => (
                      <div key={i} className="bg-gold/[0.04] rounded-lg p-3">
                        <p className="text-[10px] text-gold/50 uppercase tracking-wider">Zone {i + 1}</p>
                        <p className="text-xs text-white font-medium mt-0.5">{z.zone}</p>
                        <p className="text-sm font-bold text-gold mt-1">{z.fee}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Member Call-Out Benefits */}
      <section className="section-padding surface-base">
        <div className="container-tinas max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-3">
              <Car className="w-6 h-6 text-pink-brand" />
              <h2 className="text-3xl md:text-4xl font-bold heading-display">Member <span className="text-pink-brand">Call-Out</span> Perks</h2>
            </motion.div>
            <motion.p variants={fadeUp} custom={1} className="text-pink-glow/35 mb-8 font-light body-serif leading-relaxed">Members enjoy exclusive call-out benefits that make our mobile service even more rewarding.</motion.p>
            <motion.div variants={fadeUp} custom={2} className="grid md:grid-cols-3 gap-6">
              <div className="surface-raised rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center mx-auto mb-4"><Sparkles className="w-6 h-6 text-white" /></div>
                <h3 className="text-lg font-bold heading-display mb-2">Silver</h3>
                <p className="text-2xl font-bold text-gradient-gold mb-2">Standard</p>
                <p className="text-xs text-pink-glow/35 body-serif font-light">Standard call-out fees apply. K200&ndash;K500 depending on zone.</p>
              </div>
              <div className="surface-raised rounded-2xl p-6 text-center border-pink-brand/20 glow-gold">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-brand to-pink-deep flex items-center justify-center mx-auto mb-4"><Crown className="w-6 h-6 text-white" /></div>
                <h3 className="text-lg font-bold heading-display mb-2 text-pink-brand">Gold</h3>
                <p className="text-2xl font-bold text-gradient-gold mb-2">25% Off</p>
                <p className="text-xs text-pink-glow/35 body-serif font-light">25% off all call-out fees across every zone.</p>
              </div>
              <div className="surface-raised rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-pink-hot flex items-center justify-center mx-auto mb-4"><Crown className="w-6 h-6 text-white" /></div>
                <h3 className="text-lg font-bold heading-display mb-2">Platinum</h3>
                <p className="text-2xl font-bold text-gradient-gold mb-2">FREE</p>
                <p className="text-xs text-pink-glow/35 body-serif font-light">All call-out fees waived within Lusaka. Zone 4 at 50% off.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} custom={3} className="mt-6 surface-raised rounded-xl p-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white mb-1">Call-Out Zones &amp; Standard Fees</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {[
                      { zone: 'Ibex Hill & Surrounds', fee: 'K200' },
                      { zone: 'Lusaka Central', fee: 'K350' },
                      { zone: 'Greater Lusaka', fee: 'K500' },
                      { zone: 'Outside Lusaka', fee: 'Custom' },
                    ].map((z, i) => (
                      <div key={i} className="bg-gold/[0.04] rounded-lg p-3">
                        <p className="text-[10px] text-gold/50 uppercase tracking-wider">Zone {i + 1}</p>
                        <p className="text-xs text-white font-medium mt-0.5">{z.zone}</p>
                        <p className="text-sm font-bold text-gold mt-1">{z.fee}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding section-dark">
        <div className="container-tinas max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display">Compare <span className="text-pink-brand">Tiers</span></motion.h2>
            <motion.div variants={fadeUp} custom={1} className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15">
                    <th className="text-left py-4 pr-4 text-pink-glow/40 font-medium">Feature</th>
                    <th className="text-center py-4 px-4 heading-display font-bold">Silver</th>
                    <th className="text-center py-4 px-4 heading-display font-bold text-pink-brand">Gold</th>
                    <th className="text-center py-4 pl-4 heading-display font-bold">Platinum</th>
                  </tr>
                </thead>
                <tbody className="text-pink-glow/60">
                  {[
                    { feature: 'Monthly massages', silver: '1', gold: '2', platinum: 'Unlimited' },
                    { feature: 'Service discount', silver: '10%', gold: '20%', platinum: '30%' },
                    { feature: 'Booking priority', silver: '✓', gold: 'VIP', platinum: '24/7' },
                    { feature: 'Concierge access', silver: '—', gold: 'WhatsApp', platinum: '24/7' },
                    { feature: 'Guest privileges', silver: '—', gold: '✓', platinum: '1 free/mo' },
                    { feature: 'Call-out discount', silver: 'Standard', gold: '25% off', platinum: 'FREE' },
                    { feature: 'Home visits', silver: '—', gold: '—', platinum: '✓' },
                    { feature: 'Private room', silver: '—', gold: '—', platinum: '✓' },
                    { feature: 'Spa day', silver: '—', gold: '—', platinum: 'Monthly' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gold/8">
                      <td className="py-3.5 pr-4 font-medium text-white">{row.feature}</td>
                      <td className="py-3.5 px-4 text-center text-pink-brand/40">{row.silver}</td>
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
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display">Membership <span className="text-pink-brand">FAQ</span></motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-3">
            {membershipFaqs.map((item, idx) => (
              <div key={idx} className="surface-raised rounded-xl overflow-hidden">
                <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)} className="w-full p-5 text-left flex items-center justify-between hover:bg-pink-brand/[0.03] transition cursor-pointer">
                  <h3 className="font-bold text-[15px] heading-display pr-4 text-white">{item.q}</h3>
                  <svg className={`w-4 h-4 shrink-0 text-gold/40 transition-transform duration-300 ${expandedFaq === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 pb-5 text-pink-glow/40 text-sm body-serif leading-relaxed border-t border-gold/8 pt-4 font-light">{item.a}</div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding gradient-sexy">
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">Begin your <span className="text-gradient-sexy">journey</span></motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto body-serif text-pink-glow/40 leading-relaxed font-light">Choose your tier and unlock a world of exclusive wellness indulgence.</motion.p>
          <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} onClick={() => navigate('contact')} className="btn-pink px-8 py-3.5 text-sm font-semibold cursor-pointer">Indulge Now</motion.button>
        </div>
      </section>
    </div>
  );
}