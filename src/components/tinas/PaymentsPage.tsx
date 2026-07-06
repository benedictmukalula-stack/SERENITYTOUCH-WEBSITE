'use client';

import { motion } from 'framer-motion';
import { Smartphone, Building2, CreditCard, MapPin, Shield, Copy, CheckCircle, MessageCircle, Phone, AlertCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-[11px] text-gold/50 hover:text-gold transition cursor-pointer mt-1"
      title={`Copy ${label}`}
    >
      {copied ? (
        <>
          <CheckCircle className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export default function PaymentsPage() {
  const { navigate } = useAppStore();

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16" style={{ background: '#030102' }}>
        <div className="container-tinas text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">
            Payment <span className="text-pink-brand">Methods</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-pink-glow/35 max-w-2xl mx-auto body-serif font-light">
            Convenient payment options to suit you. Pay via mobile money, bank transfer, or cash at the spa.
          </motion.p>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas max-w-4xl">

          {/* Mobile Money Section */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-brand/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-pink-brand" />
              </div>
              <div>
                <h2 className="text-2xl font-bold heading-display">Mobile Money</h2>
                <p className="text-xs text-gold/40">Instant payment via MTN or Airtel</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* MTN Mobile Money */}
              <div className="surface-raised rounded-2xl p-6 glow-gold">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/25 flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-xs">MTN</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">MTN Mobile Money</h3>
                    <p className="text-[11px] text-gold/40">Dial *303# to send money</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-gold/40 uppercase tracking-wider font-semibold mb-1">Phone Number</p>
                    <p className="text-lg font-bold text-white font-mono tracking-wide">+260 761 404 555</p>
                    <CopyButton text="+260761404555" label="MTN number" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gold/40 uppercase tracking-wider font-semibold mb-1">Recipient Name</p>
                    <p className="text-sm font-semibold text-white">Taonga Phiri</p>
                  </div>
                  <div className="pt-3 border-t border-gold/10">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-gold/40 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-gold/40 body-serif font-light leading-relaxed">
                        Use your booking ID as the payment reference. Send a screenshot of your payment receipt via WhatsApp for confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Airtel Money */}
              <div className="surface-raised rounded-2xl p-6 glow-gold">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                    <span className="text-red-400 font-bold text-xs">AIRTEL</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Airtel Money</h3>
                    <p className="text-[11px] text-gold/40">Dial *544# to send money</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-gold/40 uppercase tracking-wider font-semibold mb-1">Phone Number</p>
                    <p className="text-lg font-bold text-white font-mono tracking-wide">+260 572 782 539</p>
                    <CopyButton text="+260572782539" label="Airtel number" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gold/40 uppercase tracking-wider font-semibold mb-1">Recipient Name</p>
                    <p className="text-sm font-semibold text-white">Taonga Phiri</p>
                  </div>
                  <div className="pt-3 border-t border-gold/10">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-gold/40 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-gold/40 body-serif font-light leading-relaxed">
                        Use your booking ID as the payment reference. Send a screenshot of your payment receipt via WhatsApp for confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bank Transfer Section */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="text-2xl font-bold heading-display">Bank Transfer</h2>
                <p className="text-xs text-gold/40">Direct EFT to our account</p>
              </div>
            </div>

            <div className="surface-raised rounded-2xl p-7 glow-gold">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <p className="text-[10px] text-gold/40 uppercase tracking-wider font-semibold mb-1">Account Name</p>
                  <p className="text-base font-bold text-white">Benedict Bwalya Mukalula</p>
                  <CopyButton text="Benedict Bwalya Mukalula" label="Account name" />
                </div>
                <div>
                  <p className="text-[10px] text-gold/40 uppercase tracking-wider font-semibold mb-1">Account Number</p>
                  <p className="text-base font-bold text-white font-mono tracking-wide">7291199200262</p>
                  <CopyButton text="7291199200262" label="Account number" />
                </div>
                <div>
                  <p className="text-[10px] text-gold/40 uppercase tracking-wider font-semibold mb-1">Account Type</p>
                  <p className="text-base font-semibold text-white">Current Account</p>
                </div>
                <div>
                  <p className="text-[10px] text-gold/40 uppercase tracking-wider font-semibold mb-1">Branch Code</p>
                  <p className="text-base font-bold text-white font-mono">040</p>
                  <CopyButton text="040" label="Branch code" />
                </div>
                <div>
                  <p className="text-[10px] text-gold/40 uppercase tracking-wider font-semibold mb-1">Sort Code</p>
                  <p className="text-base font-bold text-white font-mono">010040</p>
                  <CopyButton text="010040" label="Sort code" />
                </div>
                <div>
                  <p className="text-[10px] text-gold/40 uppercase tracking-wider font-semibold mb-1">Status</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-base font-semibold text-emerald-400">Active</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-gold/10">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-gold/40 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-gold/40 body-serif font-light leading-relaxed">
                    Use your booking ID as the payment reference when making the transfer. Send proof of payment (screenshot or receipt) via WhatsApp to <a href="https://wa.me/260761404555" className="text-green-400 hover:text-green-300 transition">+260 761 404 555</a> for confirmation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cash at Spa */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold heading-display">Pay at the Spa</h2>
                <p className="text-xs text-gold/40">Cash payments accepted on arrival</p>
              </div>
            </div>
            <div className="surface-raised rounded-2xl p-6">
              <p className="text-sm text-pink-glow/50 body-serif font-light leading-relaxed mb-4">
                You are welcome to pay in cash when you arrive for your appointment. We accept Kwacha notes in all denominations. Please arrive 10 minutes early to complete payment before your session begins.
              </p>
              <div className="flex items-center gap-2 text-xs text-gold/40">
                <MapPin className="w-3.5 h-3.5" />
                <span>183 Ibex Hill, Lusaka, Zambia</span>
              </div>
            </div>
          </motion.div>

          {/* Card Payment Note */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3} className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold heading-display">Card Payments</h2>
                <p className="text-xs text-gold/40">Visa and Mastercard</p>
              </div>
            </div>
            <div className="surface-raised rounded-2xl p-6">
              <p className="text-sm text-pink-glow/50 body-serif font-light leading-relaxed mb-4">
                For card payments, please contact us on WhatsApp or visit the spa in person. We accept Visa and Mastercard. For the fastest service, we recommend mobile money or bank transfer using the details above.
              </p>
              <div className="flex gap-2 items-center">
                <div className="bg-gold/8 border border-gold/8 rounded-lg px-3 py-2 text-xs text-pink-glow/45 font-bold">VISA</div>
                <div className="bg-gold/8 border border-gold/8 rounded-lg px-3 py-2 text-xs text-pink-glow/45 font-bold">MASTERCARD</div>
                <div className="ml-auto flex items-center gap-1.5 text-[10px] text-gold/40">
                  <Shield className="w-3.5 h-3.5" />
                  Secure payments
                </div>
              </div>
            </div>
          </motion.div>

          {/* How to Pay Steps */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4} className="mb-10">
            <h2 className="text-2xl font-bold heading-display mb-6">How to <span className="text-pink-brand">Pay</span></h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { step: '1', title: 'Book Your Treatment', desc: 'Fill out the booking form on our Contact page or WhatsApp us to reserve your appointment.' },
                { step: '2', title: 'Receive Booking ID', desc: 'You will receive a confirmation with your unique booking ID (e.g., ST-ABC123) via email or WhatsApp.' },
                { step: '3', title: 'Send Payment', desc: 'Use any of the payment methods above with your booking ID as reference. Send proof via WhatsApp.' },
              ].map((item, i) => (
                <div key={i} className="surface-raised rounded-2xl p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-pink-brand/15 border border-pink-brand/25 flex items-center justify-center mx-auto mb-4">
                    <span className="text-pink-brand font-bold text-sm">{item.step}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 heading-display">{item.title}</h3>
                  <p className="text-xs text-pink-glow/40 body-serif font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact for Payment Issues */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5}>
            <div className="surface-raised rounded-2xl p-7 text-center" style={{ background: 'linear-gradient(135deg, rgba(233,30,99,0.05), rgba(212,175,55,0.05))' }}>
              <h3 className="text-lg font-bold heading-display mb-2">Need Help with Payment?</h3>
              <p className="text-sm text-pink-glow/40 body-serif font-light mb-5">Contact us if you have any questions about payment or need assistance completing your transaction.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/260761404555?text=Hello%20Serenity%20Touch%20Spa.%20I%20need%20help%20with%20payment%20for%20my%20booking."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
                <a
                  href="tel:+260572782539"
                  className="flex items-center justify-center gap-2 border border-gold/20 text-gold hover:bg-gold/10 px-6 py-3 rounded-full text-sm font-semibold transition cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  Call Us
                </a>
                <a
                  href="mailto:payments@serenitytouch.co.za"
                  className="flex items-center justify-center gap-2 border border-pink-brand/30 text-pink-brand hover:bg-pink-brand/10 px-6 py-3 rounded-full text-sm font-semibold transition cursor-pointer"
                >
                  payments@serenitytouch.co.za
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CTA */}
      <section className="section-padding" style={{ background: '#030102' }}>
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4 heading-display">Ready to Book?</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-pink-glow/35 body-serif font-light mb-6 max-w-xl mx-auto">
            Choose your treatment and book your appointment today. Payment details are provided during the booking process.
          </motion.p>
          <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} onClick={() => navigate('contact')} className="btn-pink px-8 py-3.5 text-sm font-semibold cursor-pointer">
            Book Appointment
          </motion.button>
        </div>
      </section>
    </div>
  );
}