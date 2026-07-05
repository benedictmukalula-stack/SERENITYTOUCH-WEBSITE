'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Share2,
  CalendarCheck,
  Gift,
  Copy,
  Check,
  Users,
  Wallet,
  Clock,
  Zap,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const steps = [
  {
    icon: Share2,
    title: 'Share Your Code',
    description: 'Send your unique referral code to friends and family.',
    color: 'from-pink-brand to-pink-deep',
  },
  {
    icon: CalendarCheck,
    title: 'Friend Books',
    description: 'Your friend uses the code when booking their first treatment.',
    color: 'from-gold to-gold-dark',
  },
  {
    icon: Gift,
    title: 'Both Get K200 Off',
    description: 'You each receive K200 off your next treatment instantly.',
    color: 'from-pink-hot to-pink-brand',
  },
];

const stats = [
  {
    icon: Users,
    label: 'Friends Referred',
    value: '3',
    accent: 'text-pink-brand',
  },
  {
    icon: Wallet,
    label: 'Earned',
    value: 'K600',
    accent: 'text-gradient-gold',
  },
  {
    icon: Clock,
    label: 'Pending',
    value: '2',
    accent: 'text-gold-light',
  },
];

const REFERRAL_CODE = 'ST-CHIPO-2026';
const TOTAL_FOR_REWARD = 5;
const CURRENT_REFERRALS = 3;

export default function ReferralProgram() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const progressPercent = (CURRENT_REFERRALS / TOTAL_FOR_REWARD) * 100;

  return (
    <div>
      {/* Header */}
      <section className="pt-32 pb-16 section-dark">
        <div className="container-tinas text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display"
          >
            REFERRALS
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display"
          >
            Share the <span className="text-gradient-sexy">Serenity</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-pink-glow/40 max-w-2xl mx-auto body-serif font-light"
          >
            Refer a friend and both of you receive K200 off your next treatment. Wellness is
            better shared.
          </motion.p>
        </div>
      </section>

      {/* Referral Code */}
      <section className="section-padding surface-base">
        <div className="container-tinas max-w-2xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="surface-raised rounded-2xl p-8 text-center glow-gold"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-brand/20 to-gold/10 border border-gold/15 flex items-center justify-center mx-auto mb-5">
              <Share2 className="w-7 h-7 text-gold" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold heading-display mb-2">
              Your Referral Code
            </h2>
            <p className="text-pink-glow/40 text-sm body-serif font-light mb-6">
              Share this code with friends. When they book, you both win.
            </p>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-black/50 border border-gold/20 rounded-xl px-6 py-3 font-mono text-xl md:text-2xl tracking-[0.15em] text-gold-light heading-display">
                {REFERRAL_CODE}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-all duration-300 ${
                  copied
                    ? 'bg-green-900/40 border border-green-500/30 text-green-400'
                    : 'bg-gradient-to-br from-pink-brand to-pink-deep text-white hover:shadow-lg hover:shadow-pink-brand/30'
                }`}
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </motion.button>
            </div>

            {copied && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400/80 text-xs font-medium mb-4"
              >
                ✓ Code copied to clipboard
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding section-dark">
        <div className="container-tinas">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-center mb-12 heading-display"
          >
            How It <span className="text-pink-brand">Works</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                custom={idx + 1}
                className="text-center"
              >
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />
                  )}
                </div>
                <span className="text-[10px] text-gold/40 font-bold tracking-[0.2em] uppercase mb-2 block">
                  Step {idx + 1}
                </span>
                <h3 className="text-lg font-bold heading-display mb-2">{step.title}</h3>
                <p className="text-pink-glow/40 text-sm body-serif font-light leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding surface-base">
        <div className="container-tinas max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="grid grid-cols-3 gap-4 md:gap-6 mb-10"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={idx + 1}
                className="surface-raised rounded-2xl p-5 md:p-6 text-center"
              >
                <stat.icon className="w-5 h-5 text-pink-brand/50 mx-auto mb-3" />
                <p className={`text-2xl md:text-3xl font-bold heading-display mb-1 ${stat.accent}`}>
                  {stat.value}
                </p>
                <p className="text-[11px] text-pink-glow/35 uppercase tracking-wider font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress to free massage */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={4}
            className="surface-raised rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-pink-brand/10 border border-gold/15 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-sm heading-display text-white">
                    Free Massage Progress
                  </h3>
                  <p className="text-[11px] text-pink-glow/35 body-serif font-light">
                    Refer {TOTAL_FOR_REWARD} friends = 1 free massage
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-gold heading-display">
                {CURRENT_REFERRALS}/{TOTAL_FOR_REWARD}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-pink-glow/30 mt-2.5 body-serif font-light">
              {TOTAL_FOR_REWARD - CURRENT_REFERRALS} more referral{TOTAL_FOR_REWARD - CURRENT_REFERRALS !== 1 ? 's' : ''} to
              unlock your free 60-minute massage
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}