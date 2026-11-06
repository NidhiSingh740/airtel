// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
// import LanguageSelector from './LanguageSelector';
import { AirtelIcon } from './AirtelLogo';

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-airtel-border shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-airtel-red-light border border-airtel-red/10 flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
              <AirtelIcon className="w-5 h-5" fill="#b22020" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-airtel-charcoal">
                Accel<span className="text-airtel-red">Saathi</span>
              </span>
              <span className="text-[9px] font-bold text-airtel-slate uppercase tracking-widest">
                by Airtel Business
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/"
              className="text-sm font-medium text-airtel-slate hover:text-airtel-red transition-colors duration-200"
            >
              {t('nav.home', 'Home')}
            </Link>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-airtel-slate hover:text-airtel-red transition-colors duration-200"
            >
              {t('nav.howItWorks', 'How It Works')}
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-airtel-slate hover:text-airtel-red transition-colors duration-200"
            >
              {t('nav.features', 'Features')}
            </a>
            <Link
              to="/advisor"
              className="text-sm font-medium text-airtel-slate hover:text-airtel-red transition-colors duration-200"
            >
              {t('nav.advisor', 'Saathi AI')}
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-airtel-slate hover:text-airtel-red transition-colors duration-200"
            >
              {t('nav.dashboard', 'Dashboard')}
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* <LanguageSelector /> */}
            <button
              onClick={() => navigate('/advisor')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-airtel-red hover:bg-airtel-red-hover text-white font-semibold text-sm shadow-sm transition-all duration-200 active:scale-95 cursor-pointer min-h-[40px]"
            >
              <span>{t('nav.getStarted', 'साथी से बात करें')}</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            {/* <LanguageSelector /> */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-airtel-slate hover:text-airtel-charcoal hover:bg-airtel-surface"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-airtel-border py-3 space-y-1">
            {[
              { to: '/', label: t('nav.home', 'Home') },
              { href: '#how-it-works', label: t('nav.howItWorks', 'How It Works') },
              { href: '#features', label: t('nav.features', 'Features') },
              { to: '/advisor', label: t('nav.advisor', 'Saathi AI') },
              { to: '/dashboard', label: t('nav.dashboard', 'Dashboard') },
            ].map((item, i) =>
              item.to ? (
                <Link
                  key={i}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-airtel-charcoal hover:bg-airtel-red-light hover:text-airtel-red rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={i}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-airtel-charcoal hover:bg-airtel-red-light hover:text-airtel-red rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              )
            )}
            <div className="px-4 pt-2">
              <button
                onClick={() => { navigate('/advisor'); setIsMobileMenuOpen(false); }}
                className="w-full py-3 rounded-full bg-airtel-red hover:bg-airtel-red-hover text-white font-semibold text-sm transition-all min-h-[48px]"
              >
                साथी से बात करें
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
