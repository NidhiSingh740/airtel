// src/components/Features.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, TrendingUp, ShieldCheck, Clock, ArrowUpRight } from 'lucide-react';

export default function Features() {
  const { t } = useTranslation();

  const featureList = [
    {
      icon: Sparkles,
      title: t('features.recTitle'),
      description: t('features.recDesc'),
      iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      hoverGlow: 'hover:border-blue-500/50 hover:shadow-blue-500/10',
    },
    {
      icon: TrendingUp,
      title: t('features.pricingTitle'),
      description: t('features.pricingDesc'),
      iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      hoverGlow: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10',
    },
    {
      icon: ShieldCheck,
      title: t('features.kycTitle'),
      description: t('features.kycDesc'),
      iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      hoverGlow: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10',
    },
    {
      icon: Clock,
      title: t('features.trackerTitle'),
      description: t('features.trackerDesc'),
      iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      hoverGlow: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
    },
  ];

  return (
    <section id="features" className="relative bg-slate-950 text-slate-100 py-20 lg:py-28 border-t border-slate-800 selection:bg-blue-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-widest">
            <span>Built For Hackathon Scale</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t('features.title')}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 shadow-xl ${feature.hoverGlow} hover:-translate-y-1 flex flex-col justify-between group`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-lg shadow-inner ${feature.iconBg} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                  <span>Explore module</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}