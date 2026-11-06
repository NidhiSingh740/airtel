// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from 'lucide-react';
import { AirtelIcon } from './AirtelLogo';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row justify-center items-stretch text-airtel-charcoal font-sans">

      {/* Left Column — Brand panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-airtel-red flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle diagonal line texture */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
            backgroundSize: '12px 12px',
          }}
        />

        {/* Logo — links back to home */}
        <Link to="/" className="flex items-center gap-2.5 z-10 self-start">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-xs">
            <AirtelIcon className="w-5 h-5" fill="#b22020" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-white">AccelSaathi</span>
            <span className="text-[9px] font-semibold text-white/80 uppercase tracking-widest">by Airtel Business</span>
          </div>
        </Link>

        {/* Center copy */}
        <div className="z-10 space-y-5">
          <h2 className="text-3xl font-extrabold text-white leading-snug">
            Connecting India's<br />small businesses.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Fibre, SIMs, cloud services, and digital KYC — all in one place, without visiting a store.
          </p>
          <div className="pt-2 space-y-2.5">
            {[
              '15 lakh+ businesses onboarded',
              'No branch visit required',
              '24×7 support',
            ].map((item, i) => (
              <div key={i} className="text-sm text-white/80 flex items-center gap-2">
                <span className="w-1 h-4 bg-white/40 rounded-full shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <span className="text-xs text-white/40 z-10">© 2026 Bharti Airtel Limited.</span>
      </div>

      {/* Right Column — Form */}
      <div className="flex-grow lg:w-7/12 flex flex-col bg-white">

        {/* Back to Home — always visible, top of form panel */}
        <div className="px-6 pt-6 lg:px-12 lg:pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-airtel-slate hover:text-airtel-charcoal transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Form centered in remaining space */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12">
          <div className="w-full max-w-sm space-y-6">

            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 lg:hidden mb-2">
              <div className="w-8 h-8 rounded-lg bg-airtel-red-light border border-airtel-red/10 flex items-center justify-center shadow-xs">
                <AirtelIcon className="w-4.5 h-4.5" fill="#b22020" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-base text-airtel-charcoal">AccelSaathi</span>
                <span className="text-[8px] font-bold text-airtel-slate uppercase tracking-widest">by Airtel Business</span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-airtel-charcoal">
                {t('login.title', 'Sign in')}
              </h1>
              <p className="mt-1 text-sm text-airtel-slate">
                Enter your registered email and password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-airtel-charcoal uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-airtel-muted" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@business.com"
                    className="block w-full pl-10 pr-4 py-2.5 bg-white border border-airtel-border rounded-lg focus:border-airtel-red focus:ring-1 focus:ring-airtel-red text-sm placeholder:text-airtel-muted text-airtel-charcoal focus:outline-none transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold text-airtel-charcoal uppercase tracking-wider">
                    Password
                  </label>
                  <Link to="/forgot" className="text-xs text-airtel-red hover:text-airtel-red-hover font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-airtel-muted" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 bg-white border border-airtel-border rounded-lg focus:border-airtel-red focus:ring-1 focus:ring-airtel-red text-sm placeholder:text-airtel-muted text-airtel-charcoal focus:outline-none transition-colors"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-airtel-muted hover:text-airtel-charcoal"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  />
                  <div className="w-4 h-4 bg-white rounded border border-airtel-border flex items-center justify-center peer-checked:bg-airtel-red peer-checked:border-airtel-red transition-colors">
                    {formData.rememberMe && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                  </div>
                  <span className="text-xs text-airtel-slate">Keep me signed in</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-2.5 px-4 bg-airtel-red hover:bg-airtel-red-hover text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-60 min-h-[44px]"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Sign In'
                }
              </button>
            </form>

            <p className="text-center text-sm text-airtel-slate">
              New to Accel?{' '}
              <Link to="/signup" className="font-semibold text-airtel-red hover:text-airtel-red-hover">
                Create an account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
