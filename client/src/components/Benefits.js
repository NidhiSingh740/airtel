
// src/components/Benefits.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, FileText, Layers, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

export default function Benefits() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const benefitsList = [
    {
      icon: Clock,
      title: t('benefits.fasterTitle', '10x Faster Onboarding'),
      description: t('benefits.fasterDesc', 'Complete business verification, package recommendation, and quote generation in under 5 minutes.'),
      iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    },
    {
      icon: FileText,
      title: t('benefits.paperworkTitle', 'Zero Manual Paperwork'),
      description: t('benefits.paperworkDesc', 'Automated OCR scanning parses Udyam & GST certificates directly, eliminating manual entry errors.'),
      iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    },
    {
      icon: Layers,
      title: t('benefits.platformTitle', 'One Unified Platform'),
      description: t('benefits.platformDesc', 'From initial AI consultation to lead management and order tracking—all streamlined in one place.'),
      iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    },
  ];

  return (
    <section id="benefits" className="relative bg-slate-900 text-slate-100 py-20 lg:py-28 border-t border-slate-800 selection:bg-blue-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Benefits Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5" />
                <span>Value Proposition</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {t('benefits.title', 'Designed to Eliminate Friction & Accelerate MSME Scale')}
              </h2>

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                Traditional enterprise telecom onboarding takes weeks of back-and-forth manual verification. Udyam Digital condenses the journey into an intelligent digital workflow.
              </p>
            </div>

            {/* Benefit Items */}
            <div className="space-y-6">
              {benefitsList.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${item.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Action Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 rounded-3xl blur-2xl pointer-events-none -z-10" />
            
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <span className="text-sm font-bold text-white">DPDP Act 2023 Compliant</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Secure Pipeline
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Ready to test the digital verification engine?
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Start with the Saathi AI Assistant or jump straight to document validation to verify sample Udyam certificates.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => navigate('/advisor')}
                  className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  <span>Launch Saathi AI Advisor</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/kyc')}
                  className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all border border-slate-700 cursor-pointer"
                >
                  <span>Try Digital KYC Upload</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}