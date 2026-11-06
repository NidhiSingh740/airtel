// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { AirtelIcon } from './AirtelLogo';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-airtel-charcoal text-slate-400 font-sans w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-xs">
                <AirtelIcon className="w-5 h-5" fill="#b22020" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-extrabold tracking-tight text-white">
                  Accel<span className="text-airtel-red">Saathi</span>
                </span>
                <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">
                  by Airtel Business
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              {t(
                'footer.aboutDesc',
                'Digital onboarding platform for small and medium businesses. AI-assisted plan selection, Udyam/GST verification, and paperless KYC.'
              )}
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{t('footer.platform', 'Platform')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">{t('nav.home', 'Home')}</Link></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{t('nav.howItWorks', 'How It Works')}</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">{t('nav.features', 'Features')}</a></li>
              <li><Link to="/advisor" className="hover:text-white transition-colors">{t('nav.advisor', 'Accel Saathi AI')}</Link></li>
              <li><Link to="/quote" className="hover:text-white transition-colors">{t('nav.quote', 'Quote Builder')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{t('footer.workflows', 'Services')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/kyc" className="hover:text-white transition-colors">{t('nav.kyc', 'Digital KYC')}</Link></li>
              <li><Link to="/tracker" className="hover:text-white transition-colors">{t('nav.tracker', 'Order Tracking')}</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">{t('nav.dashboard', 'Sales Dashboard')}</Link></li>
              <li><a href="#benefits" className="hover:text-white transition-colors">{t('footer.msmeBenefits', 'Business Benefits')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{t('footer.support', 'Support')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>1800-103-4444</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>support@accelbusiness.in</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  Airtel Center, Plot 16, Udyog Vihar, Gurugram
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© 2026 Bharti Airtel Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#compliance" className="hover:text-slate-400 transition-colors">DPDP Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
