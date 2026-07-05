'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const contactInfo = [
  { icon: MapPin, label: 'Address', value: '183 Ibex Hill, Lusaka, Zambia', link: null },
  { icon: Phone, label: 'Phone', value: '+260 572 782 539', link: 'tel:+260572782539' },
  { icon: Mail, label: 'Email', value: 'info@tinassanctuary.zm', link: 'mailto:info@tinassanctuary.zm' },
  { icon: Clock, label: 'Hours', value: 'Mon-Fri: 9AM-6PM\nSat: 10AM-5PM\nSun: Closed', link: null },
];

const serviceOptions = [
  { value: 'swedish', label: 'Swedish Massage (60 min) — K800' },
  { value: 'deeptissue', label: 'Deep Tissue Massage (90 min) — K1,200' },
  { value: 'hotstone', label: 'Hot Stone Therapy (75 min) — K1,000' },
  { value: 'aromatherapy', label: 'Aromatherapy Treatment (60 min) — K900' },
  { value: 'couples', label: 'Couples Massage (90 min) — K2,000' },
  { value: 'reflexology', label: 'Reflexology (60 min) — K850' },
];

const faqs = [
  { q: 'How do I book an appointment?', a: 'You can book through this form, call us at +260 572 782 539, or email info@tinassanctuary.zm. Members can also use our WhatsApp concierge line for priority booking.' },
  { q: 'What is your cancellation policy?', a: 'Cancellations made 24 hours in advance receive a full refund. Cancellations within 24 hours are subject to a 50% fee. No-shows will be charged in full.' },
  { q: 'Do you offer membership plans?', a: 'Yes! We offer three membership tiers: Silver (K800/mo), Gold (K1,600/mo), and Platinum (K3,200/mo). Each includes different benefits and service inclusions.' },
  { q: 'Are your therapists certified?', a: "Yes, every therapist at Tina's Sanctuary is internationally certified and continually trained in the latest therapeutic techniques." },
  { q: 'What should I bring to my appointment?', a: 'Just bring yourself! We provide all linens, oils, and amenities. Arrive 10 minutes early to complete a brief wellness consultation.' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', date: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) { setStatus('success'); setFormData({ name: '', email: '', phone: '', service: '', date: '', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <div>
      <section className="pt-32 pb-16" style={{ background: '#111111' }}>
        <div className="container-tinas text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">Get in Touch</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-gray-400 max-w-2xl mx-auto body-serif">Ready to begin your wellness journey? Contact us to book your first session.</motion.p>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14 mb-20">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-8 heading-display">Contact Information</h2>
              <div className="space-y-7">
                {contactInfo.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <item.icon className="w-4 h-4 text-gold" />
                      <h3 className="font-bold text-sm text-white">{item.label}</h3>
                    </div>
                    {item.link ? (
                      <a href={item.link} className="text-pink-brand hover:text-pink-400 transition text-sm ml-[26px] block">{item.value}</a>
                    ) : (
                      <p className="text-gray-400 text-sm ml-[26px] whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl overflow-hidden h-48 relative border border-gold/15">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=60" alt="Map location" className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="surface-raised rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-white">183 Ibex Hill, Lusaka</p>
                    <p className="text-[10px] text-gray-400">View in Google Maps</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="lg:col-span-2">
              <div className="surface-raised rounded-2xl p-7 md:p-9">
                <h2 className="text-2xl font-bold mb-6 heading-display">Book Your Session</h2>
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center">
                      <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                      <p className="text-emerald-300 font-semibold text-lg mb-2 heading-display">Thank you for your inquiry!</p>
                      <p className="text-emerald-400/70 text-sm body-serif">We&apos;ll contact you shortly to confirm your booking.</p>
                      <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-emerald-400 underline cursor-pointer">Book another session</button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Full Name *</label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gold/20 rounded-xl bg-white/5 focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gray-600" placeholder="Your name" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Email *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gold/20 rounded-xl bg-white/5 focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gray-600" placeholder="your@email.com" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Phone</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gold/20 rounded-xl bg-white/5 focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gray-600" placeholder="+260 XXX XXX XXX" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Preferred Date *</label>
                          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-3 border border-gold/20 rounded-xl bg-white/5 focus:outline-none focus:border-gold text-sm text-white transition [color-scheme:dark]" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Service *</label>
                        <select name="service" value={formData.service} onChange={handleChange} required className="w-full px-4 py-3 border border-gold/20 rounded-xl bg-[#1a1a1a] focus:outline-none focus:border-gold text-sm text-white transition">
                          <option value="">Select a service</option>
                          {serviceOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Additional Notes</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gold/20 rounded-xl bg-white/5 focus:outline-none focus:border-gold text-sm text-white transition resize-none placeholder:text-gray-600" placeholder="Any special requests or preferences?" />
                      </div>
                      {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-400 text-sm"><AlertCircle className="w-4 h-4" /><span>Something went wrong. Please try again.</span></div>
                      )}
                      <button type="submit" disabled={status === 'loading'} className="w-full btn-gold py-3.5 text-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                        {status === 'loading' ? (<><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>) : 'Request Booking'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: '#111111' }}>
        <div className="container-tinas max-w-3xl">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display">Frequently Asked Questions</motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-3">
            {faqs.map((item, idx) => (
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
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">We look forward to welcoming you</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto body-serif text-gray-400 leading-relaxed">Experience the transformation that awaits you at Tina&apos;s Sanctuary.</motion.p>
        </div>
      </section>
    </div>
  );
}