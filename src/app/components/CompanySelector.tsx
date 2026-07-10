"use client";

import React, { useState } from "react";
import { Search, Compass, AlertCircle } from "lucide-react";

interface CompanySelectorProps {
  onSearch: (companyName: string) => void;
  isLoading: boolean;
}

const POPULAR_COMPANIES = [
  { name: "Apple Inc.", symbol: "AAPL", logo: "🍎", industry: "Consumer Tech" },
  { name: "NVIDIA Corp.", symbol: "NVDA", logo: "💚", industry: "Semiconductors" },
  { name: "Tesla Inc.", symbol: "TSLA", logo: "⚡", industry: "Electric Vehicles" },
  { name: "Reliance Industries", symbol: "RELIANCE", logo: "🇮🇳", industry: "Conglomerate" },
];

export default function CompanySelector({ onSearch, isLoading }: CompanySelectorProps) {
  const [customCompany, setCustomCompany] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCompany.trim() && !isLoading) {
      onSearch(customCompany.trim());
    }
  };

  return (
    <div className="selector-card">
      <div className="flex items-center gap-2 mb-6">
        <Compass className="text-rose-900" size={20} />
        <h2 className="text-lg font-bold text-rose-950">Select Target Asset</h2>
      </div>

      <div className="quick-select-grid">
        {POPULAR_COMPANIES.map((company) => (
          <button
            key={company.symbol}
            disabled={isLoading}
            onClick={() => onSearch(company.name)}
            className="company-select-btn group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{company.logo}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200">
                {company.symbol}
              </span>
            </div>
            <h3 className="font-bold text-rose-950 text-left group-hover:text-rose-700 transition-colors">
              {company.name}
            </h3>
            <p className="text-xs text-rose-800 text-left mt-0.5">{company.industry}</p>
          </button>
        ))}
      </div>

      <div className="my-6 flex items-center justify-center gap-4">
        <div className="h-px bg-rose-200 flex-1"></div>
        <span className="text-xs font-bold text-rose-800 tracking-wider uppercase">Or Search Custom</span>
        <div className="h-px bg-rose-200 flex-1"></div>
      </div>

      <form onSubmit={handleSubmit} className="custom-search-form">
        <div className="search-input-wrapper">
          <Search className="search-icon text-rose-800" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Enter company name (e.g. Microsoft, Google, Tata Motors)..."
            value={customCompany}
            onChange={(e) => setCustomCompany(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="search-submit-btn"
          disabled={isLoading || !customCompany.trim()}
        >
          {isLoading ? "Running..." : "Analyze"}
        </button>
      </form>

      <div className="mt-4 flex gap-2 items-start bg-rose-50/50 border border-rose-100 p-3 rounded-xl">
        <AlertCircle className="text-rose-800 shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-rose-900 leading-normal font-medium">
          Custom searches in Sandbox mode will generate standard financial analyses based on fundamental models. Add your API Keys in settings to unlock real-time GPT/Gemini-driven research for any global corporation.
        </p>
      </div>
    </div>
  );
}
