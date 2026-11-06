// src/components/HowItWorks.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Sliders, FileCheck, Zap } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      icon: Bot,
      title: t('how.step1Title', 'AI Advisor'),
      description: t('how.step1Desc', 'Chat with the multilingual Accel Saathi assistant to describe your business type, location, and connectivity requirements.'),
    },
    {
      number: '02',
      icon: Sliders,
      title: t('how.step2Title', 'Bundle Recommendation'),
      description: t('how.step2Desc', 'Receive a tailored fibre, voice, and SIM package matched to your business segment and propensity score.'),
    },
    {
      number: '03',
      icon: FileCheck,
      title: t('how.step3Title', 'Digital KYC'),
      description: t('how.step3Desc', 'Upload Udyam and GST certificates. OCR extracts and validates data against government registries automatically.'),
    },
    {
      number: '04',
      icon: Zap,
      title: t('how.step4Title', 'Activation'),
      description: t('how.step4Desc', 'Track installation progress, coordinate with the field engineer, and go live — all from a single screen.'),
    },
  ];

  return (
    <section id="how-it-works" className="bg-airtel-surface w-full border-t border-airtel-border">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-airtel-charcoal">
            {t('how.title', 'How It Works')}
          </h2>
          <p className="mt-3 text-airtel-slate text-base">
            Four steps from enquiry to activated connectivity — no branch visit required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-white border border-airtel-border rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-airtel-red-light flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-airtel-red" />
                  </div>
                  <span className="text-xs font-semibold text-airtel-muted uppercase tracking-widest">
                    Step {step.number}
                  </span>
                </div>

                <h3 className="text-base font-bold text-airtel-charcoal mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-airtel-slate leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
