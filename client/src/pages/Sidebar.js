

// src/components/Sidebar.jsx
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
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Perform logout cleanup if needed
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard },
    { path: '/advisor', label: t('nav.advisor', 'Saathi AI Advisor'), icon: Bot, badge: 'AI' },
    { path: '/quote', label: t('nav.quote', 'Business Plans'), icon: Building2 },
    { path: '/kyc', label: t('nav.kyc', 'Smart KYC'), icon: FileCheck },
    { path: '/tracker', label: t('nav.tracker', 'Order Tracking'), icon: Clock },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Main Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 
        flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Top Header & Branding */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-none">
                Udyam<span className="text-blue-500">Digital</span>
              </span>
              <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mt-0.5">
                Portal Workspace
              </span>
            </div>
          </NavLink>

          {/* Close button for Mobile */}
          <button 
            onClick={onClose} 
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Section 1: Main App Navigation */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
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
                      flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                      ${isActive 
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                        {item.badge}
                      </span>
                    ) : (
                      isActive && <ChevronRight className="w-4 h-4 text-white/80" />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Section 2: Account & Settings */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Account
            </div>
            <nav className="space-y-1">
              <button 
                onClick={() => alert("Profile Modal / Page")}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </button>

              <button 
                onClick={() => alert("Support Desk")}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Help & Support</span>
              </button>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Language Switcher inside Sidebar */}
          <div className="pt-2 px-1">
            <LanguageSelector />
          </div>

        </div>

        {/* Footer: User Profile Badge */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm">
              ST
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold text-white truncate">Sharma Tech</span>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Customer Account
              </span>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}