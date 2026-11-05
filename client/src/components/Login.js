
// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ShieldCheck, Mail, Lock, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mimic payload simulation logic
    setTimeout(() => {
      setLoading(false);
      navigate('/'); // Go back home on verify
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row justify-center items-stretch text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Left Column: Visual Artwork (Desktop hidden mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-cyan-800/20 z-0 pointer-events-none" />
        
        {/* Branding Logo */}
        <Link to="/" className="flex items-center gap-3 z-10 self-start group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Udyam<span className="text-blue-500">Digital</span>
          </span>
        </Link>

        {/* Dynamic Generative Art */}
        <div className="my-auto z-10 relative flex flex-col items-center">
          <img 
            src="/assets/auth-banner.png" 
            alt="Udyam Digital" 
            className="w-full max-w-lg object-contain rounded-2xl drop-shadow-2xl mb-8 transform hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => {
              // Fallback to illustration if local assets are not present
              e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600";
            }}
          />
          <div className="text-center space-y-3 px-4">
            <h3 className="text-2xl font-extrabold text-white leading-tight">Empowering India’s Micro & Small Enterprises</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              Automated document verification, instant AI assistance, and premium telecom configuration workflows.
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 z-10">© 2026 UdyamDigital. Platform Secured.</span>
      </div>

      {/* Right Column: Form Panel */}
      <div className="flex-grow lg:w-1/2 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-24 bg-slate-950 relative">
        <div className="absolute top-10 left-10 lg:hidden">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Link>
        </div>

        <div className="max-w-md w-full space-y-8 relative">
          
          {/* Header */}
          <div className="text-center lg:text-left space-y-2.5">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2.5 lg:hidden mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">UdyamDigital</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {t('login.title', 'Welcome back')}
            </h2>
            <p className="text-slate-400 text-sm">
              Please enter your details to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@business.com"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-850 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm placeholder:text-slate-600 transition-all text-white focus:outline-hidden"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <Link to="/forgot" className="text-xs font-semibold text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  className="block w-full pl-11 pr-11 py-3 bg-slate-900 border border-slate-850 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm placeholder:text-slate-600 transition-all text-white focus:outline-hidden"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Options */}
            <div className="flex items-center justify-between">
              <label className="relative flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <div className="w-5 h-5 bg-slate-900 rounded border border-slate-800 flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-500 transition-colors">
                  {formData.rememberMe && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-xs text-slate-400 font-medium">Remember me</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Prompt footer */}
          <p className="text-center text-sm text-slate-400">
            Don’t have an account?{' '}
            <Link to="/signup" className="font-semibold text-blue-400 hover:text-blue-300 ml-1">
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}