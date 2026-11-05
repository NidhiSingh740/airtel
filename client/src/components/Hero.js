// src/components/Hero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Building2 
} from 'lucide-react';

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative bg-slate-950 text-slate-100 pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Background Decorative Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Hackathon Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{t('hero.badge')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          {/* Project Name & Main Tagline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              {t('hero.titlePrefix')}{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Udyam Digital
              </span>
            </h1>

            <p className="text-lg sm:text-2xl text-slate-400 font-normal max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Main CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/advisor')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <Bot className="w-5 h-5" />
              <span>{t('hero.primaryCta')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate('/quote')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base shadow-sm hover:border-slate-600 transition-all duration-200 cursor-pointer"
            >
              <Building2 className="w-5 h-5 text-slate-400" />
              <span>{t('hero.secondaryCta')}</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800/80 max-w-3xl mx-auto text-left">
            <div className="flex items-center gap-2.5 bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-300">
                {t('hero.trust1')}
              </span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-300">
                {t('hero.trust2')}
              </span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-300">
                {t('hero.trust3')}
              </span>
            </div>
          </div>

        </div>

        {/* Live Visual Sandbox Card */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl bg-slate-900/90 p-4 sm:p-6 shadow-2xl border border-slate-800 backdrop-blur-xl">
          <div className="bg-slate-950 rounded-xl overflow-hidden p-6 text-white space-y-6 border border-slate-800/60">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
                https://api.udyamdigital.in/verify-sandbox
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full">
                <Zap className="w-3.5 h-3.5" />
                <span>Real-Time Engine</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 text-xs font-medium">Enterprise Entity</div>
                <div className="text-sm font-bold text-white">Sharma Tech Solutions</div>
                <div className="text-xs text-blue-400 font-mono mt-2">UDYAM-UP-00-1234567</div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 text-xs font-medium">Recommended Bundle</div>
                <div className="text-sm font-bold text-emerald-400">Micro-Biz Starter Connectivity</div>
                <div className="text-xs text-slate-400 mt-2">2 Fiber Lines + 5 Fleet SIMs</div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 text-xs font-medium">KYC Verification Score</div>
                <div className="text-sm font-bold text-cyan-400">98.5% Confidence Score</div>
                <div className="text-xs text-slate-400 mt-2">Passed GST & OCR Check</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}