'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, Calendar, DollarSign, Star,
  ArrowUpRight, ArrowDownRight, Activity, Clock, Eye,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

const ADMIN_KEY = 'st-admin-2026-secure-key';

/* ───────────────────────── helpers ───────────────────────── */

const formatCurrency = (amount: number) => `K${amount.toLocaleString()}`;

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const timeAgo = (dateStr: string) => {
  try {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  } catch {
    return '';
  }
};

/* ───────────────────────── types ───────────────────────── */

interface Kpis {
  totalRevenue: number;
  totalBookings: number;
  activeMembers: number;
  avgRating: number;
  totalReviews: number;
  todayBookings: number;
  pendingPayments: number;
  revenueChange: number;
  memberGrowth: number;
}

interface StatusBreakdown {
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
}

interface PaymentBreakdownItem {
  method: string;
  count: number;
  total: number;
}

interface PopularService {
  name: string;
  bookings: number;
  revenue: number;
}

interface DailyTrendItem {
  date: string;
  bookings: number;
  revenue: number;
}

interface RecentBooking {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  bookingType: string;
  createdAt: string;
}

interface BookingItem {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  bookingType: string;
  calloutZone: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  therapistName: string;
  notes: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

interface ClientItem {
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  completedBookings: number;
  cancelledBookings: number;
  lastVisit: string;
  firstVisit: string;
  lastService: string;
  memberId: string;
  isMember: boolean;
  memberTier: string;
  memberPoints: number;
  memberSince: string;
}

interface StatsData {
  kpis: Kpis;
  statusBreakdown: StatusBreakdown;
  paymentBreakdown: PaymentBreakdownItem[];
  popularServices: PopularService[];
  dailyTrend: DailyTrendItem[];
  recentBookings: RecentBooking[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/* ───────────────────────── animation ───────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' as const },
  }),
};

/* ───────────────────────── constants ───────────────────────── */

type TabId = 'overview' | 'bookings' | 'revenue' | 'clients';

const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'revenue', label: 'Revenue', icon: DollarSign },
  { id: 'clients', label: 'Clients', icon: Users },
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
  Bronze: 'bg-amber-700/15 text-amber-500 border-amber-700/25',
  None: 'bg-gray-500/10 text-gray-500 border-gray-500/15',
};

const activityIconColors: Record<string, string> = {
  booking: 'bg-pink-brand/10 text-pink-brand border-pink-brand/20',
  member: 'bg-gold/10 text-gold border-gold/20',
  payment: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  review: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
};

const treatmentColors = [
  'from-pink-brand to-pink-hot',
  'from-gold to-amber-600',
  'from-emerald-500 to-emerald-600',
  'from-purple-500 to-purple-700',
  'from-amber-400 to-orange-500',
  'from-gray-500 to-gray-600',
  'from-rose-500 to-rose-700',
  'from-cyan-500 to-cyan-700',
  'from-lime-500 to-lime-700',
  'from-fuchsia-500 to-fuchsia-700',
];

const paymentMethodColors: Record<string, string> = {
  cash: 'from-emerald-500 to-emerald-700',
  card: 'from-gold to-amber-600',
  mobile: 'from-purple-500 to-purple-700',
  transfer: 'from-cyan-500 to-cyan-700',
  online: 'from-pink-brand to-pink-hot',
};

const statusFilterOptions = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

/* ───────────────────────── skeleton ───────────────────────── */

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gold/[0.06] ${className ?? ''}`} />;
}

/* ───────────────────────── component ───────────────────────── */

export default function AnalyticsDashboard() {
  const { isMemberLoggedIn, member, navigate } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  /* ─── loading states ─── */
  const [statsLoading, setStatsLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [clientsLoading, setClientsLoading] = useState(true);

  /* ─── data states ─── */
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [bookingsPagination, setBookingsPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [bookingsFilter, setBookingsFilter] = useState('All');
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [clientsPagination, setClientsPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [lastUpdated, setLastUpdated] = useState<string>('');

  /* ─── fetch: stats (overview + revenue) ─── */
  const fetchStats = useCallback(async (signal: AbortSignal) => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${ADMIN_KEY}` },
        signal,
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const json = await res.json();
      if (json.success) {
        setStatsData(json.data);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Failed to fetch stats:', err);
      }
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /* ─── fetch: bookings ─── */
  const fetchBookings = useCallback(async (page: number, status: string, signal: AbortSignal) => {
    setBookingsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20', sort: '-createdAt' });
      if (status && status !== 'All') params.set('status', status.toLowerCase());
      const res = await fetch(`/api/admin/bookings?${params.toString()}`, {
        headers: { Authorization: `Bearer ${ADMIN_KEY}` },
        signal,
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const json = await res.json();
      if (json.success) {
        setBookings(json.data.bookings);
        setBookingsPagination(json.data.pagination);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Failed to fetch bookings:', err);
      }
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  /* ─── fetch: clients ─── */
  const fetchClients = useCallback(async (page: number, signal: AbortSignal) => {
    setClientsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`/api/admin/clients?${params.toString()}`, {
        headers: { Authorization: `Bearer ${ADMIN_KEY}` },
        signal,
      });
      if (!res.ok) throw new Error('Failed to fetch clients');
      const json = await res.json();
      if (json.success) {
        setClients(json.data.clients);
        setClientsPagination(json.data.pagination);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Failed to fetch clients:', err);
      }
    } finally {
      setClientsLoading(false);
    }
  }, []);

  /* ─── effects ─── */
  useEffect(() => {
    const controller = new AbortController();
    fetchStats(controller.signal);
    return () => controller.abort();
  }, [fetchStats]);

  useEffect(() => {
    const controller = new AbortController();
    fetchBookings(1, bookingsFilter, controller.signal);
    return () => controller.abort();
  }, [fetchBookings, bookingsFilter]);

  useEffect(() => {
    const controller = new AbortController();
    fetchClients(1, controller.signal);
    return () => controller.abort();
  }, [fetchClients]);

  /* ─── derived data: stat cards ─── */
  const statCards = statsData
    ? [
        {
          label: 'Total Revenue',
          value: formatCurrency(statsData.kpis.totalRevenue),
          change: `${statsData.kpis.revenueChange >= 0 ? '+' : ''}${statsData.kpis.revenueChange}%`,
          positive: statsData.kpis.revenueChange >= 0,
          icon: DollarSign,
          color: 'from-gold to-amber-600',
        },
        {
          label: 'Total Bookings',
          value: statsData.kpis.totalBookings.toLocaleString(),
          change: `+${statsData.kpis.todayBookings} today`,
          positive: true,
          icon: Calendar,
          color: 'from-pink-brand to-pink-deep',
        },
        {
          label: 'Active Members',
          value: statsData.kpis.activeMembers.toLocaleString(),
          change: `${statsData.kpis.memberGrowth >= 0 ? '+' : ''}${statsData.kpis.memberGrowth}%`,
          positive: statsData.kpis.memberGrowth >= 0,
          icon: Users,
          color: 'from-emerald-500 to-emerald-700',
        },
        {
          label: 'Avg Rating',
          value: statsData.kpis.avgRating.toFixed(1),
          change: `${statsData.kpis.totalReviews} reviews`,
          positive: true,
          icon: Star,
          color: 'from-amber-400 to-orange-500',
        },
      ]
    : [];

  /* ─── derived data: popular treatments ─── */
  const popularTreatments = statsData
    ? (() => {
        const totalBookings = statsData.popularServices.reduce((s, p) => s + p.bookings, 0);
        return statsData.popularServices.map((s, idx) => ({
          name: s.name,
          percentage: totalBookings > 0 ? Math.round((s.bookings / totalBookings) * 100) : 0,
          color: treatmentColors[idx % treatmentColors.length],
        }));
      })()
    : [];

  /* ─── derived data: recent activity ─── */
  const recentActivity = statsData
    ? statsData.recentBookings.slice(0, 6).map((b) => ({
        text: `New booking by ${b.name}`,
        sub: `${b.serviceName} — ${formatDate(b.date)} ${b.time}`,
        time: timeAgo(b.createdAt),
        type: 'booking' as const,
      }))
    : [];

  /* ─── derived data: monthly revenue (aggregated from dailyTrend) ─── */
  const monthlyRevenue = statsData
    ? (() => {
        const monthMap = new Map<string, { month: string; value: number; revenue: number }>();
        statsData.dailyTrend.forEach((d) => {
          const dt = new Date(d.date);
          const key = `${dt.getFullYear()}-${dt.getMonth()}`;
          const label = dt.toLocaleDateString('en-US', { month: 'short' });
          const existing = monthMap.get(key);
          if (existing) {
            existing.value += d.bookings;
            existing.revenue += d.revenue;
          } else {
            monthMap.set(key, { month: label, value: d.bookings, revenue: d.revenue });
          }
        });
        const entries = Array.from(monthMap.values());
        return entries.slice(-6).map((e) => ({
          month: e.month,
          value: e.value,
          revenue: formatCurrency(e.revenue),
        }));
      })()
    : [];

  /* ─── derived data: revenue by service ─── */
  const revenueByService = statsData
    ? (() => {
        const totalRevenue = statsData.popularServices.reduce((s, p) => s + p.revenue, 0);
        return statsData.popularServices.map((s, idx) => ({
          service: s.name,
          amount: formatCurrency(s.revenue),
          percentage: totalRevenue > 0 ? Math.round((s.revenue / totalRevenue) * 100) : 0,
          color: treatmentColors[idx % treatmentColors.length],
        }));
      })()
    : [];

  /* ─── derived data: revenue summary cards ─── */
  const revenueSummaryCards = statsData
    ? (() => {
        const thisMonthRevenue = statsData.dailyTrend
          .filter((d) => {
            const dt = new Date(d.date);
            const now = new Date();
            return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
          })
          .reduce((s, d) => s + d.revenue, 0);
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastMonthRevenue = statsData.dailyTrend
          .filter((d) => {
            const dt = new Date(d.date);
            return dt.getMonth() === lastMonthDate.getMonth() && dt.getFullYear() === lastMonthDate.getFullYear();
          })
          .reduce((s, d) => s + d.revenue, 0);
        const avgPerBooking = statsData.kpis.totalBookings > 0
          ? Math.round(statsData.kpis.totalRevenue / statsData.kpis.totalBookings)
          : 0;
        return [
          { label: 'This Month', value: formatCurrency(thisMonthRevenue), sub: `vs ${formatCurrency(lastMonthRevenue)} last month`, positive: thisMonthRevenue >= lastMonthRevenue },
          { label: 'Avg per Booking', value: formatCurrency(avgPerBooking), sub: 'Per booking average', positive: true },
          { label: 'Pending Payments', value: formatCurrency(statsData.kpis.pendingPayments), sub: `${statsData.kpis.pendingPayments > 0 ? 'Awaiting payment' : 'All settled'}`, positive: statsData.kpis.pendingPayments === 0 },
          { label: 'Outstanding', value: formatCurrency(statsData.kpis.pendingPayments), sub: `${statsData.kpis.pendingPayments > 0 ? 'Payment pending' : 'No outstanding balance'}`, positive: statsData.kpis.pendingPayments === 0 },
        ];
      })()
    : [];

  /* ─── derived data: top clients ─── */
  const topClients = clients.length > 0
    ? [...clients]
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10)
        .map((c) => ({
          name: c.name,
          tier: c.memberTier || 'None',
          totalSpend: formatCurrency(c.totalSpent),
          visits: c.totalBookings,
          avatar: c.name.split(' ').map((w) => w.charAt(0)).join('').slice(0, 2).toUpperCase(),
        }))
    : [];

  /* ─── derived data: client breakdown ─── */
  const clientBreakdown = (() => {
    const newClients = clients.filter((c) => c.totalBookings <= 1).length;
    const returningClients = clients.filter((c) => c.totalBookings > 1).length;
    const total = newClients + returningClients;
    return { newClients, returningClients, total: Math.max(total, 1) };
  })();

  /* ─── auth guard ─── */
  if (!isMemberLoggedIn || !member) {
    navigate('login');
    return null;
  }

  const { newClients, returningClients, total: totalClientsForRatio } = clientBreakdown;

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
                <p className="text-xs text-gold/40 mt-0.5">Business performance overview · Last updated {lastUpdated || 'just now'}</p>
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
                {statsLoading
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="surface-raised rounded-2xl p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <Skeleton className="w-10 h-10 rounded-xl" />
                          <Skeleton className="w-14 h-4 rounded-full" />
                        </div>
                        <Skeleton className="h-7 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ))
                  : statCards.map((stat, idx) => {
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

                  {statsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-8" />
                          </div>
                          <Skeleton className="h-7 w-full rounded-lg" />
                        </div>
                      ))}
                    </div>
                  ) : (
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
                  )}
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

                  {statsLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="flex gap-3 p-3">
                          <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
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
                  )}
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
                <div className="p-5 border-b border-gold/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold heading-display text-white">Recent Bookings</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">{bookingsPagination.total} bookings</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {statusFilterOptions.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setBookingsFilter(filter)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition cursor-pointer border ${
                          bookingsFilter === filter
                            ? 'bg-gold/20 text-gold border-gold/30'
                            : 'bg-gold/[0.06] text-gold/70 hover:bg-gold/[0.1] border-gold/10'
                        }`}
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
                  {bookingsLoading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 border-b border-gold/[0.04] items-center">
                        <div className="col-span-1"><Skeleton className="h-4 w-16" /></div>
                        <div className="col-span-2"><Skeleton className="h-4 w-28" /></div>
                        <div className="col-span-2"><Skeleton className="h-4 w-32" /></div>
                        <div className="col-span-2"><Skeleton className="h-4 w-24" /></div>
                        <div className="col-span-1"><Skeleton className="h-4 w-16" /></div>
                        <div className="col-span-2"><Skeleton className="h-4 w-28" /></div>
                        <div className="col-span-2 flex justify-end"><Skeleton className="h-6 w-20 rounded-full" /></div>
                      </div>
                    ))
                  ) : bookings.length === 0 ? (
                    <div className="px-5 py-12 text-center text-gray-500 text-sm">No bookings found</div>
                  ) : (
                    bookings.map((booking, idx) => {
                      const statusLabel = capitalize(booking.status);
                      return (
                        <motion.div
                          key={booking.bookingId}
                          variants={fadeUp}
                          initial="hidden"
                          animate="visible"
                          custom={idx}
                          className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 border-b border-gold/[0.04] hover:bg-gold/[0.02] transition items-center"
                        >
                          <div className="col-span-1 text-xs text-gray-500 font-mono">{booking.bookingId.slice(0, 7)}</div>
                          <div className="col-span-2 text-sm text-white font-medium">{booking.name}</div>
                          <div className="col-span-2 text-sm text-gray-300">{booking.serviceName}</div>
                          <div className="col-span-2 text-sm text-gray-400 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-gray-600" />
                            {formatDate(booking.date)}
                          </div>
                          <div className="col-span-1 text-sm text-gray-400">{booking.time}</div>
                          <div className="col-span-2 text-sm text-gray-300">{booking.therapistName || '—'}</div>
                          <div className="col-span-2 flex justify-end">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider border ${statusStyles[statusLabel] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                              {statusLabel}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Pagination */}
                {bookingsPagination.pages > 1 && (
                  <div className="p-4 border-t border-gold/8 flex items-center justify-between">
                    <p className="text-[11px] text-gray-500">
                      Page {bookingsPagination.page} of {bookingsPagination.pages}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const controller = new AbortController();
                          fetchBookings(bookingsPagination.page - 1, bookingsFilter, controller.signal);
                        }}
                        disabled={bookingsPagination.page <= 1 || bookingsLoading}
                        className="p-1.5 rounded-lg border border-gold/10 bg-gold/[0.04] text-gold/60 hover:bg-gold/[0.08] hover:text-gold transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const controller = new AbortController();
                          fetchBookings(bookingsPagination.page + 1, bookingsFilter, controller.signal);
                        }}
                        disabled={bookingsPagination.page >= bookingsPagination.pages || bookingsLoading}
                        className="p-1.5 rounded-lg border border-gold/10 bg-gold/[0.04] text-gold/60 hover:bg-gold/[0.08] hover:text-gold transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
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
                      <span className="text-xs font-semibold">
                        {statsData ? `${statsData.kpis.revenueChange >= 0 ? '+' : ''}${statsData.kpis.revenueChange}%` : '+0%'}
                      </span>
                    </div>
                  </div>

                  {statsLoading ? (
                    <div className="flex items-end gap-3 h-48 px-2">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <Skeleton className="w-full rounded-t-lg" style={{ height: `${30 + idx * 10}%` }} />
                          <Skeleton className="h-3 w-6" />
                        </div>
                      ))}
                    </div>
                  ) : monthlyRevenue.length > 0 ? (
                    /* CSS Bar Chart */
                    <div className="flex items-end gap-3 h-48 px-2">
                      {monthlyRevenue.map((m, idx) => {
                        const maxVal = Math.max(...monthlyRevenue.map((x) => x.value), 1);
                        return (
                          <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${(m.value / maxVal) * 100}%` }}
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
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-500 text-sm">No revenue data available</div>
                  )}
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

                  {statsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between">
                            <Skeleton className="h-4 w-36" />
                            <div className="flex gap-3">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-8" />
                            </div>
                          </div>
                          <Skeleton className="h-5 w-full rounded-md" />
                        </div>
                      ))}
                    </div>
                  ) : (
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
                              style={{ background: `linear-gradient(to right, var(--gold, #D4AF37), var(--pink-brand, #E91E63))` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Revenue Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statsLoading
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="surface-raised rounded-2xl p-5 space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    ))
                  : revenueSummaryCards.map((card, idx) => (
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

              {/* Payment Method Breakdown */}
              {!statsLoading && statsData && statsData.paymentBreakdown.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="surface-raised rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-base font-semibold heading-display text-white">Payment Methods</h2>
                      <p className="text-[11px] text-gray-500 mt-0.5">Breakdown by payment type</p>
                    </div>
                    <DollarSign className="w-5 h-5 text-gold/30" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statsData.paymentBreakdown.map((pm, idx) => {
                      const colorKey = Object.keys(paymentMethodColors).find((k) => pm.method.toLowerCase().includes(k));
                      const color = colorKey ? paymentMethodColors[colorKey] : treatmentColors[idx % treatmentColors.length];
                      return (
                        <motion.div
                          key={pm.method}
                          variants={fadeUp}
                          initial="hidden"
                          animate="visible"
                          custom={idx}
                          className="p-4 rounded-xl border border-gold/[0.06] hover:bg-gold/[0.02] transition"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                              <DollarSign className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{capitalize(pm.method)}</p>
                              <p className="text-[11px] text-gray-500">{pm.count} transactions</p>
                            </div>
                          </div>
                          <p className="text-lg font-bold heading-display text-white">{formatCurrency(pm.total)}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
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

                  {clientsLoading ? (
                    <div className="flex items-center gap-4 mb-6">
                      <Skeleton className="w-32 h-32 rounded-full flex-shrink-0" />
                      <div className="space-y-3 flex-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-7 w-12" />
                        <Skeleton className="h-3 w-8" />
                        <Skeleton className="h-4 w-16 mt-2" />
                        <Skeleton className="h-7 w-12" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                    </div>
                  ) : (
                    <>
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
                          <span className="text-sm font-semibold text-emerald-400">{totalClientsForRatio > 0 ? ((returningClients / totalClientsForRatio) * 100).toFixed(0) : 0}%</span>
                        </div>
                        <div className="progress-bar mt-2">
                          <motion.div
                            className="progress-bar-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${totalClientsForRatio > 0 ? (returningClients / totalClientsForRatio) * 100 : 0}%` }}
                            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    </>
                  )}
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

                  {clientsLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3">
                          <Skeleton className="w-5 h-4" />
                          <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <Skeleton className="h-4 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : topClients.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 text-sm">No client data available</div>
                  ) : (
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
                                : client.tier === 'Silver'
                                  ? 'bg-gray-500/15 text-gray-300 border border-gray-500/20'
                                  : 'bg-gray-600/15 text-gray-400 border border-gray-600/20'
                          }`}>
                            {client.avatar}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white truncate group-hover:text-gold transition">{client.name}</p>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider border ${tierBadge[client.tier] ?? tierBadge.None}`}>
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
                  )}
                </motion.div>
              </div>

              {/* Client Growth Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {clientsLoading
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="surface-raised rounded-2xl p-5 space-y-2">
                        <Skeleton className="w-5 h-5" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    ))
                  : [
                      { label: 'New This Month', value: newClients.toString(), change: `${clientsPagination.total} total clients`, positive: true, icon: Users },
                      { label: 'Avg Lifetime Value', value: clients.length > 0 ? formatCurrency(Math.round(clients.reduce((s, c) => s + c.totalSpent, 0) / clients.length)) : 'K0', change: 'Per client average', positive: true, icon: DollarSign },
                      { label: 'Active Members', value: clients.filter((c) => c.isMember).length.toString(), change: `of ${clients.length} total`, positive: true, icon: TrendingUp },
                      { label: 'Completion Rate', value: clients.length > 0 ? `${Math.round((clients.reduce((s, c) => s + c.completedBookings, 0) / Math.max(clients.reduce((s, c) => s + c.totalBookings, 0), 1)) * 100)}%` : '0%', change: 'Bookings completed', positive: true, icon: Activity },
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

              {/* Client Pagination */}
              {clientsPagination.pages > 1 && (
                <div className="surface-raised rounded-2xl p-4 flex items-center justify-between">
                  <p className="text-[11px] text-gray-500">
                    Showing {clients.length} of {clientsPagination.total} clients · Page {clientsPagination.page} of {clientsPagination.pages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const controller = new AbortController();
                        fetchClients(clientsPagination.page - 1, controller.signal);
                      }}
                      disabled={clientsPagination.page <= 1 || clientsLoading}
                      className="p-1.5 rounded-lg border border-gold/10 bg-gold/[0.04] text-gold/60 hover:bg-gold/[0.08] hover:text-gold transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const controller = new AbortController();
                        fetchClients(clientsPagination.page + 1, controller.signal);
                      }}
                      disabled={clientsPagination.page >= clientsPagination.pages || clientsLoading}
                      className="p-1.5 rounded-lg border border-gold/10 bg-gold/[0.04] text-gold/60 hover:bg-gold/[0.08] hover:text-gold transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}