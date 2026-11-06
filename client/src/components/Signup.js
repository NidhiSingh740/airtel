// src/components/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Building, Phone, ArrowLeft } from 'lucide-react';
import { AirtelIcon } from './AirtelLogo';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', businessName: '', email: '', mobile: '', password: '', confirmPassword: '', agree: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1200);
  };

  const inputClass = "block w-full pl-10 pr-4 py-2.5 bg-airtel-surface border border-airtel-border rounded-xl text-sm transition-all focus:outline-none focus:border-airtel-red focus:ring-1 focus:ring-airtel-red text-airtel-charcoal placeholder:text-airtel-muted";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-airtel-slate";

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row justify-center items-stretch text-airtel-charcoal font-sans selection:bg-airtel-red selection:text-white">

      {/* Left Artwork */}
      <div className="hidden lg:flex lg:w-1/2 bg-airtel-red flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <Link to="/" className="flex items-center gap-3 z-10 self-start">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-xs">
            <AirtelIcon className="w-6 h-6" fill="#b22020" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight text-white">AccelSaathi</span>
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">by Airtel Business</span>
          </div>
        </Link>

        <div className="my-auto z-10 relative flex flex-col items-center text-center space-y-6 px-4">
          <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center">
            <Building className="w-12 h-12 text-white stroke-[1.5]" />
          </div>
          <h3 className="text-3xl font-extrabold text-white leading-tight">
            Simplifying telecom<br />digital onboarding
          </h3>
          <p className="text-white/75 text-sm max-w-sm leading-relaxed">
            Verify Udyam/GST certificates, generate custom bundles, and explore MSME compliance — all in one place.
          </p>
        </div>

        <span className="text-xs text-white/50 z-10">© 2026 Bharti Airtel Limited. Platform Secured.</span>
      </div>

      {/* Right Form Panel */}
      <div className="flex-grow lg:w-1/2 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-24 bg-white relative">
        <div className="absolute top-10 left-10 lg:hidden">
          <Link to="/" className="flex items-center gap-2 text-airtel-slate hover:text-airtel-charcoal transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Link>
        </div>

        <div className="max-w-md w-full space-y-6 relative">

          <div className="text-center lg:text-left space-y-2.5">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2.5 lg:hidden mb-3">
              <div className="w-9 h-9 rounded-lg bg-airtel-red-light border border-airtel-red/10 flex items-center justify-center shadow-xs">
                <AirtelIcon className="w-5 h-5" fill="#b22020" />
              </div>
              <div className="flex flex-col leading-none text-left">
                <span className="font-extrabold text-lg text-airtel-charcoal">AccelSaathi</span>
                <span className="text-[9px] font-bold text-airtel-slate uppercase tracking-widest">by Airtel Business</span>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-airtel-charcoal tracking-tight">
              Create an Account
            </h2>
            <p className="text-airtel-slate text-sm">
              Let's get your business profile set up on the platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">

            {/* Name & Business */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-airtel-muted"><User className="w-4 h-4" /></span>
                  <input type="text" required placeholder="John Doe" className={inputClass} value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Business Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-airtel-muted"><Building className="w-4 h-4" /></span>
                  <input type="text" required placeholder="XYZ Enterprises" className={inputClass} value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Email & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-airtel-muted"><Mail className="w-4 h-4" /></span>
                  <input type="email" required placeholder="name@business.com" className={inputClass} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-airtel-muted"><Phone className="w-4 h-4" /></span>
                  <input type="tel" required placeholder="+91 9876543210" className={inputClass} value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-airtel-muted"><Lock className="w-4 h-4" /></span>
                  <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••••••" className={inputClass + ' pr-10'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-airtel-muted hover:text-airtel-charcoal" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-airtel-muted"><Lock className="w-4 h-4" /></span>
                  <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••••••" className={inputClass} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                </div>
              </div>
            </div>

            {/* T&C */}
            <div className="flex items-center">
              <label className="relative flex items-start gap-2 cursor-pointer select-none">
                <input type="checkbox" required className="sr-only peer" checked={formData.agree} onChange={(e) => setFormData({ ...formData, agree: e.target.checked })} />
                <div className="w-5 h-5 bg-airtel-surface rounded border border-airtel-border flex items-center justify-center peer-checked:bg-airtel-red peer-checked:border-airtel-red transition-colors mt-0.5 shrink-0">
                  {formData.agree && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-xs text-airtel-slate font-medium leading-relaxed">
                  I agree to the <span className="text-airtel-red hover:text-airtel-red-hover cursor-pointer">Terms of Service</span> and <span className="text-airtel-red hover:text-airtel-red-hover cursor-pointer">Privacy Policy</span>.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-airtel-red hover:bg-airtel-red-hover text-white font-semibold text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 min-h-[52px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-airtel-slate">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-airtel-red hover:text-airtel-red-hover ml-1">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
