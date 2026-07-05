'use client';

import { motion } from 'framer-motion';
import {
  Crown,
  TrendingUp,
  Star,
  MessageSquare,
  UserPlus,
  Cake,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Headphones,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const CURRENT_POINTS = 1250;
const TIER_POINTS = 2000;
const NEXT_TIER = 'Platinum';

const pointsHistory = [
  {
    id: 1,
    points: '+100',
    description: 'Deep Tissue Massage',
    date: 'Jul 1',
    type: 'earn' as const,
  },
  {
    id: 2,
    points: '+50',
    description: 'Left a review',
    date: 'Jun 28',
    type: 'earn' as const,
  },
  {
    id: 3,
    points: '+150',
    description: 'Couples Retreat',
    date: 'Jun 25',
    type: 'earn' as const,
  },
  {
    id: 4,
    points: '-200',
    description: 'Redeemed for free scalp treatment',
    date: 'Jun 20',
    type: 'redeem' as const,
  },
];

const earnWays = [
  { icon: TrendingUp, text: 'K1 spent = 1 point' },
  { icon: MessageSquare, text: 'Leave a review = 50 pts' },
  { icon: UserPlus, text: 'Refer a friend = 200 pts' },
  { icon: Cake, text: 'Birthday visit = 100 pts bonus' },
];

const redeemOptions = [
  {
    points: 500,
    reward: 'K100 off',
    icon: Gift,
    gradient: 'from-gold/20 to-gold-dark/10',
    border: 'border-gold/20',
  },
  {
    points: 1000,
    reward: 'Free Head Massage',
    icon: Headphones,
    gradient: 'from-pink-brand/20 to-pink-deep/10',
    border: 'border-pink-brand/20',
  },
  {
    points: 2000,
    reward: 'Free 60min Massage',
    icon: Sparkles,
    gradient: 'from-gold to-pink-hot/20',
    border: 'border-gold/30',
    highlight: true,
  },
];

export default function LoyaltyPoints() {
  const tierProgress = (CURRENT_POINTS / TIER_POINTS) * 100;
  const pointsToNext = TIER_POINTS - CURRENT_POINTS;

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
            LOYALTY REWARDS
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display"
          >
            Your <span className="text-gradient-sexy">Points</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-pink-glow/40 max-w-2xl mx-auto body-serif font-light"
          >
            Every visit earns you points. Redeem them for treatments, discounts, and exclusive perks.
          </motion.p>
        </div>
      </section>

      {/* Points Overview */}
      <section className="section-padding surface-base">
        <div className="container-tinas max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Points Balance Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="surface-raised rounded-2xl p-8 glow-gold"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                  <Crown className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.15em] text-gold/50 uppercase font-medium">
                    Current Tier
                  </p>
                  <p className="text-xl font-bold heading-display text-gradient-gold">
                    Gold
                  </p>
                </div>
              </div>

              <p className="text-5xl md:text-6xl font-bold heading-display mb-1 text-gradient-sexy">
                {CURRENT_POINTS.toLocaleString()}
              </p>
              <p className="text-sm text-pink-glow/40 body-serif font-light mb-6">
                Available points
              </p>

              <div className="divider-sexy mb-5" />

              {/* Tier progress */}
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs text-pink-glow/35 body-serif font-light">
                  Progress to <span className="text-gold-light font-medium">{NEXT_TIER}</span>
                </p>
                <p className="text-xs text-gold/50 font-medium">
                  {pointsToNext.toLocaleString()} pts to go
                </p>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${tierProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-pink-glow/25 mt-2 body-serif font-light">
                {TIER_POINTS.toLocaleString()} points required for Platinum tier
              </p>
            </motion.div>

            {/* Earn Points Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="surface-raised rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold heading-display mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-pink-brand" />
                Ways to Earn
              </h3>

              <div className="space-y-4">
                {earnWays.map((way, idx) => (
                  <motion.div
                    key={way.text}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={idx + 2}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-gold/[0.03] border border-gold/[0.06] hover:border-gold/15 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-brand/15 to-gold/10 flex items-center justify-center shrink-0">
                      <way.icon className="w-4.5 h-4.5 text-gold-light" />
                    </div>
                    <p className="text-sm text-pink-glow/60 font-light">{way.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Points History */}
      <section className="section-padding section-dark">
        <div className="container-tinas max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-center mb-10 heading-display"
          >
            Recent <span className="text-pink-brand">Activity</span>
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="surface-raised rounded-2xl overflow-hidden"
          >
            {pointsHistory.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-5 hover:bg-pink-brand/[0.02] transition-colors ${
                  idx < pointsHistory.length - 1 ? 'border-b border-gold/[0.06]' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      item.type === 'earn'
                        ? 'bg-green-900/20 border border-green-500/15'
                        : 'bg-pink-brand/10 border border-pink-brand/15'
                    }`}
                  >
                    {item.type === 'earn' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400/80" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-pink-brand/70" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{item.description}</p>
                    <p className="text-[11px] text-pink-glow/30 body-serif font-light">
                      {item.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-bold heading-display ${
                    item.type === 'earn' ? 'text-green-400/90' : 'text-pink-brand/80'
                  }`}
                >
                  {item.points} pts
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Redeem Section */}
      <section className="section-padding surface-base">
        <div className="container-tinas max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-center mb-4 heading-display"
          >
            Redeem Your <span className="text-gradient-gold">Points</span>
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-pink-glow/40 text-center mb-10 body-serif font-light max-w-xl mx-auto"
          >
            Turn your loyalty into luxury. Choose from our curated rewards below.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6">
            {redeemOptions.map((option, idx) => (
              <motion.div
                key={option.points}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-20px' }}
                variants={fadeUp}
                custom={idx + 2}
                className="relative"
              >
                {option.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="badge-new">Best Value</span>
                  </div>
                )}
                <div
                  className={`surface-raised rounded-2xl p-7 text-center h-full hover-lift ${
                    option.highlight ? 'border-gold/25 glow-gold' : ''
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.gradient} border ${option.border} flex items-center justify-center mx-auto mb-5`}
                  >
                    <option.icon
                      className={`w-6 h-6 ${
                        option.highlight ? 'text-white' : 'text-gold-light'
                      }`}
                    />
                  </div>
                  <p
                    className={`text-3xl font-bold heading-display mb-1 ${
                      option.highlight ? 'text-gradient-sexy' : 'text-gradient-gold'
                    }`}
                  >
                    {option.points.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-pink-glow/35 uppercase tracking-wider mb-4 font-medium">
                    points
                  </p>
                  <div className="divider-sexy mb-4" />
                  <p className="text-sm text-white font-medium heading-display">
                    {option.reward}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}