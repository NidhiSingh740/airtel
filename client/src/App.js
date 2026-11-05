// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Import Shared Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Benefits from './components/Benefits';

// 2. Import Page Views (from src/pages/)
// import Home from './pages/Home';
// import Advisor from './pages/Advisor';
// import QuoteBuilder from './pages/QuoteBuilder';
// import KYC from './pages/KYC';
// import Tracker from './pages/Tracker';
// import SalesDashboard from './pages/SalesDashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
        {/* Global Navigation Bar */}
        <Navbar />
        <Hero/>
        <HowItWorks/>
        <Features/>
        <Benefits/>

        {/* Dynamic Page Router */}
        <main className="flex-grow">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            {/* 
              <Route path="/advisor" element={<Advisor />} />
              <Route path="/quote" element={<QuoteBuilder />} />
              <Route path="/kyc" element={<KYC />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/dashboard" element={<SalesDashboard />} />
            */}
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}