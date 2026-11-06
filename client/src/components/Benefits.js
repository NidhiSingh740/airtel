import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, FileText, Layers, Bot, Sparkles, ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function Benefits() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const benefitsList = [
    {
      icon: Clock,
      title: t('benefits.fasterTitle', 'Faster onboarding'),
      description: t('benefits.fasterDesc', 'From enquiry to quote in under 5 minutes. No waiting for a sales agent to call back.'),
      tag: t('benefits.fasterTag', 'Under 5 Mins'),
    },
    {
      icon: FileText,
      title: t('benefits.paperworkTitle', 'No manual paperwork'),
      description: t('benefits.paperworkDesc', 'Documents are verified automatically against Udyam and GST registries. Nothing needs to be physically submitted.'),
      tag: t('benefits.paperworkTag', '100% Digital OCR'),
    },
    {
      icon: Layers,
      title: t('benefits.platformTitle', 'Everything in one place'),
      description: t('benefits.platformDesc', 'Plan selection, KYC, payment, and installation tracking — managed from a single dashboard.'),
      tag: t('benefits.platformTag', 'Unified Hub'),
    },
  ];

  return (
    <section id="benefits" className="relative w-full bg-[#FAF9F6] border-t border-airtel-border/60 overflow-hidden py-16 lg:py-24">
      
      {/* Ambient warm background glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/5 to-airtel-red-light/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column — Benefits List (7 Columns on Desktop) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Header */}
            <div className="space-y-3">
            
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-airtel-charcoal tracking-tight">
                {t('benefits.title', 'Why businesses choose Accel')}
              </h2>

              <p className="text-base sm:text-lg text-airtel-slate leading-relaxed max-w-2xl">
                {t('benefits.subtitle', 'Telecom onboarding for small businesses has traditionally been slow and document-heavy. Accel removes that friction entirely.')}
              </p>
            </div>

            {/* Cozy Cards Stack */}
            <div className="space-y-4">
              {benefitsList.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index} 
                    className="group relative bg-white/90 backdrop-blur-xs border border-airtel-border/70 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(237,28,36,0.08)] hover:border-airtel-red/40 transition-all duration-300 hover:-translate-y-1 flex flex-col sm:flex-row items-start gap-5 overflow-hidden"
                  >
                    {/* Hover accent bar */}
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-airtel-red scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-airtel-red-light to-amber-50/80 flex items-center justify-center shrink-0 group-hover:bg-airtel-red transition-all duration-300 shadow-2xs group-hover:shadow-md">
                      <Icon className="w-6 h-6 text-airtel-red group-hover:text-white transition-colors duration-300" />
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-airtel-charcoal group-hover:text-airtel-red transition-colors">
                          {item.title}
                        </h3>
                        <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold text-airtel-slate bg-[#F3F4F6] rounded-full border border-gray-200/60 shrink-0">
                          {item.tag}
                        </span>
                      </div>

                      <p className="text-sm text-airtel-slate leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column — Cozy Interactive Action Panel (5 Columns on Desktop) */}
          <div className="lg:col-span-5">
            <div className="relative bg-white/95 backdrop-blur-md border border-airtel-red/20 rounded-3xl p-8 sm:p-10 shadow-[0_15px_45px_rgba(237,28,36,0.08)] overflow-hidden">
              
              {/* Top ambient glow inside card */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-airtel-red-light/60 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="relative space-y-6">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-airtel-red-light text-airtel-red text-xs font-bold tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-airtel-red animate-pulse" />
                    <span>Instant Access</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Online
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-airtel-charcoal tracking-tight">
                    {t('benefits.ctaTitle', 'Get started in 5 minutes')}
                  </h3>
                  <p className="text-sm text-airtel-slate leading-relaxed">
                    {t('benefits.ctaSubtitle', 'Chat with Accel Saathi to find the right plan for your business, or upload your documents directly to begin KYC verification.')}
                  </p>
                </div>

                {/* Action Buttons (NO right-arrow icons allowed) */}
                <div className="space-y-3.5 pt-2">
                  <button
                    onClick={() => navigate('/advisor')}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-airtel-red hover:bg-airtel-red-hover text-white font-semibold text-base rounded-full shadow-lg shadow-airtel-red/25 hover:shadow-xl hover:shadow-airtel-red/35 active:scale-[0.98] transition-all cursor-pointer min-h-[48px]"
                  >
                    <Bot className="w-5 h-5 text-white" />
                    <span>{t('benefits.primaryCta', 'Start with Accel Saathi')}</span>
                  </button>

                  <button
                    onClick={() => navigate('/kyc')}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-white hover:bg-airtel-surface text-airtel-charcoal font-semibold text-base rounded-full border border-airtel-border shadow-xs hover:border-airtel-slate/30 active:scale-[0.98] transition-all cursor-pointer min-h-[48px]"
                  >
                    <span>{t('benefits.secondaryCta', 'Upload KYC Documents')}</span>
                  </button>
                </div>

                {/* Cozy Security Notice Footnote */}
                <div className="pt-4 border-t border-airtel-border/50 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-airtel-slate leading-relaxed">
                    {t('benefits.privacyNote', 'Your documents are used only for verification and are deleted automatically after 30 days under DPDP guidelines.')}
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}