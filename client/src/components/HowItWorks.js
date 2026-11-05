
// src/components/HowItWorks.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Sliders, FileCheck, Zap, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      number: "01",
      icon: Bot,
      title: t('how.step1Title', 'AI Advisor'),
      description: t('how.step1Desc', 'Chat with multi-lingual Saathi AI to describe your business scale, location, and connectivity needs.'),
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      iconColor: "text-blue-400",
      glow: "hover:border-blue-500/50 hover:shadow-blue-500/10",
    },
    {
      number: "02",
      icon: Sliders,
      title: t('how.step2Title', 'Smart Bundle'),
      description: t('how.step2Desc', 'Get dynamically tailored fiber, voice, and fleet SIM packages matching your propensity score.'),
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      iconColor: "text-indigo-400",
      glow: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
    },
    {
      number: "03",
      icon: FileCheck,
      title: t('how.step3Title', 'Digital KYC'),
      description: t('how.step3Desc', 'Upload Udyam & GST certificates for instant OCR parsing and official registry validation.'),
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      iconColor: "text-cyan-400",
      glow: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
    },
    {
      number: "04",
      icon: Zap,
      title: t('how.step4Title', 'Live Activation'),
      description: t('how.step4Desc', 'Track installation stages in real-time and launch enterprise connectivity in minutes.'),
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      iconColor: "text-emerald-400",
      glow: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    },
  ];

  return (
    <section id="how-it-works" className="relative bg-slate-900 text-slate-100 py-20 lg:py-28 border-t border-slate-800 selection:bg-blue-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest">
            <span>Seamless Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t('how.title', 'How Udyam Digital Works')}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            A 4-step automated digital journey designed to eliminate friction for Indian MSMEs.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index} 
                className={`relative bg-slate-950/80 border border-slate-800 rounded-2xl p-6 transition-all duration-300 shadow-xl ${step.glow} group hover:-translate-y-1 flex flex-col justify-between`}
              >
                {/* Connecting Arrow for Desktop view */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-700">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}

                <div className="space-y-5">
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-lg shadow-inner ${step.badgeColor}`}>
                      <Icon className={`w-6 h-6 ${step.iconColor}`} />
                    </div>
                    <span className="text-2xl font-mono font-extrabold text-slate-700 group-hover:text-slate-500 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Status Dot */}
                <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] font-mono text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors" />
                  <span>Step {step.number} of 04</span>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}