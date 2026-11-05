

// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Udyam<span className="text-blue-500">Digital</span>
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {t(
                'footer.aboutDesc',
                'AI-driven digital enablement platform built for Indian MSMEs. Streamlining Udyam/GST verification, automated package recommendations, and paperless KYC.'
              )}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                DPDP Act 2023 Compliant
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">{t('footer.platform', 'Platform')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">{t('nav.home', 'Home')}</Link></li>
              <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">{t('nav.howItWorks', 'How It Works')}</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">{t('nav.features', 'Features')}</a></li>
              <li><Link to="/advisor" className="hover:text-blue-400 transition-colors">{t('nav.advisor', 'Saathi AI Advisor')}</Link></li>
              <li><Link to="/quote" className="hover:text-blue-400 transition-colors">{t('nav.quote', 'Quote Builder')}</Link></li>
            </ul>
          </div>

          {/* Workflows */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">{t('footer.workflows', 'Services')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/kyc" className="hover:text-blue-400 transition-colors">{t('nav.kyc', 'Digital KYC Upload')}</Link></li>
              <li><Link to="/tracker" className="hover:text-blue-400 transition-colors">{t('nav.tracker', 'Order Tracker')}</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">{t('nav.dashboard', 'Sales Lead Dashboard')}</Link></li>
              <li><a href="#benefits" className="hover:text-blue-400 transition-colors">{t('footer.msmeBenefits', 'MSME Benefits')}</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">{t('footer.support', 'Contact & Support')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-slate-300">support@udyamdigital.in</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-slate-300">+91 1800-UDYAM-DIGITAL</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 text-xs leading-relaxed">
                  Innovation Hub, Tech Park, New Delhi, India
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 UdyamDigital Tech Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for MSME Hackathon</span>
          </div>
        </div>
      </div>
    </footer>
  );
}