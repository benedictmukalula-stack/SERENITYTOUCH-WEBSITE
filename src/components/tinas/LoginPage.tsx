'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Shield, ChevronDown, ChevronUp, Check, UserPlus, Phone, Crown, User } from 'lucide-react';
import { useAppStore, type Member } from '@/lib/store';

// Demo accounts for showcase
const demoAccounts: Record<string, { password: string; member: Member }> = {
  'silver@serenitytouch.co.zm': {
    password: 'silver2026',
    member: {
      id: 'MEM-001',
      name: 'Chipo Mwale',
      email: 'silver@serenitytouch.co.zm',
      phone: '+260 779 721 772',
      tier: 'Silver',
      memberSince: '2025-03-15',
      bookingsUsed: 4,
      bookingsRemaining: 1,
      nextBilling: '2026-08-15',
    },
  },
  'gold@serenitytouch.co.zm': {
    password: 'gold2026',
    member: {
      id: 'MEM-002',
      name: 'Bwalya Nkomo',
      email: 'gold@serenitytouch.co.zm',
      phone: '+260 977 555 123',
      tier: 'Gold',
      memberSince: '2024-11-01',
      bookingsUsed: 18,
      bookingsRemaining: 2,
      nextBilling: '2026-08-01',
    },
  },
  'platinum@serenitytouch.co.zm': {
    password: 'platinum2026',
    member: {
      id: 'MEM-003',
      name: 'Grace Banda',
      email: 'platinum@serenitytouch.co.zm',
      phone: '+260 955 888 456',
      tier: 'Platinum',
      memberSince: '2024-06-01',
      bookingsUsed: 52,
      bookingsRemaining: -1, // unlimited
      nextBilling: '2026-08-01',
    },
  },
};

export default function LoginPage() {
  const { navigate, loginMember, isMemberLoggedIn } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', tier: 'Silver' });

  if (isMemberLoggedIn) {
    navigate('dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.member) {
        loginMember(data.member);
        navigate('dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (tier: string) => {
    const demoEmail = `${tier}@serenitytouch.co.zm`;
    const demo = demoAccounts[demoEmail];
    if (demo) {
      loginMember(demo.member);
      navigate('dashboard');
    }
  };

  return (
    <div>
      <section className="pt-32 pb-16" style={{ background: '#030102' }}>
        <div className="container-tinas text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-5 heading-display">Member Login</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-pink-glow/35 max-w-2xl mx-auto body-serif font-light">Access your exclusive member dashboard and manage your wellness journey.</motion.p>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas max-w-md mx-auto">
          <motion.div initial="hidden" animate="visible" variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}>
            <div className="surface-raised rounded-2xl p-8 glow-gold">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold heading-display text-white">Secure Login</h2>
                  <p className="text-[11px] text-gold/40">256-bit encrypted connection</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gold/15 rounded-xl bg-gold/[0.04] focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gold/30"
                      placeholder="member@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-12 py-3 border border-gold/15 rounded-xl bg-gold/[0.04] focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gold/30"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold/70 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-3.5 text-sm font-semibold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gold/8">
                <p className="text-[11px] text-gold/30 text-center mb-4">Forgot your password? Contact us via WhatsApp</p>
                <a
                  href="https://wa.me/260761404555?text=Hello%20Serenity%20Touch%20Spa.%20I%20need%20help%20with%20my%20member%20login."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center text-sm text-green-400 hover:text-green-300 transition cursor-pointer"
                >
                  Reset via WhatsApp &rarr;
                </a>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="mt-8 surface-raised rounded-2xl p-6">
              <p className="text-[10px] tracking-[0.15em] text-gold/40 font-semibold mb-3 uppercase">Demo Accounts (Showcase)</p>
              <div className="space-y-2">
                {[
                  { tier: 'Silver', email: 'silver@serenitytouch.co.zm', color: 'border-gold/15' },
                  { tier: 'Gold', email: 'gold@serenitytouch.co.zm', color: 'border-gold/25' },
                  { tier: 'Platinum', email: 'platinum@serenitytouch.co.zm', color: 'border-pink-brand/25' },
                ].map((demo) => (
                  <button
                    key={demo.tier}
                    onClick={() => handleDemoLogin(demo.tier.toLowerCase())}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border ${demo.color} bg-gold/[0.02] hover:bg-gold/[0.05] transition cursor-pointer`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">{demo.tier} Member</p>
                      <p className="text-[11px] text-gold/35">{demo.email}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gold/35" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Create Account Section */}
          <div className="mt-6">
            <button
              onClick={() => setShowRegister(!showRegister)}
              className="w-full text-center text-sm text-gold/50 hover:text-gold/80 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {showRegister ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              New to Serenity Touch Spa? Create an account
            </button>

            <motion.div
              initial={false}
              animate={{ height: showRegister ? 'auto' : 0, opacity: showRegister ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 surface-raised rounded-2xl p-8">
                {registerSuccess ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold heading-display text-white mb-2">Account Created!</h3>
                    <p className="text-sm text-pink-glow/40 body-serif font-light">Welcome to Serenity Touch Spa. Please sign in with your new credentials.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold heading-display text-white">Create Account</h2>
                        <p className="text-[11px] text-gold/40">Join our exclusive wellness community</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                          <input
                            type="text"
                            value={regForm.name}
                            onChange={(e) => setRegForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 border border-gold/15 rounded-xl bg-gold/[0.04] focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gold/30"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                          <input
                            type="email"
                            value={regForm.email}
                            onChange={(e) => setRegForm(p => ({ ...p, email: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 border border-gold/15 rounded-xl bg-gold/[0.04] focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gold/30"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                          <input
                            type="tel"
                            value={regForm.phone}
                            onChange={(e) => setRegForm(p => ({ ...p, phone: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 border border-gold/15 rounded-xl bg-gold/[0.04] focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gold/30"
                            placeholder="+260 9XX XXX XXX"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                          <input
                            type="password"
                            value={regForm.password}
                            onChange={(e) => setRegForm(p => ({ ...p, password: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 border border-gold/15 rounded-xl bg-gold/[0.04] focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gold/30"
                            placeholder="Create a password"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                          <input
                            type="password"
                            value={regForm.confirmPassword}
                            onChange={(e) => setRegForm(p => ({ ...p, confirmPassword: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 border border-gold/15 rounded-xl bg-gold/[0.04] focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gold/30"
                            placeholder="Confirm your password"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Preferred Tier</label>
                        <div className="relative">
                          <Crown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                          <select
                            value={regForm.tier}
                            onChange={(e) => setRegForm(p => ({ ...p, tier: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 border border-gold/15 rounded-xl bg-gold/[0.04] focus:outline-none focus:border-gold text-sm text-white transition appearance-none cursor-pointer"
                          >
                            <option value="Silver" className="bg-gray-900">Silver — K500/mo</option>
                            <option value="Gold" className="bg-gray-900">Gold — K1,500/mo</option>
                            <option value="Platinum" className="bg-gray-900">Platinum — K3,000/mo</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 pointer-events-none" />
                        </div>
                      </div>
                      <button
                        onClick={() => setRegisterSuccess(true)}
                        className="w-full btn-gold py-3.5 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Create Account
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}