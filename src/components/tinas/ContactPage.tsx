'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Loader2, CheckCircle, AlertCircle, MessageCircle, CreditCard, Building2, Smartphone, Home, Car, Navigation } from 'lucide-react';

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
  { icon: MessageCircle, label: 'WhatsApp', value: '+260 761 404 555', link: 'https://wa.me/260761404555' },
  { icon: Mail, label: 'Email', value: 'info@serenitytouch.co.zm', link: 'mailto:info@serenitytouch.co.zm' },
  { icon: Clock, label: 'Hours', value: 'Mon-Fri: 9AM-6PM\nSat: 10AM-5PM\nSun: Closed', link: null },
];

const serviceOptions = [
  { value: 'headscalp', label: 'Head & Scalp Massage (30 min) — K400' },
  { value: 'foot', label: 'Foot Massage (45 min) — K500' },
  { value: 'backneck', label: 'Back, Neck & Shoulder (45 min) — K600' },
  { value: 'swedish', label: 'Swedish Massage (60 min) — K800' },
  { value: 'deeptissue', label: 'Deep Tissue Massage (90 min) — K1,200' },
  { value: 'thai', label: 'Thai Massage (90 min) — K1,100' },
  { value: 'aromatherapy', label: 'Aromatherapy Massage (60 min) — K900' },
  { value: 'reflexology', label: 'Reflexology (60 min) — K850' },
  { value: 'pregnancy', label: 'Pregnancy Massage (60 min) — K900' },
  { value: 'fullbody', label: 'Full Body Massage (90 min) — K1,000' },
  { value: 'couples', label: 'Couples Massage (90 min) — K2,000' },
];

const therapistOptions = [
  { value: 'any', label: 'No Preference (First Available)' },
  { value: 'tina', label: 'Tina Mulenga — Founder & Lead Therapist' },
  { value: 'grace', label: 'Grace Banda — Senior Massage Therapist' },
  { value: 'patricia', label: 'Patricia Nkomo — Aromatherapy Specialist' },
  { value: 'chipo', label: 'Chipo Mwale — Therapeutic Massage Specialist' },
];

const calloutZones = [
  { id: 'zone1', label: 'Ibex Hill & Surrounds', desc: 'Within 5km radius', fee: 200, areas: 'Ibex Hill, Woodlands, Kabulonga' },
  { id: 'zone2', label: 'Lusaka Central', desc: '5–15km from spa', fee: 350, areas: 'CBD, Northmead, Rhodes Park, Longacres' },
  { id: 'zone3', label: 'Greater Lusaka', desc: '15–30km from spa', fee: 500, areas: 'Manda Hill, East Park, Chelstone, Roma' },
  { id: 'zone4', label: 'Outside Lusaka', desc: '30km+ — custom quote', fee: 0, areas: 'Kabwe, Chongwe, Kafue, etc.' },
];

const servicePrices: Record<string, number> = { headscalp: 400, foot: 500, backneck: 600, swedish: 800, deeptissue: 1200, thai: 1100, aromatherapy: 900, reflexology: 850, pregnancy: 900, fullbody: 1000, couples: 2000 };

const paymentMethods = [
  { id: 'mobile_money', label: 'Mobile Money', icon: Smartphone, desc: 'MTN Mobile Money, Airtel Money, Zamtel' },
  { id: 'bank_transfer', label: 'Bank EFT', icon: Building2, desc: 'Direct bank transfer' },
  { id: 'card', label: 'Card Payment', icon: CreditCard, desc: 'Visa, Mastercard (online)' },
  { id: 'cash', label: 'Pay at Spa', icon: MapPin, desc: 'Cash on arrival' },
];

const faqs = [
  { q: 'How do I book an appointment?', a: 'You can book through this form, call us at +260 572 782 539, or message us on WhatsApp. Members can also use our WhatsApp concierge line for priority booking.' },
  { q: 'What is your cancellation policy?', a: 'Cancellations made 24 hours in advance receive a full refund. Cancellations within 24 hours are subject to a 50% fee. No-shows will be charged in full.' },
  { q: 'Do you offer membership plans?', a: 'Yes! We offer three membership tiers: Silver (K800/mo), Gold (K1,600/mo), and Platinum (K3,200/mo). Each includes different benefits and service inclusions.' },
  { q: 'Are your therapists certified?', a: "Yes, every therapist at Serenity Touch Spa is internationally certified and continually trained in the latest therapeutic techniques." },
  { q: 'What should I bring to my appointment?', a: 'Just bring yourself! We provide all linens, oils, and amenities. Arrive 10 minutes early to complete a brief wellness consultation.' },
  { q: 'What payment methods do you accept?', a: 'We accept MTN Mobile Money, Airtel Money, Zamtel, bank EFT, Visa/Mastercard, and cash payments at the spa.' },
];

function getServiceLabel(val: string) { return serviceOptions.find(s => s.value === val)?.label || val; }
function getTherapistLabel(val: string) { return therapistOptions.find(t => t.value === val)?.label || val; }
function getPaymentLabel(val: string) { return paymentMethods.find(p => p.id === val)?.label || val; }

function getCalloutLabel(val: string) {
  const z = calloutZones.find(z => z.id === val);
  return z ? (z.fee > 0 ? `${z.label} (K${z.fee} call-out fee)` : `${z.label} (Custom quote)`) : val;
}

function buildWhatsAppMessage(data: typeof defaultFormData): string {
  const lines = [
    `*Serenity Touch Spa — Booking Request*`, ``,
    `*Name:* ${data.name}`, `*Email:* ${data.email}`, `*Phone:* ${data.phone || 'Not provided'}`,
    `*Date:* ${data.date}`, `*Service:* ${getServiceLabel(data.service)}`,
    `*Booking Type:* ${data.bookingType === 'callout' ? 'Call-Out Service' : 'In-Spa'}`,
  ];
  if (data.bookingType === 'callout') {
    lines.push(`*Call-Out Zone:* ${getCalloutLabel(data.calloutZone)}`);
    if (data.calloutAddress) lines.push(`*Address:* ${data.calloutAddress}`);
    const svcPrice = servicePrices[data.service] || 0;
    const zone = calloutZones.find(z => z.id === data.calloutZone);
    const fee = zone?.fee || 0;
    if (fee > 0) lines.push(`*Total:* K${svcPrice} + K${fee} call-out = K${svcPrice + fee}`);
    else lines.push(`*Total:* K${svcPrice} + call-out fee (TBD)`);
  }
  lines.push(`*Therapist:* ${getTherapistLabel(data.therapist)}`, `*Payment:* ${getPaymentLabel(data.paymentMethod)}`);
  if (data.message) lines.push(`*Notes:* ${data.message}`);
  lines.push('', 'Please confirm my booking. Thank you!');
  return encodeURIComponent(lines.join('\n'));
}

const defaultFormData = { name: '', email: '', phone: '', service: '', therapist: 'any', date: '', message: '', paymentMethod: 'cash', bookingType: 'in_sanctuary', calloutZone: '', calloutAddress: '' };

export default function ContactPage() {
  const [formData, setFormData] = useState(defaultFormData);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) { setStatus('success'); setFormData(defaultFormData); setShowPayment(false); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  const handleWhatsAppBooking = () => {
    const msg = buildWhatsAppMessage(formData);
    window.open(`https://wa.me/260761404555?text=${msg}`, '_blank');
  };

  return (
    <div>
      <section className="pt-32 pb-16 section-dark">
        <div className="container-tinas text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">Get in <span className="text-pink-brand">Touch</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-pink-glow/35 max-w-2xl mx-auto body-serif font-light">Ready to relax to the experience? Book your first session with us.</motion.p>
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
                      <item.icon className="w-4 h-4 text-pink-brand" />
                      <h3 className="font-bold text-sm text-white">{item.label}</h3>
                    </div>
                    {item.link ? (
                      <a href={item.link} className="text-pink-brand hover:text-pink-light transition text-sm ml-[26px] block">{item.value}</a>
                    ) : (
                      <p className="text-pink-glow/35 text-sm ml-[26px] whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl overflow-hidden h-48 relative border border-gold/12">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=60" alt="Map location" className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="surface-raised rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-white">183 Ibex Hill, Lusaka</p>
                    <p className="text-[10px] text-pink-brand/40">View in Google Maps</p>
                  </div>
                </div>
              </div>

              {/* Call-Out Fees Quick Reference */}
              <div className="mt-6 surface-raised rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Car className="w-4 h-4 text-pink-brand" />
                  <h3 className="font-bold text-sm text-white">Call-Out Fees</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    { zone: 'Ibex Hill & Surrounds', fee: 'K200' },
                    { zone: 'Lusaka Central', fee: 'K350' },
                    { zone: 'Greater Lusaka', fee: 'K500' },
                    { zone: 'Outside Lusaka', fee: 'Quote' },
                  ].map((z, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-xs text-pink-glow/45">Zone {i + 1}</span>
                      <span className="text-xs font-bold text-gold">{z.fee}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gold/35 mt-3 body-serif font-light leading-relaxed">Members enjoy discounts. Select &quot;Call-Out&quot; in the booking form to get started.</p>
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="lg:col-span-2">
              <div className="surface-raised rounded-2xl p-7 md:p-9 glow-gold">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold heading-display">Book Your <span className="text-pink-brand">Escape</span></h2>
                  <button onClick={handleWhatsAppBooking} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer" title="Book via WhatsApp">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center">
                      <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                      <p className="text-emerald-300 font-semibold text-lg mb-2 heading-display">Thank you for your inquiry!</p>
                      <p className="text-emerald-400/70 text-sm body-serif mb-4 font-light">We&apos;ll contact you shortly to confirm your booking.</p>
                      <p className="text-emerald-400/70 text-xs mb-6">A confirmation has been sent via email and WhatsApp.</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onClick={() => setStatus('idle')} className="text-sm text-emerald-400 underline cursor-pointer">Book another session</button>
                        <button onClick={handleWhatsAppBooking} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer mx-auto sm:mx-0">
                          <MessageCircle className="w-3.5 h-3.5" /> Follow up on WhatsApp
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Full Name *</label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gold/15 rounded-xl bg-gold/8 focus:outline-none focus:border-pink-brand text-sm text-white transition placeholder:text-gold/30" placeholder="Your name" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Email *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gold/15 rounded-xl bg-gold/8 focus:outline-none focus:border-pink-brand text-sm text-white transition placeholder:text-gold/30" placeholder="your@email.com" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Phone</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gold/15 rounded-xl bg-gold/8 focus:outline-none focus:border-pink-brand text-sm text-white transition placeholder:text-gold/30" placeholder="+260 XXX XXX XXX" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Preferred Date *</label>
                          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-3 border border-gold/15 rounded-xl bg-gold/8 focus:outline-none focus:border-pink-brand text-sm text-white transition [color-scheme:dark]" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Service *</label>
                          <select name="service" value={formData.service} onChange={handleChange} required className="w-full px-4 py-3 border border-gold/15 rounded-xl bg-[#0a0508] focus:outline-none focus:border-gold text-sm text-white transition">
                            <option value="">Select a treatment</option>
                            {serviceOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Preferred Therapist</label>
                          <select name="therapist" value={formData.therapist} onChange={handleChange} className="w-full px-4 py-3 border border-gold/15 rounded-xl bg-[#0a0508] focus:outline-none focus:border-gold text-sm text-white transition">
                            {therapistOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                          </select>
                        </div>
                      </div>

                      {/* Booking Type — In-Spa vs Call-Out */}
                      <div>
                        <label className="block text-sm font-semibold text-white mb-3">Booking Location</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button type="button"
                            onClick={() => setFormData(prev => ({ ...prev, bookingType: 'in_sanctuary', calloutZone: '', calloutAddress: '' }))}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                              formData.bookingType === 'in_sanctuary'
                                ? 'border-pink-brand bg-pink-brand/10'
                                : 'border-gold/12 bg-gold/[0.04] hover:border-pink-brand/30'
                            }`}
                          >
                            <Home className={`w-5 h-5 mb-2 ${formData.bookingType === 'in_sanctuary' ? 'text-pink-brand' : 'text-pink-brand/40'}`} />
                            <p className={`text-sm font-semibold ${formData.bookingType === 'in_sanctuary' ? 'text-pink-brand' : 'text-pink-glow/45'}`}>In-Spa</p>
                            <p className="text-[11px] text-gold/40 mt-1 leading-tight">Visit us at Ibex Hill</p>
                          </button>
                          <button type="button"
                            onClick={() => setFormData(prev => ({ ...prev, bookingType: 'callout' }))}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                              formData.bookingType === 'callout'
                                ? 'border-pink-brand bg-pink-brand/10'
                                : 'border-gold/12 bg-gold/[0.04] hover:border-pink-brand/30'
                            }`}
                          >
                            <Car className={`w-5 h-5 mb-2 ${formData.bookingType === 'callout' ? 'text-pink-brand' : 'text-pink-brand/40'}`} />
                            <p className={`text-sm font-semibold ${formData.bookingType === 'callout' ? 'text-pink-brand' : 'text-pink-glow/45'}`}>Call-Out</p>
                            <p className="text-[11px] text-gold/40 mt-1 leading-tight">We come to you</p>
                          </button>
                        </div>
                      </div>

                      {/* Call-Out Zone Selection */}
                      <AnimatePresence>
                        {formData.bookingType === 'callout' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-semibold text-white mb-3">Call-Out Zone</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {calloutZones.map((zone) => (
                                    <button key={zone.id} type="button"
                                      onClick={() => setFormData(prev => ({ ...prev, calloutZone: zone.id }))}
                                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                        formData.calloutZone === zone.id
                                          ? 'border-pink-brand bg-pink-brand/10'
                                          : 'border-gold/12 bg-gold/[0.04] hover:border-pink-brand/30'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <p className={`text-sm font-semibold ${formData.calloutZone === zone.id ? 'text-pink-brand' : 'text-pink-glow/45'}`}>{zone.label}</p>
                                        <span className={`text-sm font-bold ${formData.calloutZone === zone.id ? 'text-gold' : 'text-gold/50'}`}>{zone.fee > 0 ? `K${zone.fee}` : 'Quote'}</span>
                                      </div>
                                      <p className="text-[11px] text-gold/40 leading-tight">{zone.desc} &middot; {zone.areas}</p>
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-white mb-2">Your Address *</label>
                                <div className="relative">
                                  <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                                  <input type="text" name="calloutAddress" value={formData.calloutAddress} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gold/15 rounded-xl bg-gold/8 focus:outline-none focus:border-pink-brand text-sm text-white transition placeholder:text-gold/30"
                                    placeholder="Enter your full address for the call-out" />
                                </div>
                              </div>

                              {/* Call-Out Fee Summary */}
                              <div className="surface-raised rounded-xl p-4 border-pink-brand/20">
                                <div className="flex items-center gap-2 mb-3">
                                  <Car className="w-4 h-4 text-pink-brand" />
                                  <p className="text-xs font-semibold text-pink-brand tracking-wider">CALL-OUT FEE SUMMARY</p>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-pink-glow/45">Service</span>
                                    <span className="text-white font-medium">{serviceOptions.find(s => s.value === formData.service)?.label.split('—')[0]?.trim() || 'Select a service'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-pink-glow/45">Service Price</span>
                                    <span className="text-white font-medium">K{servicePrices[formData.service] || 0}</span>
                                  </div>
                                  <div className="h-px bg-gold/10 my-1"></div>
                                  <div className="flex justify-between">
                                    <span className="text-pink-glow/45">Call-Out Fee</span>
                                    <span className="text-gold font-bold">{(() => { const z = calloutZones.find(z => z.id === formData.calloutZone); return z?.fee ? `K${z.fee}` : 'TBD'; })()}</span>
                                  </div>
                                  <div className="h-px bg-gold/10 my-1"></div>
                                  <div className="flex justify-between">
                                    <span className="text-white font-semibold">Estimated Total</span>
                                    <span className="text-gradient-gold font-bold">{(() => { const p = servicePrices[formData.service] || 0; const z = calloutZones.find(z => z.id === formData.calloutZone); const f = z?.fee || 0; return f > 0 ? `K${p + f}` : `K${p} + call-out fee`; })()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Payment Method */}
                      <div>
                        <label className="block text-sm font-semibold text-white mb-3">Payment Method</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {paymentMethods.map((pm) => (
                            <button key={pm.id} type="button"
                              onClick={() => { setFormData(prev => ({ ...prev, paymentMethod: pm.id })); setShowPayment(pm.id !== 'cash'); }}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                formData.paymentMethod === pm.id
                                  ? 'border-pink-brand bg-pink-brand/10'
                                  : 'border-gold/12 bg-gold/[0.04] hover:border-pink-brand/30'
                              }`}
                            >
                              <pm.icon className={`w-4 h-4 mb-1.5 ${formData.paymentMethod === pm.id ? 'text-pink-brand' : 'text-pink-brand/40'}`} />
                              <p className={`text-xs font-semibold ${formData.paymentMethod === pm.id ? 'text-pink-brand' : 'text-pink-glow/45'}`}>{pm.label}</p>
                              <p className="text-[10px] text-gold/40 mt-0.5 leading-tight">{pm.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Payment Panels */}
                      <AnimatePresence>
                        {showPayment && formData.paymentMethod === 'mobile_money' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="surface-raised rounded-xl p-5 space-y-4">
                              <p className="text-xs font-semibold text-pink-brand tracking-wider">MOBILE MONEY PAYMENT</p>
                              <div className="grid grid-cols-3 gap-3">
                                {[
                                  { name: 'MTN', number: '0777 123 456', color: 'border-yellow-500/30 bg-yellow-500/5' },
                                  { name: 'Airtel', number: '0977 123 456', color: 'border-red-500/30 bg-red-500/5' },
                                  { name: 'Zamtel', number: '0955 123 456', color: 'border-blue-500/30 bg-blue-500/5' },
                                ].map((network) => (
                                  <div key={network.name} className={`border rounded-lg p-3 text-center ${network.color}`}>
                                    <p className="text-xs font-bold text-white">{network.name}</p>
                                    <p className="text-[11px] text-pink-glow/35 mt-1">{network.number}</p>
                                  </div>
                                ))}
                              </div>
                              <p className="text-[11px] text-gold/50 body-serif font-light">Send payment using the reference code you receive after booking confirmation. Screenshot your payment receipt and send via WhatsApp.</p>
                            </div>
                          </motion.div>
                        )}
                        {showPayment && formData.paymentMethod === 'bank_transfer' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="surface-raised rounded-xl p-5 space-y-3">
                              <p className="text-xs font-semibold text-pink-brand tracking-wider">BANK TRANSFER DETAILS</p>
                              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                <div><span className="text-gold/50 text-xs">Bank:</span><p className="text-white font-medium">Stanbic Bank Zambia</p></div>
                                <div><span className="text-gold/50 text-xs">Account Name:</span><p className="text-white font-medium">Serenity Touch Spa Ltd</p></div>
                                <div><span className="text-gold/50 text-xs">Account Number:</span><p className="text-white font-medium font-mono">9030-XXXX-XXXX</p></div>
                                <div><span className="text-gold/50 text-xs">Branch:</span><p className="text-white font-medium">Ibex Hill, Lusaka</p></div>
                              </div>
                              <p className="text-[11px] text-gold/50 body-serif font-light">Use your booking ID as the payment reference. Send proof of payment via WhatsApp for confirmation.</p>
                            </div>
                          </motion.div>
                        )}
                        {showPayment && formData.paymentMethod === 'card' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="surface-raised rounded-xl p-5 space-y-3">
                              <p className="text-xs font-semibold text-pink-brand tracking-wider">ONLINE CARD PAYMENT</p>
                              <p className="text-sm text-pink-glow/35 body-serif font-light">After submitting your booking, you will receive a secure payment link via email and WhatsApp. We accept Visa and Mastercard.</p>
                              <div className="flex gap-2 items-center">
                                <div className="bg-gold/8 border border-gold/8 rounded-lg px-3 py-2 text-xs text-pink-glow/45">VISA</div>
                                <div className="bg-gold/8 border border-gold/8 rounded-lg px-3 py-2 text-xs text-pink-glow/45">MASTERCARD</div>
                                <div className="ml-auto flex items-center gap-1 text-[10px] text-gold/40">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                                  Secured by SSL
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Additional Notes</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gold/15 rounded-xl bg-gold/8 focus:outline-none focus:border-pink-brand text-sm text-white transition resize-none placeholder:text-gold/30" placeholder="Any special requests or preferences?" />
                      </div>

                      {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-400 text-sm"><AlertCircle className="w-4 h-4" /><span>Something went wrong. Please try again.</span></div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button type="submit" disabled={status === 'loading'} className="flex-1 btn-pink py-3.5 text-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                          {status === 'loading' ? (<><Loader2 className="w-4 h-4 animate-spin" />Processing...</>) : 'Request Booking'}
                        </button>
                        <button type="button" onClick={handleWhatsAppBooking} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-full text-sm font-semibold transition cursor-pointer">
                          <MessageCircle className="w-4 h-4" /> Book via WhatsApp
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas max-w-3xl">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display">Frequently Asked <span className="text-pink-brand">Questions</span></motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-3">
            {faqs.map((item, idx) => (
              <div key={idx} className="surface-raised rounded-xl overflow-hidden">
                <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)} className="w-full p-5 text-left flex items-center justify-between hover:bg-gold/[0.03] transition cursor-pointer">
                  <h3 className="font-bold text-[15px] heading-display pr-4 text-white">{item.q}</h3>
                  <svg className={`w-4 h-4 shrink-0 text-gold/40 transition-transform duration-300 ${expandedFaq === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 pb-5 text-pink-glow/35 text-sm body-serif leading-relaxed border-t border-gold/8 pt-4 font-light">{item.a}</div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding gradient-sexy">
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">We look forward to <span className="text-gradient-sexy">welcoming</span> you</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto body-serif text-pink-glow/35 leading-relaxed font-light">Experience the transformation that awaits you at Serenity Touch Spa.</motion.p>
        </div>
      </section>
    </div>
  );
}