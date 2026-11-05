
// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ShieldCheck, Mail, Lock, User, Building, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', businessName: '', email: '', mobile: '', password: '', confirmPassword: '', agree: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/login'); // Move back on resolve
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row justify-center items-stretch text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Left Artwork */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-cyan-800/20 z-0 pointer-events-none" />
        
        <Link to="/" className="flex items-center gap-3 z-10 self-start">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Udyam<span className="text-blue-500">Digital</span>
          </span>
        </Link>

        <div className="my-auto z-10 relative flex flex-col items-center">
          <img 
            src="/assets/auth-banner.png" 
            alt="Udyam Digital" 
            className="w-full max-w-lg object-contain rounded-2xl drop-shadow-2xl mb-8"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600";
            }}
          />
          <div className="text-center space-y-3 px-4">
            <h3 className="text-2xl font-extrabold text-white leading-tight">Simplifying telecom digital onboarding</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              Verify URN/GST certificates, generate custom bundles, and explore compliance.
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 z-10">© 2026 UdyamDigital. Platform Secured.</span>
      </div>

      {/* Right Form Panel */}
      <div className="flex-grow lg:w-1/2 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-24 bg-slate-950 relative">
        <div className="absolute top-10 left-10 lg:hidden">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Link>
        </div>

        <div className="max-w-md w-full space-y-8 relative">
          
          <div className="text-center lg:text-left space-y-2.5">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2.5 lg:hidden mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">UdyamDigital</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Create an Account
            </h2>
            <p className="text-slate-400 text-sm">
              Let's get your business profile set up on the platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            
            {/* Split row Name and Business name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><User className="w-4 h-4" /></span>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-sm transition-all focus:outline-hidden text-white placeholder:text-slate-650"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Business Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Building className="w-4 h-4" /></span>
                  <input
                    type="text"
                    required
                    placeholder="XYZ Enterprises"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-sm transition-all focus:outline-hidden text-white placeholder:text-slate-650"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Split Email & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Mail className="w-4 h-4" /></span>
                  <input
                    type="email"
                    required
                    placeholder="name@business.com"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-sm transition-all focus:outline-hidden text-white"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Phone className="w-4 h-4" /></span>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-sm transition-all focus:outline-hidden text-white"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Split Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Lock className="w-4 h-4" /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-sm transition-all focus:outline-hidden text-white"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Lock className="w-4 h-4" /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-sm"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* T&C checkbox */}
            <div className="flex items-center">
              <label className="relative flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  className="sr-only peer"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                />
                <div className="w-5 h-5 bg-slate-900 rounded border border-slate-800 flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-500 transition-colors">
                  {formData.agree && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-xs text-slate-400 font-medium leading-relaxed">
                  I agree to the <span className="text-blue-400 hover:text-blue-300">Terms of Service</span> and <span className="text-blue-400 hover:text-blue-300">Privacy Policy</span>.
                </span>
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
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Prompt footer */}
          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 ml-1">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}