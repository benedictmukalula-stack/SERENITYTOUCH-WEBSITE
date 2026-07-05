'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, Mail, Printer, Sparkles, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const voucherValues = [
  { value: 'K500', label: 'Perfect for a treat' },
  { value: 'K800', label: 'A single massage' },
  { value: 'K1,000', label: 'A premium service' },
  { value: 'K1,500', label: 'A full experience' },
  { value: 'K2,000', label: 'A couple\'s treat' },
  { value: 'K3,000', label: 'A luxury escape' },
  { value: 'K5,000', label: 'The royal treatment' },
];

const packageVouchers = [
  { name: 'Serenity Signature', price: 'K1,500', duration: '90 min' },
  { name: 'Serenity Escape', price: 'K2,200', duration: '2 hours' },
  { name: 'Thai Wellness Journey', price: 'K2,500', duration: '2 hours' },
  { name: 'Couples Retreat', price: 'K4,000', duration: '2.5 hours' },
];

export default function VouchersPage() {
  const { navigate } = useAppStore();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<'email' | 'print'>('email');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div>
      <section className="pt-32 pb-16 section-dark">
        <div className="container-tinas text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display">GIFT VOUCHERS</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">Gift the Gift of <span className="text-gradient-sexy">Wellness</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-pink-glow/40 max-w-2xl mx-auto body-serif font-light">Give someone you care about the ultimate relaxation. Our luxury gift vouchers are beautifully presented and valid for 12 months from purchase.</motion.p>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={0} className="space-y-5 text-pink-glow/45 body-serif font-light leading-relaxed">
              <p>There&apos;s no greater gift than the gift of relaxation. Whether it&apos;s for a birthday, anniversary, or simply to show you care, a Serenity Touch Spa voucher opens the door to an unforgettable wellness experience.</p>
              <p>Each voucher comes in our signature luxury presentation — a gold-embossed card with a personalized message, elegantly packaged and ready to delight. Vouchers can be redeemed against any service or package at our Ibex Hill spa.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold heading-display">Choose Your <span className="text-pink-brand">Value</span></motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-pink-glow/35 mt-4 max-w-2xl mx-auto body-serif font-light">Select a pre-set value or choose a custom amount. Every voucher is beautifully presented.</motion.p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {voucherValues.map((v, idx) => (
              <motion.div key={v.value} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-20px' }} variants={fadeUp} custom={idx}>
                <button onClick={() => setSelectedValue(v.value)}
                  className={`w-full surface-raised rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer group h-full ${selectedValue === v.value ? 'border-pink-brand glow-pink ring-1 ring-pink-brand/30' : 'hover:border-gold/25'}`}>
                  <Gift className={`w-7 h-7 mx-auto mb-3 transition-colors ${selectedValue === v.value ? 'text-pink-brand' : 'text-gold/50 group-hover:text-gold'}`} />
                  <p className={`text-2xl font-bold mb-1 heading-display transition-colors ${selectedValue === v.value ? 'text-pink-brand' : 'text-gradient-gold'}`}>{v.value}</p>
                  <p className="text-xs text-pink-glow/35 body-serif font-light">{v.label}</p>
                </button>
              </motion.div>
            ))}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-20px' }} variants={fadeUp} custom={7}>
              <button onClick={() => setSelectedValue('custom')}
                className={`w-full surface-raised rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer group h-full ${selectedValue === 'custom' ? 'border-pink-brand glow-pink ring-1 ring-pink-brand/30' : 'hover:border-gold/25'}`}>
                <Star className={`w-7 h-7 mx-auto mb-3 transition-colors ${selectedValue === 'custom' ? 'text-pink-brand' : 'text-gold/50 group-hover:text-gold'}`} />
                <p className={`text-2xl font-bold mb-1 heading-display transition-colors ${selectedValue === 'custom' ? 'text-pink-brand' : 'text-white'}`}>Custom</p>
                <p className="text-xs text-pink-glow/35 body-serif font-light">Any amount</p>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold heading-display">Package <span className="text-pink-brand">Vouchers</span></motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-pink-glow/35 mt-4 max-w-2xl mx-auto body-serif font-light">Gift a complete wellness journey with our curated package vouchers.</motion.p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {packageVouchers.map((pkg, idx) => (
              <motion.div key={pkg.name} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-20px' }} variants={fadeUp} custom={idx}>
                <div className="surface-raised rounded-2xl p-6 h-full hover:border-gold/25 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-brand/20 to-gold/10 border border-gold/15 flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-base font-bold mb-1 heading-display">{pkg.name}</h3>
                  <p className="text-xs text-gold/50 mb-3">{pkg.duration}</p>
                  <p className="text-xl font-bold text-gradient-gold mb-4">{pkg.price}</p>
                  <button onClick={() => { setSelectedValue(pkg.price); navigate('contact'); }} className="btn-outline-gold w-full py-2.5 text-xs cursor-pointer">Gift This Package</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={0} className="text-center mb-10">
              <Heart className="w-8 h-8 text-pink-brand mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold heading-display mb-3">Personalize Your <span className="text-pink-brand">Voucher</span></h2>
              <p className="text-pink-glow/35 body-serif font-light">Add a personal touch to make your gift even more special.</p>
            </motion.div>
            <motion.div variants={fadeUp} custom={1} className="surface-raised rounded-2xl p-8 md:p-10">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-gold/50 tracking-wider uppercase mb-2 block">Recipient&apos;s Name</label>
                  <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gold/15 bg-gold/[0.04] focus:outline-none focus:border-pink-brand text-sm body-serif font-light text-white placeholder:text-gold/30 transition" placeholder="Who is this gift for?" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gold/50 tracking-wider uppercase mb-2 block">Personal Message</label>
                  <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gold/15 bg-gold/[0.04] focus:outline-none focus:border-pink-brand text-sm body-serif font-light text-white placeholder:text-gold/30 transition resize-none" placeholder="Write a heartfelt message..."></textarea>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gold/50 tracking-wider uppercase mb-3 block">Delivery Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setDelivery('email')}
                      className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border cursor-pointer transition-all ${delivery === 'email' ? 'border-pink-brand bg-pink-brand/[0.08] glow-pink' : 'border-gold/15 hover:border-gold/25'}`}>
                      <Mail className={`w-5 h-5 ${delivery === 'email' ? 'text-pink-brand' : 'text-gold/50'}`} />
                      <span className={`text-sm font-medium ${delivery === 'email' ? 'text-white' : 'text-pink-glow/50'}`}>Email</span>
                    </button>
                    <button onClick={() => setDelivery('print')}
                      className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border cursor-pointer transition-all ${delivery === 'print' ? 'border-pink-brand bg-pink-brand/[0.08] glow-pink' : 'border-gold/15 hover:border-gold/25'}`}>
                      <Printer className={`w-5 h-5 ${delivery === 'print' ? 'text-pink-brand' : 'text-gold/50'}`} />
                      <span className={`text-sm font-medium ${delivery === 'print' ? 'text-white' : 'text-pink-glow/50'}`}>Print at Home</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-8 heading-display">Voucher <span className="text-pink-brand">Details</span></motion.h2>
            <motion.div variants={fadeUp} custom={1} className="surface-raised rounded-2xl p-8 md:p-10">
              <div className="space-y-5">
                {[
                  { title: '12-Month Validity', desc: 'All vouchers are valid for 12 months from the date of purchase.' },
                  { title: 'Redeemable on Any Service', desc: 'Use your voucher for any treatment, package, or product at our spa.' },
                  { title: 'Luxury Presentation', desc: 'Each voucher arrives in our signature gold-embossed card with envelope.' },
                  { title: 'No Expiry Fees', desc: 'Full face value is redeemable — no hidden fees or deductions.' },
                  { title: 'Transferable', desc: 'Vouchers can be gifted or transferred to another recipient.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0 mt-0.5"><span className="text-gold text-xs">✦</span></div>
                    <div><p className="font-semibold text-sm text-white">{item.title}</p><p className="text-sm text-pink-glow/35 body-serif font-light">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding gradient-sexy">
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">Ready to <span className="text-gradient-sexy">delight</span> someone?</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto body-serif text-pink-glow/40 leading-relaxed font-light">Purchase your gift voucher and give the gift of luxury wellness today.</motion.p>
          <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} onClick={() => navigate('contact')} className="btn-pink px-8 py-3.5 text-sm font-semibold cursor-pointer">Purchase a Voucher</motion.button>
        </div>
      </section>
    </div>
  );
}