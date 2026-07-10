"use client";

import React from "react";
import { TrendingUp, AlertTriangle, Activity, BarChart3, PieChart, ShieldAlert } from "lucide-react";

interface Metrics {
  peRatio: string;
  revenueGrowth: string;
  debtToEquity: string;
  profitMargin: string;
  altmanZScore: string;
  marketCap: string;
}

interface Sentiment {
  bullish: number;
  bearish: number;
  neutral: number;
}

interface Risks {
  high: string[];
  medium: string[];
  low: string[];
}

interface FinancialDashboardProps {
  recommendation: "INVEST" | "PASS";
  metrics: Metrics;
  sentiment: Sentiment;
  risks: Risks;
  companyName: string;
}

export default function FinancialDashboard({
  recommendation,
  metrics,
  sentiment,
  risks,
  companyName,
}: FinancialDashboardProps) {
  const isInvest = recommendation === "INVEST";

  // Calculate needle rotation for sentiment dial (from -90deg to +90deg)
  // Let's map (bullish - bearish) from -100 to +100 onto -90deg to +90deg
  const netSentiment = sentiment.bullish - sentiment.bearish; // -100 to 100
  const rotationAngle = (netSentiment / 100) * 90; // -90 to 90

  // Altman Z-Score safety status
  const zScore = parseFloat(metrics.altmanZScore) || 0;
  let zScoreStatus = { text: "Distress Zone", color: "text-red-400 border-red-950 bg-red-950/20" };
  if (zScore > 2.99) {
    zScoreStatus = { text: "Safe Zone", color: "text-emerald-400 border-emerald-950 bg-emerald-950/20" };
  } else if (zScore >= 1.81) {
    zScoreStatus = { text: "Grey Zone", color: "text-amber-400 border-amber-950 bg-amber-950/20" };
  }

  return (
    <div className="dashboard-container">
      {/* Recommendation Hero Banner */}
      <div className={`recommendation-hero ${isInvest ? "hero-invest" : "hero-pass"}`}>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div>
            <span className="hero-label">Final Investment Directive</span>
            <h2 className="hero-title">{companyName}</h2>
          </div>
          <div className="flex flex-col items-end">
            <span className={`hero-verdict-badge ${isInvest ? "badge-invest" : "badge-pass"}`}>
              {recommendation}
            </span>
            <p className="hero-verdict-caption">
              {isInvest
                ? "Fundamentals, sentiments, and growth runways align with target return thresholds."
                : "Risk indicators, valuation multiples, or competitive headwind profiles suggest passing."}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics & Ratios Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-card col-span-2">
          <div className="card-header">
            <BarChart3 className="text-indigo-400" size={18} />
            <h3 className="card-title">Key Valuation & Solvency Metrics</h3>
          </div>
          <div className="metrics-grid">
            <div className="metric-box">
              <span className="metric-name">Market Capitalization</span>
              <span className="metric-value text-zinc-100">{metrics.marketCap}</span>
            </div>
            <div className="metric-box">
              <span className="metric-name">Price-to-Earnings (P/E)</span>
              <span className="metric-value text-zinc-100">{metrics.peRatio}x</span>
            </div>
            <div className="metric-box">
              <span className="metric-name">YoY Revenue Growth</span>
              <span className={`metric-value ${metrics.revenueGrowth.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>
                {metrics.revenueGrowth}
              </span>
            </div>
            <div className="metric-box">
              <span className="metric-name">Debt-to-Equity Ratio</span>
              <span className="metric-value text-zinc-100">{metrics.debtToEquity}</span>
            </div>
            <div className="metric-box">
              <span className="metric-name">Net Profit Margin</span>
              <span className="metric-value text-zinc-100">{metrics.profitMargin}</span>
            </div>
            <div className="metric-box">
              <span className="metric-name">Altman Z-Score</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="metric-value text-zinc-100">{metrics.altmanZScore}</span>
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${zScoreStatus.color}`}>
                  {zScoreStatus.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Speedometer */}
        <div className="dashboard-card">
          <div className="card-header">
            <PieChart className="text-indigo-400" size={18} />
            <h3 className="card-title">Market Sentiment Dial</h3>
          </div>
          <div className="sentiment-dial-container">
            <div className="dial-gauge">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                {/* Arc tracks */}
                <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#27272a" strokeWidth="8" />
                <path d="M10,50 A40,40 0 0,1 50,10" fill="none" stroke="#ef4444" strokeWidth="8" />
                <path d="M50,10 A40,40 0 0,1 90,50" fill="none" stroke="#10b981" strokeWidth="8" />
                
                {/* Needle */}
                <line
                  x1="50" y1="50"
                  x2="50" y2="15"
                  stroke="#6366f1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform={`rotate(${rotationAngle} 50 50)`}
                  className="dial-needle"
                />
                <circle cx="50" cy="50" r="5" fill="#6366f1" />
              </svg>
            </div>
            <div className="sentiment-labels flex justify-between w-full px-6 text-xs text-zinc-400 mt-2 font-mono">
              <span className="text-red-400 font-semibold">Bearish ({sentiment.bearish}%)</span>
              <span className="text-zinc-500">Neutral ({sentiment.neutral}%)</span>
              <span className="text-emerald-400 font-semibold">Bullish ({sentiment.bullish}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risks Matrix */}
      <div className="dashboard-card mt-6">
        <div className="card-header">
          <ShieldAlert className="text-indigo-400" size={18} />
          <h3 className="card-title">Categorized Risk Matrix</h3>
        </div>
        <div className="risk-grid mt-4">
          <div className="risk-column risk-high bg-red-950/10 border-red-900/20">
            <h4 className="risk-col-title text-red-400">
              <AlertTriangle size={14} />
              <span>High Risk</span>
            </h4>
            <ul className="risk-list">
              {risks.high.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>
          <div className="risk-column risk-medium bg-amber-950/10 border-amber-900/20">
            <h4 className="risk-col-title text-amber-400">
              <AlertTriangle size={14} />
              <span>Medium Risk</span>
            </h4>
            <ul className="risk-list">
              {risks.medium.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>
          <div className="risk-column risk-low bg-emerald-950/10 border-emerald-900/20">
            <h4 className="risk-col-title text-emerald-400">
              <Activity size={14} />
              <span>Low Risk</span>
            </h4>
            <ul className="risk-list">
              {risks.low.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
