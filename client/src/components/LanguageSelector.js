// src/components/LanguageSelector.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all text-xs font-medium text-slate-700 shadow-2xs">
        <Globe className="w-3.5 h-3.5 text-blue-600" />
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer appearance-none pr-1"
        >
          <option value="en">EN</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>
    </div>
  );
}