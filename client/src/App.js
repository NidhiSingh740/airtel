// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// 1. Shared Layout & Auth Components (from src/components/)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';

// 2. Landing Page Section Components (from src/components/)
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Benefits from './components/Benefits';

// 3. Sub-Pages (from src/pages/)
// import Advisor from './pages/Advisor';
// import QuoteBuilder from './pages/QuoteBuilder';
// import KYC from './pages/KYC';
// import Tracker from './pages/Tracker';
// import SalesDashboard from './pages/SalesDashboard';

// Landing Page assembling all components
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
  // Hide Navbar and Footer on Login and Signup pages
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      {!isAuthPage && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/advisor" element={<Advisor />} />
          <Route path="/quote" element={<QuoteBuilder />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/dashboard" element={<SalesDashboard />} /> */}
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
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