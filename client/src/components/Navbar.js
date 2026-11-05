// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-950 to-slate-800 bg-clip-text text-transparent">
                Udyam<span className="text-blue-600">Digital</span>
              </span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest -mt-1">
                MSME Enablement
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.home')}
            </Link>
            <a 
              href="#how-it-works" 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.howItWorks')}
            </a>
            <a 
              href="#features" 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.features')}
            </a>
            <Link 
              to="/advisor" 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.advisor')}
            </Link>
            <Link 
              to="/dashboard" 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.dashboard')}
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector />

            <button
              onClick={() => navigate('/advisor')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>{t('nav.getStarted')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 md:hidden">
            <LanguageSelector />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}