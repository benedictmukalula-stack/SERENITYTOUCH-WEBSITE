'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function AdminLoginPage() {
  const { isAdminLoggedIn, loginAdmin, navigate } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAdminLoggedIn) {
    navigate('analytics');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.admin) {
        loginAdmin(data.admin);
        navigate('analytics');
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="pt-32 pb-16" style={{ background: '#030102' }}>
        <div className="container-tinas text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-5 heading-display">Admin Portal</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-pink-glow/35 max-w-2xl mx-auto body-serif font-light">Staff management and business analytics</motion.p>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas max-w-md mx-auto">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
            <div className="surface-raised rounded-2xl p-8 glow-gold">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold heading-display text-white">Admin Login</h2>
                  <p className="text-[11px] text-gold/40">256-bit encrypted connection</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      className="w-full pl-11 pr-4 py-3 border border-gold/15 rounded-xl bg-gold/[0.04] focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gold/30"
                      placeholder="admin@serenitytouch.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                      className="w-full pl-11 pr-12 py-3 border border-gold/15 rounded-xl bg-gold/[0.04] focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gold/30"
                      placeholder="Enter your password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold/70 transition cursor-pointer">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</div>}
                <button type="submit" disabled={loading}
                  className="w-full btn-gold py-3.5 text-sm font-semibold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gold/8">
                <button onClick={() => navigate('login')}
                  className="text-[11px] text-gold/30 hover:text-gold/60 transition cursor-pointer">
                  &larr; Back to Member Login
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-[11px] text-gold/25 body-serif font-light">Authorized access only. All actions are logged.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}