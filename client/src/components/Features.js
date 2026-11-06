// src/components/Features.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, BarChart3, ShieldCheck, MapPin } from 'lucide-react';

export default function Features() {
  const { t } = useTranslation();

  const featureList = [
    {
      icon: MessageSquare,
      title: t('features.recTitle', 'Multilingual AI Advisor'),
      description: t('features.recDesc', 'Conversational onboarding in 10 Indian languages. The assistant understands business context and recommends appropriate connectivity bundles.'),
    },
    {
      icon: BarChart3,
      title: t('features.pricingTitle', 'Transparent Pricing'),
      description: t('features.pricingDesc', 'Itemised quotes with monthly and one-time costs displayed clearly. Compare against your current spend before committing.'),
    },
    {
      icon: ShieldCheck,
      title: t('features.kycTitle', 'Paperless KYC'),
      description: t('features.kycDesc', 'Upload Udyam and GST documents once. OCR extraction and cross-registry validation complete in seconds with no manual re-entry.'),
    },
    {
      icon: MapPin,
      title: t('features.trackerTitle', 'Order Tracking'),
      description: t('features.trackerDesc', 'Real-time visibility into installation progress, assigned engineer details, and expected activation date.'),
    },
  ];

  return (
    <section id="features" className="bg-white w-full border-t border-airtel-border">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-airtel-charcoal">
            {t('features.title', 'Platform Capabilities')}
          </h2>
          <p className="mt-3 text-airtel-slate text-base">
            Built specifically for small and medium businesses acquiring Airtel connectivity for the first time.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureList.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex gap-5 p-6 bg-airtel-surface border border-airtel-border rounded-lg"
              >
                <div className="w-10 h-10 rounded-lg bg-airtel-red flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-airtel-charcoal mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-airtel-slate leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
