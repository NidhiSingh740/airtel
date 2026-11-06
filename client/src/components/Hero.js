// src/components/Hero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bot, Building2, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const stats = [
    { number: '15L+', label: 'Businesses Connected' },
    { number: '99.9%', label: 'Network Uptime' },
    { number: '< 5 min', label: 'Onboarding Time' },
    { number: '24×7', label: 'Support' },
  ];

  return (
    <section className="bg-white w-full border-b border-airtel-border">

      {/* Top red bar — Airtel brand signature */}
      <div className="h-1 w-full bg-airtel-red" />

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center space-y-6">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-airtel-charcoal leading-tight">
            {t('hero.titlePrefix', 'अपना बिज़नेस')}{' '}
            <span className="text-airtel-red">{t('hero.titleHighlight', 'डिजिटल बनाइए')}</span>
          </h1>

          <p className="text-lg sm:text-xl text-airtel-slate max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle', 'इंटरनेट • फ़ोन • CCTV • बिलिंग — सब एक प्लान में। ₹999/महीना से शुरू।')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/advisor')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-airtel-red hover:bg-airtel-red-hover text-white font-semibold text-base rounded-lg transition-colors cursor-pointer min-h-[48px]"
            >
              <Bot className="w-5 h-5" />
              <span>{t('hero.primaryCta', 'साथी से बात करें')}</span>
            </button>

            <button
              onClick={() => navigate('/quote')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white hover:bg-airtel-surface text-airtel-charcoal font-semibold text-base rounded-lg border border-airtel-border transition-colors cursor-pointer min-h-[48px]"
            >
              <Building2 className="w-5 h-5 text-airtel-slate" />
              <span>{t('hero.secondaryCta', 'प्लान देखें')}</span>
            </button>
          </div>

          {/* Trust points — inline, no cards */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm text-airtel-slate">
            {[
              t('hero.trust1', 'कोई छुपा चार्ज नहीं'),
              t('hero.trust2', 'इंस्टॉलेशन सपोर्ट शामिल'),
              t('hero.trust3', '30-दिन रिटर्न गारंटी'),
            ].map((text, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-16 border-t border-airtel-border pt-10 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-extrabold text-airtel-charcoal">{s.number}</div>
              <div className="text-sm text-airtel-slate mt-1">{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
