// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// 1. Shared Components (from src/components/)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './pages/Sidebar';
import Login from './components/Login';
import Signup from './components/Signup';

// 2. Landing Page Section Components (from src/components/)
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Benefits from './components/Benefits';

// 3. Sub-Pages (from src/pages/)
import Advisor     from './pages/Advisor';
import Dashboard   from './pages/Dashboard';
import KYCPage     from './pages/KYCPage';
import QuotePage   from './pages/QuotePage';
import TrackerPage from './pages/TrackerPage';

// Lucide Icons
import { Menu } from 'lucide-react';
import { AirtelIcon } from './components/AirtelLogo';

// Landing Page assembling public section components
function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Benefits />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isPublicPage = ['/', '/login', '/signup'].includes(location.pathname);
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className={`font-sans text-airtel-charcoal bg-airtel-surface ${isPublicPage ? 'min-h-screen flex flex-col justify-between' : 'h-screen w-screen overflow-hidden flex'}`}>

      {/* PUBLIC PAGES LAYOUT */}
      {isPublicPage ? (
        <>
          {!isAuthPage && <Navbar />}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
          {!isAuthPage && <Footer />}
        </>
      ) : (
        /* PORTAL / APP PAGES LAYOUT (FIXED VIEWPORT - NO OUTER SCROLL) */
        <div className="flex h-screen w-full overflow-hidden">
          {/* Sidebar Component */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main App Content Area */}
          <div className="flex-1 lg:ml-64 flex flex-col min-w-0 h-screen overflow-hidden">

            {/* Top Bar for Mobile Menu Trigger */}
            <header className="lg:hidden shrink-0 sticky top-0 z-30 bg-white border-b border-airtel-border px-4 py-3 flex items-center justify-between shadow-sm">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg text-airtel-slate hover:text-airtel-charcoal hover:bg-airtel-surface"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-airtel-red-light border border-airtel-red/10 flex items-center justify-center shadow-xs">
                  <AirtelIcon className="w-4 h-4" fill="#b22020" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-sm text-airtel-charcoal">AccelSaathi</span>
                  <span className="text-[8px] font-bold text-airtel-slate uppercase tracking-widest">by Airtel Business</span>
                </div>
              </div>
            </header>

            {/* Portal Pages Area - Fixed Viewport, fills available height */}
            <main className="flex-1 min-h-0 p-3 sm:p-5 bg-airtel-surface overflow-y-auto flex flex-col">
              <Routes>
                <Route path="/advisor"   element={<Advisor />}     />
                <Route path="/dashboard" element={<Dashboard />}   />
                <Route path="/kyc"       element={<KYCPage />}     />
                <Route path="/quote"     element={<QuotePage />}   />
                <Route path="/tracker"   element={<TrackerPage />} />
              </Routes>
            </main>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
