// src/components/Benefits.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, FileText, Layers, Bot } from 'lucide-react';

export default function Benefits() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const benefitsList = [
    {
      icon: Clock,
      title: t('benefits.fasterTitle', 'Faster onboarding'),
      description: t('benefits.fasterDesc', 'From enquiry to quote in under 5 minutes. No waiting for a sales agent to call back.'),
    },
    {
      icon: FileText,
      title: t('benefits.paperworkTitle', 'No manual paperwork'),
      description: t('benefits.paperworkDesc', 'Documents are verified automatically against Udyam and GST registries. Nothing needs to be physically submitted.'),
    },
    {
      icon: Layers,
      title: t('benefits.platformTitle', 'Everything in one place'),
      description: t('benefits.platformDesc', 'Plan selection, KYC, payment, and installation tracking — managed from a single dashboard.'),
    },
  ];

  return (
    <section id="benefits" className="bg-airtel-surface w-full border-t border-airtel-border">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — Benefits list */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-airtel-charcoal mb-3">
              {t('benefits.title', 'Why businesses choose Accel')}
            </h2>
            <p className="text-airtel-slate text-base mb-10">
              Telecom onboarding for small businesses has traditionally been slow and document-heavy. Accel removes that friction entirely.
            </p>

            <div className="space-y-6">
              {benefitsList.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="w-9 h-9 rounded-lg bg-airtel-red-light flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4.5 h-4.5 text-airtel-red" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-airtel-charcoal mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-airtel-slate leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Action panel */}
          <div className="bg-white border border-airtel-border rounded-lg p-8">
            <h3 className="text-xl font-bold text-airtel-charcoal mb-2">
              Get started in 5 minutes
            </h3>
            <p className="text-sm text-airtel-slate mb-8 leading-relaxed">
              Chat with Accel Saathi to find the right plan for your business, or upload your documents directly to begin KYC verification.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/advisor')}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-airtel-red hover:bg-airtel-red-hover text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer min-h-[48px]"
              >
                <Bot className="w-4 h-4" />
                <span>Start with Accel Saathi</span>
              </button>

              <button
                onClick={() => navigate('/kyc')}
                className="w-full flex items-center justify-center px-6 py-3.5 bg-white hover:bg-airtel-surface text-airtel-charcoal font-semibold text-sm rounded-lg border border-airtel-border transition-colors cursor-pointer min-h-[48px]"
              >
                Upload KYC Documents
              </button>
            </div>

            <p className="mt-6 text-xs text-airtel-muted">
              Your documents are used only for verification and are deleted automatically after 30 days.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
