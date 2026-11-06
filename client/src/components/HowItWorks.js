import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Sliders, FileCheck, Zap, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      icon: Bot,
      title: t('how.step1Title', 'AI Advisor'),
      description: t('how.step1Desc', 'Chat with the multilingual Accel Saathi assistant to describe your business type, location, and connectivity requirements.'),
      badge: t('how.step1Badge', 'Friendly Chat'),
    },
    {
      number: '02',
      icon: Sliders,
      title: t('how.step2Title', 'Bundle Recommendation'),
      description: t('how.step2Desc', 'Receive a tailored fibre, voice, and SIM package matched to your business segment and propensity score.'),
      badge: t('how.step2Badge', 'Custom Fit'),
    },
    {
      number: '03',
      icon: FileCheck,
      title: t('how.step3Title', 'Digital KYC'),
      description: t('how.step3Desc', 'Upload Udyam and GST certificates. OCR extracts and validates data against government registries automatically.'),
      badge: t('how.step3Badge', 'Zero Hassle'),
    },
    {
      number: '04',
      icon: Zap,
      title: t('how.step4Title', 'Activation'),
      description: t('how.step4Desc', 'Track installation progress, coordinate with the field engineer, and go live — all from a single screen.'),
      badge: t('how.step4Badge', 'Fast Track'),
    },
  ];

  return (
    <section id="how-it-works" className="relative w-full bg-[#FAF9F6] border-t border-airtel-border/60 overflow-hidden py-16 lg:py-24">
      
      {/* Warm Ambient Radial Glows for a Cozy Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-airtel-red-light/60 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-airtel-charcoal tracking-tight">
            {t('how.title', 'How It Works')}
          </h2>

          <p className="text-base sm:text-lg text-airtel-slate max-w-2xl mx-auto leading-relaxed">
            {t('how.subtitle', 'Four steps from enquiry to activated connectivity — no branch visit required.')}
          </p>
        </div>

        {/* Steps Grid with Warm Curved Connector Line */}
        <div className="relative">
          
          {/* Connecting Track (Visible on Desktop) */}
          <div className="hidden lg:block absolute top-[80px] left-[12%] right-[12%] h-1 bg-gradient-to-r from-airtel-red/10 via-airtel-red/30 to-airtel-red/10 rounded-full z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white/90 backdrop-blur-xs border border-airtel-border/70 rounded-3xl p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(237,28,36,0.1)] hover:border-airtel-red/40 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
                >
                  {/* Subtle top indicator bar on hover */}
                  <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-airtel-red to-rose-400 rounded-b-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />

                  <div>
                    {/* Header Row: Icon + Number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-airtel-red-light to-amber-50/80 flex items-center justify-center shrink-0 group-hover:bg-airtel-red group-hover:text-white transition-all duration-300 shadow-2xs group-hover:shadow-md">
                        <Icon className="w-7 h-7 text-airtel-red group-hover:text-white transition-colors duration-300" />
                      </div>

                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-airtel-red/40 to-airtel-red group-hover:from-airtel-red group-hover:to-rose-600 transition-all">
                        {step.number}
                      </span>
                    </div>

                    {/* Cozy Soft Badge */}
                    <span className="inline-block px-3 py-1 mb-3 text-[11px] font-medium text-airtel-slate bg-[#F3F4F6] rounded-full border border-gray-200/60">
                      {step.badge}
                    </span>

                    {/* Step Title */}
                    <h3 className="text-lg font-bold text-airtel-charcoal mb-2 group-hover:text-airtel-red transition-colors">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-sm text-airtel-slate leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Step Progress Footer */}
                  <div className="mt-6 pt-4 border-t border-airtel-border/40 flex items-center justify-between text-xs text-airtel-slate font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-airtel-red animate-pulse" />
                      Step {index + 1} of 4
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Cozy Bottom Callout Card */}
        <div className="mt-16 p-6 sm:p-8 bg-gradient-to-r from-white via-amber-50/30 to-white border border-airtel-red/15 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-airtel-red-light flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6 text-airtel-red" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-airtel-charcoal">
                {t('how.calloutTitle', 'Need human assistance at any step?')}
              </h4>
              <p className="text-xs sm:text-sm text-airtel-slate">
                {t('how.calloutSubtitle', 'Our doorstep support team is available 24×7 to assist you.')}
              </p>
            </div>
          </div>

          <a
            href="/advisor"
            className="w-full sm:w-auto px-7 py-3.5 bg-airtel-red hover:bg-airtel-red-hover text-white font-semibold text-sm rounded-full shadow-md shadow-airtel-red/20 transition-all cursor-pointer text-center min-h-[48px] inline-flex items-center justify-center shrink-0 active:scale-95"
          >
            {t('how.calloutCta', 'साथी से बात करें')}
          </a>
        </div>

      </div>
    </section>
  );
}