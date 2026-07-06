'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, Calendar, DollarSign, Star,
  ArrowUpRight, ArrowDownRight, Activity, Clock, Eye,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' as const },
  }),
};

type TabId = 'overview' | 'bookings' | 'revenue' | 'clients';

const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'revenue', label: 'Revenue', icon: DollarSign },
  { id: 'clients', label: 'Clients', icon: Users },
];

const statCards = [
  { label: 'Total Revenue', value: 'K285,400', change: '+12.5%', positive: true, icon: DollarSign, color: 'from-gold to-amber-600' },
  { label: 'Total Bookings', value: '1,247', change: '+8.3%', positive: true, icon: Calendar, color: 'from-pink-brand to-pink-deep' },
  { label: 'Active Members', value: '89', change: '+15.2%', positive: true, icon: Users, color: 'from-emerald-500 to-emerald-700' },
  { label: 'Avg Rating', value: '4.9', change: '+0.3', positive: true, icon: Star, color: 'from-amber-400 to-orange-500' },
];

const popularTreatments = [
  { name: 'Swedish Massage', percentage: 35, color: 'from-pink-brand to-pink-hot' },
  { name: 'Deep Tissue', percentage: 28, color: 'from-gold to-amber-600' },
  { name: 'Thai Massage', percentage: 18, color: 'from-emerald-500 to-emerald-600' },
  { name: 'Aromatherapy', percentage: 12, color: 'from-purple-500 to-purple-700' },
  { name: 'Other', percentage: 7, color: 'from-gray-500 to-gray-600' },
];

const recentActivity = [
  { text: 'New booking by Chipo Mwale', sub: 'Swedish Massage — Tomorrow 10:00 AM', time: '2 min ago', type: 'booking' as const },
  { text: 'Grace Banda joined Gold tier', sub: 'Upgraded from Silver membership', time: '18 min ago', type: 'member' as const },
  { text: 'Payment received — K1,200', sub: 'Bwalya Nkomo — Deep Tissue session', time: '1 hour ago', type: 'payment' as const },
  { text: '5-star review from Thandiwe Phiri', sub: 'Aromatherapy Treatment', time: '2 hours ago', type: 'review' as const },
  { text: 'Corporate booking — Zambia Airways', sub: '12 staff members, team wellness day', time: '3 hours ago', type: 'booking' as const },
];

const recentBookings = [
  { id: 'ST-A1B2C', guest: 'Chipo Mwale', treatment: 'Swedish Massage', date: 'Jul 15, 2026', time: '10:00 AM', status: 'Confirmed' as const, therapist: 'Taonga Phiri' },
  { id: 'ST-D3E4F', guest: 'Bwalya Nkomo', treatment: 'Deep Tissue Massage', date: 'Jul 15, 2026', time: '2:00 PM', status: 'Confirmed' as const, therapist: 'Grace Banda' },
  { id: 'ST-G5H6I', guest: 'Thandiwe Phiri', treatment: 'Hot Stone Therapy', date: 'Jul 16, 2026', time: '11:00 AM', status: 'Pending' as const, therapist: 'Patricia Nkomo' },
  { id: 'ST-J7K8L', guest: 'Mwamba Chilufya', treatment: 'Aromatherapy', date: 'Jul 14, 2026', time: '3:00 PM', status: 'Completed' as const, therapist: 'Taonga Phiri' },
  { id: 'ST-M9N0P', guest: 'Linda Tembo', treatment: 'Thai Massage', date: 'Jul 13, 2026', time: '9:00 AM', status: 'Completed' as const, therapist: 'Grace Banda' },
  { id: 'ST-Q1R2S', guest: 'Joseph Mwanza', treatment: 'Swedish Massage', date: 'Jul 14, 2026', time: '4:00 PM', status: 'Cancelled' as const, therapist: 'Patricia Nkomo' },
  { id: 'ST-T3U4V', guest: 'Natasha Banda', treatment: 'Prenatal Massage', date: 'Jul 17, 2026', time: '10:00 AM', status: 'Pending' as const, therapist: 'Taonga Phiri' },
  { id: 'ST-W5X6Y', guest: 'Peter Sakala', treatment: 'Deep Tissue Massage', date: 'Jul 12, 2026', time: '1:00 PM', status: 'Completed' as const, therapist: 'Grace Banda' },
];

const monthlyRevenue = [
  { month: 'Feb', value: 32, revenue: 'K32,100' },
  { month: 'Mar', value: 45, revenue: 'K45,800' },
  { month: 'Apr', value: 38, revenue: 'K38,500' },
  { month: 'May', value: 55, revenue: 'K55,200' },
  { month: 'Jun', value: 62, revenue: 'K62,400' },
  { month: 'Jul', value: 78, revenue: 'K78,600' },
];

const revenueByService = [
  { service: 'Swedish Massage', amount: 'K85,200', percentage: 30, color: 'from-pink-brand to-pink-hot' },
  { service: 'Deep Tissue Massage', amount: 'K68,400', percentage: 24, color: 'from-gold to-amber-600' },
  { service: 'Hot Stone Therapy', amount: 'K42,700', percentage: 15, color: 'from-emerald-500 to-emerald-600' },
  { service: 'Aromatherapy', amount: 'K39,900', percentage: 14, color: 'from-purple-500 to-purple-700' },
  { service: 'Thai Massage', amount: 'K28,500', percentage: 10, color: 'from-amber-400 to-orange-500' },
  { service: 'Other Services', amount: 'K20,700', percentage: 7, color: 'from-gray-500 to-gray-600' },
];

const topClients = [
  { name: 'Grace Banda', tier: 'Platinum', totalSpend: 'K48,600', visits: 52, avatar: 'GB' },
  { name: 'Bwalya Nkomo', tier: 'Gold', totalSpend: 'K32,100', visits: 34, avatar: 'BN' },
  { name: 'Chipo Mwale', tier: 'Silver', totalSpend: 'K18,400', visits: 22, avatar: 'CM' },
  { name: 'Thandiwe Phiri', tier: 'Gold', totalSpend: 'K15,800', visits: 18, avatar: 'TP' },
  { name: 'Mwamba Chilufya', tier: 'Platinum', totalSpend: 'K12,200', visits: 15, avatar: 'MC' },
  { name: 'Linda Tembo', tier: 'Silver', totalSpend: 'K9,600', visits: 12, avatar: 'LT' },
];

const statusStyles: Record<string, string> = {
  Confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  Cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const tierBadge: Record<string, string> = {
  Platinum: 'bg-pink-brand/15 text-pink-brand border-pink-brand/25',
  Gold: 'bg-gold/15 text-gold border-gold/25',
  Silver: 'bg-gray-400/15 text-gray-300 border-gray-400/25',
};

const activityIconColors: Record<string, string> = {
  booking: 'bg-pink-brand/10 text-pink-brand border-pink-brand/20',
  member: 'bg-gold/10 text-gold border-gold/20',
  payment: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  review: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
};

export default function AnalyticsDashboard() {
  const { isMemberLoggedIn, member, navigate } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  if (!isMemberLoggedIn || !member) {
    navigate('login');
    return null;
  }

  const newClients = 34;
  const returningClients = 55;
  const totalClientsForRatio = newClients + returningClients;

  return (
    <div>
      {/* Header */}
      <section className="pt-28 pb-8 relative overflow-hidden" style={{ background: '#030102' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-gold to-pink-brand opacity-[0.03]" />
        <div className="container-tinas relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-pink-brand flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold heading-display">Analytics Dashboard</h1>
                <p className="text-xs text-gold/40 mt-0.5">Business performance overview · Last updated 5 min ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-new flex items-center gap-1.5">
                <Eye className="w-3 h-3" />
                Admin View
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold border bg-gold/5 text-gold border-gold/20">
                {member.tier} Member
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="border-b border-gold/10 surface-base sticky top-0 z-30" style={{ background: 'rgba(10,5,8,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="container-tinas">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium heading-display whitespace-nowrap transition cursor-pointer relative border-b-2 ${
                    activeTab === tab.id
                      ? 'text-gold border-gold'
                      : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gold/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <section className="section-padding surface-base">
        <div className="container-tinas">
          {/* ===================== OVERVIEW TAB ===================== */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={idx}
                      className="surface-raised rounded-2xl p-5 hover-lift"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className={`flex items-center gap-0.5 text-xs font-semibold ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold heading-display text-white">{stat.value}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid lg:grid-cols-5 gap-6">
                {/* Popular Treatments Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="lg:col-span-3 surface-raised rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-base font-semibold heading-display text-white">Popular Treatments</h2>
                      <p className="text-[11px] text-gray-500 mt-0.5">Booking distribution this month</p>
                    </div>
                    <BarChart3 className="w-5 h-5 text-gold/30" />
                  </div>

                  <div className="space-y-4">
                    {popularTreatments.map((treatment, idx) => (
                      <div key={treatment.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-gray-300">{treatment.name}</span>
                          <span className="text-xs font-semibold text-white">{treatment.percentage}%</span>
                        </div>
                        <div className="h-7 rounded-lg overflow-hidden bg-gold/[0.06] relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${treatment.percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.1 * idx, ease: 'easeOut' }}
                            className={`h-full rounded-lg bg-gradient-to-r ${treatment.color} relative`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="lg:col-span-2 surface-raised rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-semibold heading-display text-white">Recent Activity</h2>
                    <Activity className="w-5 h-5 text-pink-brand/40" />
                  </div>

                  <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                    {recentActivity.map((item, idx) => {
                      const iconMap = {
                        booking: Calendar,
                        member: Users,
                        payment: DollarSign,
                        review: Star,
                      };
                      const ItemIcon = iconMap[item.type];
                      return (
                        <motion.div
                          key={idx}
                          variants={fadeUp}
                          initial="hidden"
                          animate="visible"
                          custom={idx + 2}
                          className="flex gap-3 p-3 rounded-xl hover:bg-gold/[0.03] transition group"
                        >
                          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${activityIconColors[item.type]}`}>
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-white truncate group-hover:text-gold transition">{item.text}</p>
                            <p className="text-[11px] text-gray-500 truncate">{item.sub}</p>
                          </div>
                          <span className="text-[10px] text-gray-600 flex-shrink-0 pt-0.5">{item.time}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ===================== BOOKINGS TAB ===================== */}
          {activeTab === 'bookings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="surface-raised rounded-2xl overflow-hidden"
              >
                <div className="p-5 border-b border-gold/8 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold heading-display text-white">Recent Bookings</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">{recentBookings.length} bookings · Last 7 days</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {['All', 'Confirmed', 'Pending'].map((filter) => (
                      <button
                        key={filter}
                        className="px-3 py-1.5 rounded-full text-[11px] font-medium transition cursor-pointer bg-gold/[0.06] text-gold/70 hover:bg-gold/[0.1] border border-gold/10"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-[10px] tracking-wider text-gray-500 font-semibold uppercase border-b border-gold/5">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-2">Guest</div>
                  <div className="col-span-2">Treatment</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-1">Time</div>
                  <div className="col-span-2">Therapist</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>

                {/* Table Rows */}
                <div className="max-h-[480px] overflow-y-auto">
                  {recentBookings.map((booking, idx) => (
                    <motion.div
                      key={booking.id}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={idx}
                      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 border-b border-gold/[0.04] hover:bg-gold/[0.02] transition items-center"
                    >
                      <div className="col-span-1 text-xs text-gray-500 font-mono">{booking.id}</div>
                      <div className="col-span-2 text-sm text-white font-medium">{booking.guest}</div>
                      <div className="col-span-2 text-sm text-gray-300">{booking.treatment}</div>
                      <div className="col-span-2 text-sm text-gray-400 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gray-600" />
                        {booking.date}
                      </div>
                      <div className="col-span-1 text-sm text-gray-400">{booking.time}</div>
                      <div className="col-span-2 text-sm text-gray-300">{booking.therapist}</div>
                      <div className="col-span-2 flex justify-end">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider border ${statusStyles[booking.status]}`}>
                          {booking.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ===================== REVENUE TAB ===================== */}
          {activeTab === 'revenue' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Monthly Revenue Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="surface-raised rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-base font-semibold heading-display text-white">Monthly Revenue</h2>
                      <p className="text-[11px] text-gray-500 mt-0.5">Last 6 months performance</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-semibold">+24.3%</span>
                    </div>
                  </div>

                  {/* CSS Bar Chart */}
                  <div className="flex items-end gap-3 h-48 px-2">
                    {monthlyRevenue.map((m, idx) => (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(m.value / 80) * 100}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                          className="w-full rounded-t-lg bg-gradient-to-t from-gold/80 to-pink-brand relative group cursor-pointer min-h-[8px]"
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 border border-gold/20 rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                            <p className="text-xs font-semibold text-white">{m.revenue}</p>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-gray-900" />
                          </div>
                          <div className="absolute inset-0 rounded-t-lg bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </motion.div>
                        <span className="text-[10px] text-gray-500 font-medium">{m.month}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Revenue by Service */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="surface-raised rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-base font-semibold heading-display text-white">Revenue by Service</h2>
                      <p className="text-[11px] text-gray-500 mt-0.5">Year-to-date breakdown</p>
                    </div>
                    <DollarSign className="w-5 h-5 text-gold/30" />
                  </div>

                  <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {revenueByService.map((item, idx) => (
                      <div key={item.service}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-gray-300">{item.service}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-white">{item.amount}</span>
                            <span className="text-[10px] text-gray-500 w-8 text-right">{item.percentage}%</span>
                          </div>
                        </div>
                        <div className="h-5 rounded-md overflow-hidden bg-gold/[0.06]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.percentage / 30) * 100}%` }}
                            transition={{ duration: 0.7, delay: idx * 0.08, ease: 'easeOut' }}
                            className={`h-full rounded-md progress-bar-fill relative`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Revenue Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'This Month', value: 'K78,600', sub: 'vs K62,400 last month', positive: true },
                  { label: 'Avg per Booking', value: 'K229', sub: '+5.2% from last month', positive: true },
                  { label: 'Membership Revenue', value: 'K124,500', sub: '43.6% of total', positive: true },
                  { label: 'Outstanding', value: 'K8,200', sub: '3 pending payments', positive: false },
                ].map((card, idx) => (
                  <motion.div
                    key={card.label}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={idx + 4}
                    className="surface-raised rounded-2xl p-5"
                  >
                    <p className="text-[11px] text-gray-500 mb-1">{card.label}</p>
                    <p className="text-xl font-bold heading-display text-white">{card.value}</p>
                    <p className={`text-[11px] mt-1 flex items-center gap-1 ${card.positive ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {card.sub}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ===================== CLIENTS TAB ===================== */}
          {activeTab === 'clients' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* New vs Returning */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="surface-raised rounded-2xl p-6"
                >
                  <h2 className="text-base font-semibold heading-display text-white mb-1">Client Breakdown</h2>
                  <p className="text-[11px] text-gray-500 mb-6">New vs returning this month</p>

                  {/* Visual Ratio */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      {/* CSS donut chart */}
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle
                          cx="18" cy="18" r="14"
                          fill="none"
                          stroke="rgba(212,175,55,0.1)"
                          strokeWidth="4"
                        />
                        <circle
                          cx="18" cy="18" r="14"
                          fill="none"
                          stroke="url(#returningGrad)"
                          strokeWidth="4"
                          strokeDasharray={`${(returningClients / totalClientsForRatio) * 88} 88`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="returningGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#D4AF37" />
                            <stop offset="100%" stopColor="#E91E63" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold heading-display text-white">{totalClientsForRatio}</span>
                        <span className="text-[10px] text-gray-500">Total</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-gold to-pink-brand" />
                          <span className="text-sm text-gray-300">Returning</span>
                        </div>
                        <p className="text-xl font-bold heading-display text-white">{returningClients}</p>
                        <p className="text-[11px] text-emerald-400">{((returningClients / totalClientsForRatio) * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-600" />
                          <span className="text-sm text-gray-300">New</span>
                        </div>
                        <p className="text-xl font-bold heading-display text-white">{newClients}</p>
                        <p className="text-[11px] text-gray-400">{((newClients / totalClientsForRatio) * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gold/8">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">Retention Rate</span>
                      <span className="text-sm font-semibold text-emerald-400">76%</span>
                    </div>
                    <div className="progress-bar mt-2">
                      <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: '76%' }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Top Clients */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="lg:col-span-2 surface-raised rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-base font-semibold heading-display text-white">Top Clients</h2>
                      <p className="text-[11px] text-gray-500 mt-0.5">By total spend</p>
                    </div>
                    <Users className="w-5 h-5 text-gold/30" />
                  </div>

                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {topClients.map((client, idx) => (
                      <motion.div
                        key={client.name}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={idx + 1}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gold/[0.03] transition group"
                      >
                        {/* Rank */}
                        <span className="text-xs font-bold text-gray-600 w-5 text-center flex-shrink-0">
                          {idx + 1}
                        </span>

                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          client.tier === 'Platinum'
                            ? 'bg-pink-brand/15 text-pink-brand border border-pink-brand/20'
                            : client.tier === 'Gold'
                              ? 'bg-gold/15 text-gold border border-gold/20'
                              : 'bg-gray-500/15 text-gray-300 border border-gray-500/20'
                        }`}>
                          {client.avatar}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white truncate group-hover:text-gold transition">{client.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider border ${tierBadge[client.tier]}`}>
                              {client.tier}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500">{client.visits} visits</p>
                        </div>

                        {/* Spend */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold heading-display text-white">{client.totalSpend}</p>
                          <p className="text-[10px] text-gray-500">lifetime</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Client Growth Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'New This Month', value: '34', change: '+12 vs last month', positive: true, icon: Users },
                  { label: 'Avg Lifetime Value', value: 'K3,206', change: '+8.1% growth', positive: true, icon: DollarSign },
                  { label: 'Referral Signups', value: '18', change: '53% of new clients', positive: true, icon: TrendingUp },
                  { label: 'Churn Rate', value: '3.2%', change: '-0.8% improvement', positive: true, icon: Activity },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.label}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={idx + 4}
                      className="surface-raised rounded-2xl p-5 hover-lift"
                    >
                      <Icon className="w-5 h-5 text-gold/30 mb-3" />
                      <p className="text-xl font-bold heading-display text-white">{card.value}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{card.label}</p>
                      <p className={`text-[10px] mt-1.5 flex items-center gap-1 ${card.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {card.change}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}