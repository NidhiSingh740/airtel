import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, BarChart3, ShieldCheck, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Features() {
  const { t } = useTranslation();

  const featureList = [
    {
      icon: MessageSquare,
      title: t('features.recTitle', 'Multilingual AI Advisor'),
      description: t('features.recDesc', 'Conversational onboarding in 10 Indian languages. The assistant understands business context and recommends appropriate connectivity bundles.'),
      badge: t('features.recBadge', '10 Languages'),
      accentColor: 'from-airtel-red to-rose-500',
    },
    {
      icon: BarChart3,
      title: t('features.pricingTitle', 'Transparent Pricing'),
      description: t('features.pricingDesc', 'Itemised quotes with monthly and one-time costs displayed clearly. Compare against your current spend before committing.'),
      badge: t('features.pricingBadge', 'Zero Hidden Fees'),
      accentColor: 'from-amber-500 to-orange-500',
    },
    {
      icon: ShieldCheck,
      title: t('features.kycTitle', 'Paperless KYC'),
      description: t('features.kycDesc', 'Upload Udyam and GST documents once. OCR extraction and cross-registry validation complete in seconds with no manual re-entry.'),
      badge: t('features.kycBadge', 'Instant OCR'),
      accentColor: 'from-emerald-500 to-teal-600',
    },
    {
      icon: MapPin,
      title: t('features.trackerTitle', 'Order Tracking'),
      description: t('features.trackerDesc', 'Real-time visibility into installation progress, assigned engineer details, and expected activation date.'),
      badge: t('features.trackerBadge', 'Live Status'),
      accentColor: 'from-blue-500 to-indigo-600',
    },
  ];

  return (
    <section id="features" className="relative w-full bg-[#FAF9F6] border-t border-airtel-border/60 overflow-hidden py-16 lg:py-24">
      
      {/* Ambient background glows for cozy lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-airtel-red-light/50 to-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-airtel-charcoal tracking-tight">
            {t('features.title', 'Platform Capabilities')}
          </h2>

          <p className="text-base sm:text-lg text-airtel-slate max-w-2xl mx-auto leading-relaxed">
            {t('features.subtitle', 'Built specifically for small and medium businesses acquiring Airtel connectivity for the first time.')}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {featureList.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/90 backdrop-blur-xs border border-airtel-border/70 rounded-3xl p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(237,28,36,0.08)] hover:border-airtel-red/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
              >
                {/* Top card hover accent bar */}
                <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-airtel-red to-rose-400 rounded-b-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />

                <div>
                  {/* Icon & Badge Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-airtel-red-light to-amber-50/80 flex items-center justify-center shrink-0 group-hover:bg-airtel-red transition-all duration-300 shadow-2xs group-hover:shadow-md">
                      <Icon className="w-7 h-7 text-airtel-red group-hover:text-white transition-colors duration-300" />
                    </div>

                    <span className="inline-block px-3 py-1 text-xs font-semibold text-airtel-slate bg-[#F3F4F6] rounded-full border border-gray-200/60 shadow-2xs">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-airtel-charcoal mb-3 group-hover:text-airtel-red transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-airtel-slate leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Footer Highlight */}
                <div className="mt-8 pt-4 border-t border-airtel-border/40 flex items-center justify-between text-xs font-medium text-emerald-600">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Verified Enterprise Standard
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}