'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Calendar, Crown, Armchair, Send, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const corporateServices = [
  { icon: Users, title: 'Employee Wellness Days', desc: 'On-site or in-spa wellness days for your team. Mini massages, stress relief stations, and guided relaxation sessions designed to boost morale and productivity.' },
  { icon: Building2, title: 'Hotel Partnerships', desc: 'Premium spa services for your hotel guests. We provide trained therapists, premium products, and a complete spa experience that elevates your hospitality offering.' },
  { icon: Calendar, title: 'Conference Wellness Services', desc: 'Add a wellness dimension to your conferences and events. Chair massage stations, aromatherapy breaks, and mindfulness sessions that keep attendees refreshed and engaged.' },
  { icon: Crown, title: 'Executive Wellness Programs', desc: 'Dedicated wellness plans for senior leadership. Personalized treatment programs, quarterly wellness consultations, and priority access to our premium services.' },
  { icon: Armchair, title: 'On-Site Chair Massage', desc: 'Professional seated massage at your workplace. No oils, no undressing — just immediate stress relief. Perfect for busy offices looking to invest in employee wellbeing.' },
];

export default function CorporatePage() {
  const { navigate } = useAppStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({ company: '', contact: '', email: '', phone: '', employees: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      navigate('contact');
    }, 2000);
  };

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <section className="pt-32 pb-16 section-dark">
        <div className="container-tinas text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display">FOR ORGANIZATIONS</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">Corporate Wellness <span className="text-gradient-sexy">Programs</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-pink-glow/40 max-w-2xl mx-auto body-serif font-light">Invest in your most valuable asset — your people. Our corporate wellness programs are designed to reduce stress, boost productivity, and create a culture of wellbeing.</motion.p>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={0} className="space-y-5 text-pink-glow/45 body-serif font-light leading-relaxed">
              <p>In today&apos;s high-pressure work environment, employee wellness is no longer a perk — it&apos;s a strategic investment. Organizations that prioritize wellness see measurable improvements in productivity, retention, and workplace satisfaction.</p>
              <p>At Serenity Touch Spa, we partner with forward-thinking organizations across Lusaka to deliver bespoke wellness experiences. Whether you&apos;re looking for a one-off wellness day or an ongoing corporate partnership, we&apos;ll design a program that fits your team&apos;s unique needs and budget.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold heading-display">Our Corporate <span className="text-pink-brand">Services</span></motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-pink-glow/35 mt-4 max-w-2xl mx-auto body-serif font-light">Comprehensive wellness solutions tailored for organizations of every size.</motion.p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corporateServices.map((service, idx) => (
              <motion.div key={service.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={idx}>
                <div className="surface-raised rounded-2xl p-7 h-full hover:border-gold/25 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-brand/20 to-gold/10 border border-gold/15 flex items-center justify-center mb-5 group-hover:border-pink-brand/30 transition-colors">
                    <service.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 heading-display">{service.title}</h3>
                  <p className="text-pink-glow/35 text-sm body-serif font-light leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={0} className="surface-raised rounded-2xl p-8 md:p-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 heading-display">Request a <span className="text-pink-brand">Quote</span></h2>
              <p className="text-pink-glow/35 mb-8 body-serif font-light leading-relaxed">Tell us about your organization and we&apos;ll craft a tailored wellness proposal within 24 hours.</p>

              {formSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gold mx-auto mb-4" />
                  <h3 className="text-2xl font-bold heading-display mb-2">Quote Request Received</h3>
                  <p className="text-pink-glow/40 body-serif font-light">Redirecting you to our contact page&hellip;</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-gold/50 tracking-wider uppercase mb-2 block">Company Name</label>
                      <input type="text" required value={form.company} onChange={(e) => updateField('company', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gold/15 bg-gold/[0.04] focus:outline-none focus:border-pink-brand text-sm body-serif font-light text-white placeholder:text-gold/30 transition" placeholder="Your company" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gold/50 tracking-wider uppercase mb-2 block">Contact Person</label>
                      <input type="text" required value={form.contact} onChange={(e) => updateField('contact', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gold/15 bg-gold/[0.04] focus:outline-none focus:border-pink-brand text-sm body-serif font-light text-white placeholder:text-gold/30 transition" placeholder="Full name" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gold/50 tracking-wider uppercase mb-2 block">Email</label>
                      <input type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gold/15 bg-gold/[0.04] focus:outline-none focus:border-pink-brand text-sm body-serif font-light text-white placeholder:text-gold/30 transition" placeholder="email@company.com" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gold/50 tracking-wider uppercase mb-2 block">Phone</label>
                      <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gold/15 bg-gold/[0.04] focus:outline-none focus:border-pink-brand text-sm body-serif font-light text-white placeholder:text-gold/30 transition" placeholder="+260 XXX XXX XXX" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gold/50 tracking-wider uppercase mb-2 block">Number of Employees</label>
                    <select value={form.employees} onChange={(e) => updateField('employees', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gold/15 bg-gold/[0.04] focus:outline-none focus:border-pink-brand text-sm body-serif font-light text-white transition appearance-none">
                      <option value="" className="bg-[#0a0508]">Select range</option>
                      <option value="1-10" className="bg-[#0a0508]">1–10</option>
                      <option value="11-50" className="bg-[#0a0508]">11–50</option>
                      <option value="51-200" className="bg-[#0a0508]">51–200</option>
                      <option value="201-500" className="bg-[#0a0508]">201–500</option>
                      <option value="500+" className="bg-[#0a0508]">500+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gold/50 tracking-wider uppercase mb-2 block">Message</label>
                    <textarea rows={4} value={form.message} onChange={(e) => updateField('message', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gold/15 bg-gold/[0.04] focus:outline-none focus:border-pink-brand text-sm body-serif font-light text-white placeholder:text-gold/30 transition resize-none" placeholder="Tell us about your wellness goals..."></textarea>
                  </div>
                  <button type="submit" className="btn-pink px-8 py-3.5 text-sm font-semibold cursor-pointer inline-flex items-center gap-2">
                    <Send className="w-4 h-4" /> Request a Quote
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-8 heading-display">Why Choose <span className="text-pink-brand">Us</span></motion.h2>
            <motion.div variants={fadeUp} custom={1} className="space-y-4">
              {[
                { title: 'Certified Professionals', desc: 'All therapists are internationally certified with years of corporate wellness experience.' },
                { title: 'Flexible Programs', desc: 'From half-day wellness events to year-long partnerships — we adapt to your needs.' },
                { title: 'Measurable Results', desc: 'We provide post-event wellness surveys and productivity impact reports.' },
                { title: 'Premium Products', desc: 'We use only the finest locally-sourced and imported wellness products.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0 mt-0.5"><span className="text-gold text-xs">✦</span></div>
                  <div><p className="font-semibold text-sm text-white">{item.title}</p><p className="text-sm text-pink-glow/35 body-serif font-light">{item.desc}</p></div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding gradient-sexy">
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">Elevate Your <span className="text-gradient-sexy">Workplace</span></motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto body-serif text-pink-glow/40 leading-relaxed font-light">Start the conversation and discover how wellness can transform your organization.</motion.p>
          <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} onClick={() => navigate('contact')} className="btn-pink px-8 py-3.5 text-sm font-semibold cursor-pointer">Get in Touch</motion.button>
        </div>
      </section>
    </div>
  );
}