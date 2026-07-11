'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Crown, Sparkles, Calendar, Clock, CreditCard, MessageCircle, LogOut,
  ChevronRight, Star, Gift, Shield, Settings, Bell, BookOpen, User,
  TrendingUp, Heart, Award, MessageSquare, Gem, Plus, Minus, Check,
  ArrowUpRight, ArrowDownRight, BarChart3
} from 'lucide-react';
import { useAppStore, type Member } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' },
  }),
};

const tierConfig = {
  Silver: { color: 'from-gray-400 to-gray-500', badge: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: Sparkles, perks: ['1 massage/month', '10% off services', 'Priority booking', 'Birthday special', 'Member lounge'] },
  Gold: { color: 'from-gold to-amber-600', badge: 'bg-gold/20 text-gold border-gold/30', icon: Crown, perks: ['2 massages/month', '20% off services', 'VIP booking', 'Aromatherapy upgrade', 'Quarterly consult', 'Guest privileges', 'WhatsApp concierge'] },
  Platinum: { color: 'from-pink-brand to-pink-hot', badge: 'bg-pink-brand/15 text-pink-brand border-pink-brand/25', icon: Crown, perks: ['Unlimited massages', '30% off services', '24/7 concierge', 'Personal wellness plan', 'Private therapy room', 'Monthly spa day', 'Home visits', 'Airport pickup', 'Annual retreat'] },
};

const statusColors: Record<string, string> = {
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function MemberDashboard() {
  const { member, logoutMember, navigate, isMemberLoggedIn } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'services' | 'rewards' | 'settings'>('overview');

  const [realBookings, setRealBookings] = useState<Array<{
    bookingId: string;
    serviceName: string;
    date: string;
    time: string;
    status: string;
    totalAmount: number;
    therapistName: string;
    bookingType: string;
    paymentMethod: string;
    paymentStatus: string;
  }>>([]);

  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    if (!member?.email) return;
    setBookingsLoading(true);
    fetch(`/api/booking?email=${encodeURIComponent(member.email)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.bookings)) {
          setRealBookings(data.bookings);
        }
      })
      .catch(() => {})
      .finally(() => setBookingsLoading(false));
  }, [member?.email]);

  if (!isMemberLoggedIn || !member) {
    navigate('login');
    return null;
  }

  const config = tierConfig[member.tier];
  const TierIcon = config.icon;

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
    { id: 'bookings' as const, label: 'My Bookings', icon: Calendar },
    { id: 'services' as const, label: 'Services', icon: BookOpen },
    { id: 'rewards' as const, label: 'Rewards', icon: Gift },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div>
      {/* Header */}
      <section className="pt-28 pb-8 relative overflow-hidden" style={{ background: '#030102' }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-[0.03]`} />
        <div className="container-tinas relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
                <TierIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold heading-display">Welcome, {member.name.split(' ')[0]}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider border ${config.badge}`}>
                    {member.tier.toUpperCase()} MEMBER
                  </span>
                  <span className="text-xs text-gray-500">Since {new Date(member.memberSince).toLocaleDateString('en-ZM', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {member.tier === 'Platinum' && (
                <button
                  onClick={() => navigate('analytics')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer border border-gold/20 text-gold hover:bg-gold/10"
                >
                  <BarChart3 className="w-3.5 h-3.5" /> Analytics
                </button>
              )}
              <a
                href={`https://wa.me/260761404555?text=Hello%20Serenity%20Touch%20Spa.%20This%20is%20${encodeURIComponent(member.name)}%20(${member.tier}%20member).`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Concierge
              </a>
              <button
                onClick={logoutMember}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-gold/15 text-gray-300 px-4 py-2.5 rounded-full text-xs font-medium transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 bg-white/5 rounded-xl p-1 max-w-md">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gold/20 text-gold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding surface-base min-h-[60vh]">
        <div className="container-tinas">
          {activeTab === 'overview' && <OverviewTab member={member} config={config} bookings={realBookings} />}
          {activeTab === 'bookings' && <BookingsTab member={member} bookings={realBookings} loading={bookingsLoading} />}
          {activeTab === 'services' && <ServicesTab member={member} />}
          {activeTab === 'rewards' && <RewardsTab member={member} />}
          {activeTab === 'settings' && <SettingsTab member={member} />}
        </div>
      </section>
    </div>
  );
}

function OverviewTab({ member, config, bookings }: { member: Member; config: typeof tierConfig.Silver; bookings: typeof realBookings }) {
  const stats = [
    { label: 'Sessions Used', value: member.bookingsUsed.toString(), icon: Heart },
    { label: 'Remaining', value: member.bookingsRemaining === -1 ? 'Unlimited' : member.bookingsRemaining.toString(), icon: Calendar },
    { label: 'Next Billing', value: new Date(member.nextBilling).toLocaleDateString('en-ZM', { day: 'numeric', month: 'short' }), icon: CreditCard },
    { label: 'Member Since', value: new Date(member.memberSince).toLocaleDateString('en-ZM', { month: 'short', year: 'numeric' }), icon: Shield },
  ];

  return (
    <motion.div initial="hidden" animate="visible">
      <motion.div variants={fadeUp} custom={0} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="surface-raised rounded-xl p-5">
            <stat.icon className="w-4 h-4 text-gold mb-3" />
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} custom={1}>
          <div className="surface-raised rounded-2xl p-7 h-full">
            <h3 className="text-lg font-bold heading-display mb-5 flex items-center gap-2">
              <Award className="w-4 h-4 text-gold" />
              {member.tier} Benefits
            </h3>
            <div className="space-y-3">
              {config.perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-gold text-xs">&#10022;</span>
                  <span className="text-sm text-gray-300">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={2}>
          <div className="surface-raised rounded-2xl p-7 h-full">
            <h3 className="text-lg font-bold heading-display mb-5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              Upcoming Sessions
            </h3>
            <div className="space-y-3">
              {bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').slice(0, 3).map((booking) => (
                <div key={booking.bookingId} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-gold/10">
                  <div>
                    <p className="text-sm font-semibold text-white">{booking.serviceName}</p>
                    <p className="text-xs text-gray-500">{booking.date} &middot; {booking.time || 'TBD'} &middot; {booking.therapistName}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors[booking.status] || statusColors.pending}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
              ))}
              {bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length === 0 && (
                <p className="text-sm text-gray-500 body-serif font-light">No upcoming bookings. <button onClick={() => useAppStore.getState().navigate('contact')} className="text-pink-brand hover:underline cursor-pointer">Book a session</button></p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} custom={3} className="mt-6">
        <div className="surface-raised rounded-2xl p-7">
          <h3 className="text-lg font-bold heading-display mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-gold" />
            Quick Actions
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: 'Book New Session', icon: Calendar, action: 'contact' },
              { label: 'WhatsApp Concierge', icon: MessageSquare, action: 'whatsapp' },
              { label: 'Upgrade Membership', icon: Crown, action: 'membership' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.action === 'whatsapp') {
                    window.open(`https://wa.me/260761404555?text=Hello%20Serenity%20Touch%20Spa%20concierge.`, '_blank');
                  } else if (item.action === 'contact' || item.action === 'membership') {
                    const { navigate } = useAppStore.getState();
                    navigate(item.action as 'contact' | 'membership');
                  }
                }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-gold/15 hover:border-gold/30 hover:bg-white/5 transition cursor-pointer"
              >
                <item.icon className="w-4 h-4 text-gold" />
                <span className="text-sm font-medium text-white">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-600 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Referral Section */}
      <motion.div variants={fadeUp} custom={4} className="mt-6">
        <div className="surface-raised rounded-2xl p-7" style={{background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(233,30,99,0.03) 100%)'}}>
          <div className="flex items-center gap-3 mb-3">
            <Gift className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-bold heading-display">Refer & Earn</h3>
          </div>
          <p className="text-sm text-pink-glow/45 mb-4 body-serif font-light">Share your referral code and both you and your friend get 20% off your next treatment.</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-gold/15 font-mono text-gold text-sm tracking-wider">
              SERENITY-{member.name.split(' ')[0].toUpperCase()}-2026
            </div>
            <button className="btn-pink px-4 py-3 text-xs cursor-pointer">Copy Code</button>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm text-pink-glow/40">
            <span>Referrals: <span className="text-gold font-bold">3</span></span>
            <span>Points earned: <span className="text-gold font-bold">450</span></span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RewardsTab({ member }: { member: Member }) {
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const pointsBalance = 1250;
  const tierMultiplier: Record<string, number> = { Silver: 1, Gold: 1.5, Platinum: 2 };
  const multiplier = tierMultiplier[member.tier] || 1;
  const nextTierPoints = 2000;
  const pointsToNext = nextTierPoints - pointsBalance;
  const progress = Math.min((pointsBalance / nextTierPoints) * 100, 100);

  const rewards = [
    { id: 'r1', points: 500, name: 'Free Aromatherapy Upgrade', desc: 'Enhance any treatment with premium essential oils' },
    { id: 'r2', points: 1000, name: 'Free 30-min Add-on Treatment', desc: 'Enjoy an additional 30 minutes of relaxation' },
    { id: 'r3', points: 2000, name: 'Free 60-min Massage', desc: 'Choose any 60-minute massage on the menu' },
    { id: 'r4', points: 3500, name: 'Free Signature Package', desc: 'Experience our full Serenity Signature treatment' },
    { id: 'r5', points: 5000, name: 'Free Couples Retreat', desc: 'A luxurious couples retreat for two' },
  ];

  const pointsHistory = [
    { id: 'ph1', desc: 'Booking: Swedish Massage', points: 150, type: 'earned' as const, date: '2026-07-10' },
    { id: 'ph2', desc: 'Referral bonus: Bwalya N.', points: 150, type: 'earned' as const, date: '2026-07-08' },
    { id: 'ph3', desc: 'Redeemed: Aromatherapy Upgrade', points: -500, type: 'spent' as const, date: '2026-06-28' },
    { id: 'ph4', desc: 'Booking: Hot Stone Therapy', points: 200, type: 'earned' as const, date: '2026-06-20' },
    { id: 'ph5', desc: 'Referral bonus: Grace B.', points: 150, type: 'earned' as const, date: '2026-06-15' },
    { id: 'ph6', desc: 'Booking: Deep Tissue Massage', points: 250, type: 'earned' as const, date: '2026-06-01' },
  ];

  const handleRedeem = (rewardId: string) => {
    setRedeemingId(rewardId);
    setTimeout(() => setRedeemingId(null), 2000);
  };

  return (
    <motion.div initial="hidden" animate="visible">
      {/* Points Balance Card */}
      <motion.div variants={fadeUp} custom={0} className="mb-8">
        <div className="rounded-2xl p-8 relative overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(180,140,30,0.06) 50%, rgba(233,30,99,0.04) 100%)'}}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Gem className="w-4 h-4 text-gold/60" />
              <p className="text-xs text-gold/50 tracking-[0.15em] uppercase font-semibold">Loyalty Points Balance</p>
            </div>
            <div className="flex items-end gap-4 mb-6">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gold via-amber-400 to-gold bg-clip-text text-transparent heading-display">
                {pointsBalance.toLocaleString()}
              </h2>
              <span className="text-gold/50 text-lg mb-2 body-serif">Points</span>
            </div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-sm text-white/70">Tier Multiplier:</span>
              <span className="px-3 py-1 rounded-full bg-gold/15 border border-gold/25 text-gold text-xs font-bold">
                {member.tier}: {multiplier}x
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress to Next Tier */}
      <motion.div variants={fadeUp} custom={1} className="surface-raised rounded-2xl p-7 mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Progress to Gold Reward</p>
          <p className="text-xs text-gold font-bold">{pointsToNext.toLocaleString()} points to go</p>
        </div>
        <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{background: 'linear-gradient(90deg, #d4af37, #f0d060)'}}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-gray-500">0 pts</span>
          <span className="text-[10px] text-gold/50">2,000 pts</span>
        </div>
      </motion.div>

      {/* Redeemable Rewards Grid */}
      <motion.div variants={fadeUp} custom={2} className="mb-8">
        <h3 className="text-lg font-bold heading-display mb-5 flex items-center gap-2">
          <Crown className="w-4 h-4 text-gold" />
          Redeem Rewards
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => {
            const canRedeem = pointsBalance >= reward.points;
            const isRedeeming = redeemingId === reward.id;
            return (
              <div key={reward.id} className="surface-raised rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gold font-bold tracking-wider">{reward.points.toLocaleString()} PTS</span>
                    <Gem className={`w-4 h-4 ${canRedeem ? 'text-gold' : 'text-gray-600'}`} />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{reward.name}</h4>
                  <p className="text-xs text-pink-glow/40 body-serif font-light">{reward.desc}</p>
                </div>
                <button
                  onClick={() => canRedeem && handleRedeem(reward.id)}
                  disabled={!canRedeem || isRedeeming}
                  className={`mt-4 w-full py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isRedeeming
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : canRedeem
                        ? 'btn-outline-gold'
                        : 'bg-white/[0.02] text-gray-600 border border-gold/8 cursor-not-allowed'
                  }`}
                >
                  {isRedeeming ? (
                    <span className="flex items-center justify-center gap-1.5"><Check className="w-3.5 h-3.5" /> Redeemed!</span>
                  ) : (
                    'Redeem'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Points History */}
      <motion.div variants={fadeUp} custom={3}>
        <h3 className="text-lg font-bold heading-display mb-5 flex items-center gap-2">
          <Star className="w-4 h-4 text-gold" />
          Points History
        </h3>
        <div className="surface-raised rounded-2xl overflow-hidden">
          {pointsHistory.map((item, idx) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 ${idx < pointsHistory.length - 1 ? 'border-b border-gold/8' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'earned' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  {item.type === 'earned'
                    ? <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    : <ArrowDownRight className="w-4 h-4 text-red-400" />
                  }
                </div>
                <div>
                  <p className="text-sm text-white">{item.desc}</p>
                  <p className="text-[10px] text-gray-500">{item.date}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${item.type === 'earned' ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.type === 'earned' ? '+' : ''}{item.points}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function BookingsTab({ member, bookings, loading }: { member: Member; bookings: typeof realBookings; loading: boolean }) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const filtered = bookings.filter(b => {
    if (filter === 'upcoming') return b.status !== 'completed' && b.status !== 'cancelled';
    if (filter === 'past') return b.status === 'completed';
    return true;
  });

  return (
    <motion.div initial="hidden" animate="visible">
      <motion.div variants={fadeUp} custom={0} className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold heading-display">Booking History</h2>
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(['all', 'upcoming', 'past'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                filter === f ? 'bg-gold/20 text-gold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {loading && (
        <motion.div variants={fadeUp} custom={1} className="text-center py-12">
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading bookings...</p>
        </motion.div>
      )}
      {!loading && filtered.length === 0 && (
        <motion.div variants={fadeUp} custom={1} className="text-center py-12">
          <Calendar className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No bookings found.</p>
        </motion.div>
      )}
      <motion.div variants={fadeUp} custom={1} className="space-y-3">
        {filtered.map((booking) => (
          <div key={booking.bookingId} className="surface-raised rounded-xl p-5 hover:border-gold/30 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{booking.serviceName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {booking.therapistName} &middot; {booking.date} at {booking.time || 'TBD'}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">Booking ID: {booking.bookingId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors[booking.status] || statusColors.pending}`}>
                  {booking.status.toUpperCase()}
                </span>
                <span className="text-lg font-bold text-white">K{booking.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function ServicesTab({ member }: { member: Member }) {
  const allServices = [
    { name: 'Swedish Massage', duration: '60 min', price: 'K800', memberPrice: member.tier === 'Silver' ? 'K720' : member.tier === 'Gold' ? 'K640' : 'K560' },
    { name: 'Deep Tissue Massage', duration: '90 min', price: 'K1,200', memberPrice: member.tier === 'Silver' ? 'K1,080' : member.tier === 'Gold' ? 'K960' : 'K840' },
    { name: 'Hot Stone Therapy', duration: '75 min', price: 'K1,000', memberPrice: member.tier === 'Silver' ? 'K900' : member.tier === 'Gold' ? 'K800' : 'K700' },
    { name: 'Aromatherapy Treatment', duration: '60 min', price: 'K900', memberPrice: member.tier === 'Silver' ? 'K810' : member.tier === 'Gold' ? 'K720' : 'K630' },
    { name: 'Couples Massage', duration: '90 min', price: 'K2,000', memberPrice: member.tier === 'Silver' ? 'K1,800' : member.tier === 'Gold' ? 'K1,600' : 'K1,400' },
    { name: 'Reflexology', duration: '60 min', price: 'K850', memberPrice: member.tier === 'Silver' ? 'K765' : member.tier === 'Gold' ? 'K680' : 'K595' },
  ];

  const discount = member.tier === 'Silver' ? 10 : member.tier === 'Gold' ? 20 : 30;

  return (
    <motion.div initial="hidden" animate="visible">
      <motion.div variants={fadeUp} custom={0} className="surface-raised rounded-2xl p-6 mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
          <Gift className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h2 className="text-lg font-bold heading-display">{member.tier} Member Pricing</h2>
          <p className="text-sm text-gray-400">You enjoy <span className="text-gold font-bold">{discount}% off</span> all services</p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={1} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allServices.map((service) => (
          <div key={service.name} className="surface-raised rounded-xl p-5 hover:border-gold/30 transition-all group">
            <p className="text-[10px] tracking-[0.1em] text-gray-500 mb-2">{service.duration.toUpperCase()}</p>
            <h3 className="font-bold text-white mb-3 heading-display">{service.name}</h3>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-xl font-bold text-gold">{service.memberPrice}</span>
              <span className="text-sm text-gray-600 line-through">{service.price}</span>
            </div>
            <button
              onClick={() => useAppStore.getState().navigate('contact')}
              className="w-full btn-gold py-2 text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Book Now
            </button>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function SettingsTab({ member }: { member: Member }) {
  const [notifications, setNotifications] = useState({ email: true, sms: true, whatsapp: true });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial="hidden" animate="visible">
      <motion.div variants={fadeUp} custom={0} className="max-w-2xl">
        {/* Profile */}
        <div className="surface-raised rounded-2xl p-7 mb-6">
          <h2 className="text-lg font-bold heading-display mb-6 flex items-center gap-2">
            <User className="w-4 h-4 text-gold" />
            Profile Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name</label>
              <input type="text" defaultValue={member.name} className="w-full px-4 py-3 border border-gold/20 rounded-xl bg-white/5 focus:outline-none focus:border-gold text-sm text-white transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
              <input type="email" defaultValue={member.email} className="w-full px-4 py-3 border border-gold/20 rounded-xl bg-white/5 focus:outline-none focus:border-gold text-sm text-white transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Phone</label>
              <input type="tel" defaultValue={member.phone} className="w-full px-4 py-3 border border-gold/20 rounded-xl bg-white/5 focus:outline-none focus:border-gold text-sm text-white transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Member ID</label>
              <input type="text" value={member.id} readOnly className="w-full px-4 py-3 border border-gold/20 rounded-xl bg-white/[0.02] text-sm text-gray-500 cursor-not-allowed" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="surface-raised rounded-2xl p-7 mb-6">
          <h2 className="text-lg font-bold heading-display mb-6 flex items-center gap-2">
            <Bell className="w-4 h-4 text-gold" />
            Notification Preferences
          </h2>
          <div className="space-y-4">
            {[
              { key: 'email' as const, label: 'Email Notifications', desc: 'Booking confirmations, reminders, and newsletters' },
              { key: 'sms' as const, label: 'SMS Notifications', desc: 'Booking reminders and urgent updates' },
              { key: 'whatsapp' as const, label: 'WhatsApp Notifications', desc: 'Concierge messages and booking updates' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-gold/10">
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${
                    notifications[item.key] ? 'bg-gold' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="surface-raised rounded-2xl p-7 mb-6">
          <h2 className="text-lg font-bold heading-display mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" />
            Security
          </h2>
          <div className="space-y-4">
            <div>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-gold/10 hover:border-gold/20 transition cursor-pointer">
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Change Password</p>
                  <p className="text-xs text-gray-500">Last changed 30 days ago</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-gold/10 hover:border-gold/20 transition cursor-pointer">
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Add an extra layer of security</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full btn-gold py-3.5 text-sm font-semibold cursor-pointer"
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </motion.div>
    </motion.div>
  );
}