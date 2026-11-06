// src/pages/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Bot,
  Building2,
  FileCheck,
  Clock,
  User,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';
// import LanguageSelector from '../components/LanguageSelector';
import { AirtelIcon } from '../components/AirtelLogo';

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard },
    { path: '/advisor', label: t('nav.advisor', 'Accel Saathi AI'), icon: Bot, badge: 'AI' },
    { path: '/quote', label: t('nav.quote', 'Business Plans'), icon: Building2 },
    { path: '/kyc', label: t('nav.kyc', 'Smart KYC'), icon: FileCheck },
    { path: '/tracker', label: t('nav.tracker', 'Order Tracking'), icon: Clock },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-airtel-charcoal/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-airtel-border
        flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Top Header */}
        <div className="p-5 border-b border-airtel-border flex items-center justify-between bg-airtel-red">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-xs">
              <AirtelIcon className="w-5 h-5" fill="#b22020" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-extrabold tracking-tight text-white">
                AccelSaathi
              </span>
              <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest">
                by Airtel Business
              </span>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          {/* Main Navigation */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-airtel-muted">
              Main Menu
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group min-h-[44px]
                      ${isActive
                        ? 'bg-airtel-red text-white font-semibold shadow-sm shadow-airtel-red/20'
                        : 'text-airtel-slate hover:text-airtel-charcoal hover:bg-airtel-surface'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-airtel-muted group-hover:text-airtel-red'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-airtel-red-light text-airtel-red border border-airtel-red/20'}`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Account Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-airtel-muted">
              Account
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => alert('Profile Modal / Page')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-airtel-slate hover:text-airtel-charcoal hover:bg-airtel-surface transition-colors min-h-[44px]"
              >
                <User className="w-4 h-4 text-airtel-muted" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => alert('Support Desk')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-airtel-slate hover:text-airtel-charcoal hover:bg-airtel-surface transition-colors min-h-[44px]"
              >
                <HelpCircle className="w-4 h-4 text-airtel-muted" />
                <span>Help & Support</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Language Switcher */}
          <div className="pt-2 px-1">
            {/* <LanguageSelector /> */}
          </div>

        </div>

        {/* Footer Profile Badge */}
        <div className="p-4 border-t border-airtel-border bg-airtel-surface">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-airtel-border shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-airtel-red flex items-center justify-center font-bold text-white text-sm shrink-0">
              ST
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold text-airtel-charcoal truncate">Sharma Tech</span>
              <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Customer Account
              </span>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}
