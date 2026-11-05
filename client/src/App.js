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
// import SalesDashboard from './pages/SalesDashboard';

import Advisor from './pages/Advisor';
// import QuoteBuilder from './pages/QuoteBuilder';
// import KYC from './pages/KYC';
// import Tracker from './pages/Tracker';

// Lucide Icons
import { Menu } from 'lucide-react';

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

  // Define public routes (Navbar + Footer view)
  const isPublicPage = ['/', '/login', '/signup'].includes(location.pathname);
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      
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
        /* PORTAL / APP PAGES LAYOUT (SIDEBAR WRAPPER) */
        <div className="flex min-h-screen">
          {/* Sidebar Component */}
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />

          {/* Main App Content Area */}
          <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
            
            {/* Top Bar for Mobile Menu Trigger */}
            <header className="lg:hidden sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="font-bold text-sm text-white">UdyamDigital Portal</span>
            </header>

            {/* Portal Pages */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <Routes>
                
                {/* <Route path="/dashboard" element={<SalesDashboard />} />  */}
                
                <Route path="/advisor" element={<Advisor />} />
                {/* <Route path="/quote" element={<QuoteBuilder />} />
                <Route path="/kyc" element={<KYC />} />
                <Route path="/tracker" element={<Tracker />} /> */}
                
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