'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useAppStore, type Member } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const inputClass =
  'w-full pl-11 pr-4 py-3 border border-gold/15 rounded-xl bg-gold/[0.04] focus:outline-none focus:border-gold text-sm text-white transition placeholder:text-gold/30';

interface RegisterForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  agreeTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const tierOptions: { name: 'Silver' | 'Gold' | 'Platinum'; price: string; color: string; description: string }[] = [
  { name: 'Silver', price: 'K500/mo', color: 'border-gray-400/30 bg-gray-400/[0.04] text-gray-300', description: '1 massage/month, 10% off services' },
  { name: 'Gold', price: 'K1,500/mo', color: 'border-gold/30 bg-gold/[0.06] text-gold', description: '2 massages/month, 20% off, VIP booking' },
  { name: 'Platinum', price: 'K3,000/mo', color: 'border-pink-brand/30 bg-pink-brand/[0.06] text-pink-brand', description: 'Unlimited massages, 30% off, concierge' },
];

export default function MemberRegistration() {
  const { navigate, loginMember, isMemberLoggedIn } = useAppStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);

  const [form, setForm] = useState<RegisterForm>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    tier: 'Silver',
    agreeTerms: false,
  });

  if (isMemberLoggedIn) {
    navigate('dashboard');
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+260\s?\d{3}\s?\d{3}\s?\d{3}$/.test(form.phone.replace(/\s/g, '').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3'))) {
      // More lenient check - just needs +260 prefix
      if (!form.phone.startsWith('+260')) {
        newErrors.phone = 'Phone must start with +260';
      }
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!form.agreeTerms) {
      newErrors.terms = 'You must agree to the terms & conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1800));

    setRegisterSuccess(true);
    setLoading(false);

    // Show verification message after a short delay
    setTimeout(() => {
      setVerificationSent(true);
    }, 1200);

    // Auto-login with mock member data and navigate
    setTimeout(() => {
      const newMember: Member = {
        id: 'MEM-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        tier: form.tier,
        memberSince: new Date().toISOString().split('T')[0],
        bookingsUsed: 0,
        bookingsRemaining: form.tier === 'Platinum' ? -1 : form.tier === 'Gold' ? 2 : 1,
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      loginMember(newMember);
      navigate('dashboard');
    }, 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (data.success && data.member) {
        loginMember(data.member);
        navigate('dashboard');
      } else {
        setLoginError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setLoginError('Connection error. Please check your network and try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="pt-32 pb-16" style={{ background: '#030102' }}>
        <div className="container-tinas text-center">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 text-gold/50 hover:text-gold/80 text-sm mb-6 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </motion.button>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] tracking-[0.25em] text-gold/50 mb-4 heading-display"
          >
            MEMBER PORTAL
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display"
          >
            Member <span className="text-gradient-sexy">Portal</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-pink-glow/35 max-w-2xl mx-auto body-serif font-light"
          >
            Join Our Wellness Community
          </motion.p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="section-padding surface-base">
        <div className="container-tinas max-w-lg mx-auto">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
            <div className="surface-raised rounded-2xl overflow-hidden glow-gold">
              {/* Tab Toggle */}
              <div className="flex border-b border-gold/10">
                {(['login', 'register'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold heading-display transition cursor-pointer relative ${
                      activeTab === tab ? 'text-gold' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tab === 'login' ? 'Sign In' : 'Register'}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-pink-brand"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* LOGIN TAB */}
                {activeTab === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold heading-display text-white">Welcome Back</h2>
                        <p className="text-[11px] text-gold/40">Sign in to your member account</p>
                      </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            className={inputClass}
                            placeholder="member@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                          <input
                            type={loginShowPassword ? 'text' : 'password'}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            className={`${inputClass} !pr-12`}
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setLoginShowPassword(!loginShowPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold/70 transition cursor-pointer"
                          >
                            {loginShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {loginError && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                        >
                          {loginError}
                        </motion.div>
                      )}

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full btn-gold py-3.5 text-sm font-semibold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {loginLoading ? (
                          <>
                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </button>
                    </form>

                    <p className="text-center text-xs text-gold/35 mt-6">
                      Don&apos;t have an account?{' '}
                      <button onClick={() => setActiveTab('register')} className="text-gold hover:text-gold-light transition cursor-pointer font-semibold">
                        Create one
                      </button>
                    </p>
                  </motion.div>
                )}

                {/* REGISTER TAB */}
                {activeTab === 'register' && (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <AnimatePresence mode="wait">
                      {/* Success State */}
                      {registerSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-8"
                        >
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                            className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
                          >
                            <CheckCircle className="w-10 h-10 text-emerald-400" />
                          </motion.div>

                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-xl font-bold heading-display text-white mb-2"
                          >
                            Account Created!
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.65 }}
                            className="text-sm text-gold/50 body-serif font-light mb-4"
                          >
                            Welcome to Serenity Touch Spa, {form.fullName.split(' ')[0]}!
                          </motion.p>

                          {verificationSent && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8 }}
                              className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4"
                            >
                              <p className="text-amber-300 text-sm flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email verification sent to {form.email}
                              </p>
                            </motion.div>
                          )}

                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                          >
                            <div className="progress-bar w-48 mx-auto">
                              <motion.div
                                className="progress-bar-fill"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 2, ease: 'easeInOut' }}
                              />
                            </div>
                            <p className="text-[11px] text-gray-500 mt-3">Redirecting to your dashboard...</p>
                          </motion.div>
                        </motion.div>
                      ) : (
                        /* Registration Form */
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-pink-brand/10 border border-pink-brand/20 flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-pink-brand" />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold heading-display text-white">Create Account</h2>
                              <p className="text-[11px] text-gold/40">Join our exclusive wellness community</p>
                            </div>
                          </div>

                          <form onSubmit={handleRegister} className="space-y-4">
                            {/* Full Name */}
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name</label>
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                                <input
                                  type="text"
                                  value={form.fullName}
                                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                                  className={`${inputClass} ${errors.fullName ? '!border-red-500/50' : ''}`}
                                  placeholder="Your full name"
                                />
                              </div>
                              {errors.fullName && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.fullName}</p>}
                            </motion.div>

                            {/* Email */}
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email Address</label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                                <input
                                  type="email"
                                  value={form.email}
                                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                  className={`${inputClass} ${errors.email ? '!border-red-500/50' : ''}`}
                                  placeholder="your@email.com"
                                />
                              </div>
                              {errors.email && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.email}</p>}
                            </motion.div>

                            {/* Phone */}
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Phone Number</label>
                              <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                                <input
                                  type="tel"
                                  value={form.phone}
                                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                  className={`${inputClass} ${errors.phone ? '!border-red-500/50' : ''}`}
                                  placeholder="+260 9XX XXX XXX"
                                />
                              </div>
                              {errors.phone && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.phone}</p>}
                            </motion.div>

                            {/* Password */}
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Password</label>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  value={form.password}
                                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                  className={`${inputClass} !pr-12 ${errors.password ? '!border-red-500/50' : ''}`}
                                  placeholder="Create a password (min 6 characters)"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold/70 transition cursor-pointer"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                              {errors.password && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.password}</p>}
                            </motion.div>

                            {/* Confirm Password */}
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
                              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Confirm Password</label>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                                <input
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  value={form.confirmPassword}
                                  onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                                  className={`${inputClass} !pr-12 ${errors.confirmPassword ? '!border-red-500/50' : ''}`}
                                  placeholder="Confirm your password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold/70 transition cursor-pointer"
                                >
                                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                              {errors.confirmPassword && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.confirmPassword}</p>}
                            </motion.div>

                            {/* Membership Tier */}
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
                              <label className="block text-xs font-semibold text-gray-400 mb-2">Preferred Membership Tier</label>
                              <div className="space-y-2">
                                {tierOptions.map((tier) => (
                                  <label
                                    key={tier.name}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                      form.tier === tier.name
                                        ? tier.color
                                        : 'border-gold/10 bg-gold/[0.02] hover:bg-gold/[0.04] hover:border-gold/20'
                                    }`}
                                  >
                                    <div className="relative flex-shrink-0">
                                      <input
                                        type="radio"
                                        name="tier"
                                        value={tier.name}
                                        checked={form.tier === tier.name}
                                        onChange={(e) => setForm((p) => ({ ...p, tier: e.target.value as 'Silver' | 'Gold' | 'Platinum' }))}
                                        className="sr-only"
                                      />
                                      <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                                          form.tier === tier.name
                                            ? tier.name === 'Platinum'
                                              ? 'border-pink-brand'
                                              : tier.name === 'Gold'
                                                ? 'border-gold'
                                                : 'border-gray-400'
                                            : 'border-gold/20'
                                        }`}
                                      >
                                        {form.tier === tier.name && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={`w-2.5 h-2.5 rounded-full ${
                                              tier.name === 'Platinum'
                                                ? 'bg-pink-brand'
                                                : tier.name === 'Gold'
                                                  ? 'bg-gold'
                                                  : 'bg-gray-400'
                                            }`}
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <span className={`text-sm font-semibold heading-display ${form.tier === tier.name ? 'text-white' : 'text-gray-300'}`}>
                                          {tier.name}
                                        </span>
                                        <span className={`text-xs font-semibold ${form.tier === tier.name ? 'text-white' : 'text-gray-500'}`}>
                                          {tier.price}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-gray-500 mt-0.5">{tier.description}</p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </motion.div>

                            {/* Terms & Conditions */}
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
                              <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative mt-0.5 flex-shrink-0">
                                  <input
                                    type="checkbox"
                                    checked={form.agreeTerms}
                                    onChange={(e) => setForm((p) => ({ ...p, agreeTerms: e.target.checked }))}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                                      form.agreeTerms ? 'border-gold bg-gold/10' : 'border-gold/20 group-hover:border-gold/40'
                                    }`}
                                  >
                                    {form.agreeTerms && (
                                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        <CheckCircle className="w-3.5 h-3.5 text-gold" />
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                                <span className="text-xs text-gray-400 leading-relaxed">
                                  I agree to the{' '}
                                  <span className="text-gold/70 hover:text-gold transition cursor-pointer underline decoration-gold/30 underline-offset-2">
                                    Terms & Conditions
                                  </span>{' '}
                                  and{' '}
                                  <span className="text-gold/70 hover:text-gold transition cursor-pointer underline decoration-gold/30 underline-offset-2">
                                    Privacy Policy
                                  </span>
                                </span>
                              </label>
                              {errors.terms && <p className="text-red-400 text-[11px] mt-1 ml-1">{errors.terms}</p>}
                            </motion.div>

                            {/* Submit */}
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
                              <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-pink py-3.5 text-sm font-semibold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                              >
                                {loading ? (
                                  <>
                                    <motion.span
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                    Creating Account...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4" />
                                    Create Account
                                  </>
                                )}
                              </button>
                            </motion.div>
                          </form>

                          <div className="mt-6 pt-5 border-t border-gold/8">
                            <p className="text-center text-xs text-gold/35">
                              Already have an account?{' '}
                              <button onClick={() => setActiveTab('login')} className="text-gold hover:text-gold-light transition cursor-pointer font-semibold">
                                Sign in
                              </button>
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Security Note */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-[10px] text-gray-600 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                Your information is protected with 256-bit SSL encryption
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}