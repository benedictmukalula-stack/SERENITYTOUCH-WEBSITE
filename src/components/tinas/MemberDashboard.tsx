'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown, Sparkles, Calendar, Clock, CreditCard, MessageCircle, LogOut,
  ChevronRight, Star, Gift, Shield, Settings, Bell, BookOpen, User,
  TrendingUp, Heart, Award, MessageSquare
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

const mockBookings = [
  { id: 'ST-K4M9Q', service: 'Swedish Massage', therapist: 'Tina Mulenga', date: '2026-07-10', time: '10:00 AM', status: 'confirmed', price: 'K800' },
  { id: 'ST-J3L8P', service: 'Hot Stone Therapy', therapist: 'Grace Banda', date: '2026-07-18', time: '2:00 PM', status: 'pending', price: 'K1,000' },
  { id: 'ST-H2K7N', service: 'Deep Tissue Massage', therapist: 'Chipo Mwale', date: '2026-06-28', time: '11:00 AM', status: 'completed', price: 'K1,200' },
  { id: 'ST-G1J6M', service: 'Aromatherapy Treatment', therapist: 'Patricia Nkomo', date: '2026-06-15', time: '3:00 PM', status: 'completed', price: 'K900' },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function MemberDashboard() {
  const { member, logoutMember, navigate, isMemberLoggedIn } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'services' | 'settings'>('overview');

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
          {activeTab === 'overview' && <OverviewTab member={member} config={config} />}
          {activeTab === 'bookings' && <BookingsTab member={member} />}
          {activeTab === 'services' && <ServicesTab member={member} />}
          {activeTab === 'settings' && <SettingsTab member={member} />}
        </div>
      </section>
    </div>
  );
}

function OverviewTab({ member, config }: { member: Member; config: typeof tierConfig.Silver }) {
  const stats = [
    { label: 'Sessions Used', value: member.bookingsUsed.toString(), icon: Heart },
    { label: 'Remaining', value: member.bookingsRemaining === -1 ? 'Unlimited' : member.bookingsRemaining.toString(), icon: Calendar },
    { label: 'Next Billing', value: new Date(member.nextBilling).toLocaleDateString('en-ZM', { day: 'numeric', month: 'short' }), icon: CreditCard },
    { label: 'Member ID', value: member.id, icon: Shield },
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
              {mockBookings.filter(b => b.status !== 'completed').slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-gold/10">
                  <div>
                    <p className="text-sm font-semibold text-white">{booking.service}</p>
                    <p className="text-xs text-gray-500">{booking.date} &middot; {booking.time}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors[booking.status]}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
              ))}
              {mockBookings.filter(b => b.status !== 'completed').length === 0 && (
                <p className="text-sm text-gray-500">No upcoming sessions. Book one now!</p>
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
    </motion.div>
  );
}

function BookingsTab({ member }: { member: Member }) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const filtered = mockBookings.filter(b => {
    if (filter === 'upcoming') return b.status !== 'completed';
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

      <motion.div variants={fadeUp} custom={1} className="space-y-3">
        {filtered.map((booking) => (
          <div key={booking.id} className="surface-raised rounded-xl p-5 hover:border-gold/30 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{booking.service}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {booking.therapist} &middot; {booking.date} at {booking.time}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">Booking ID: {booking.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors[booking.status]}`}>
                  {booking.status.toUpperCase()}
                </span>
                <span className="text-lg font-bold text-white">{booking.price}</span>
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