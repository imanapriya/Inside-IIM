"use client";

import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  Search, 
  LineChart, 
  ShieldCheck, 
  ArrowRight, 
  Sun, 
  Moon, 
  Lock, 
  Database,
  Sparkles,
  TrendingUp,
  Activity,
  Terminal,
  Layers,
  ChevronRight
} from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function LandingPage({ onStart, theme, onToggleTheme }: LandingPageProps) {
  // Simulated Terminal Log State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);

  const mockLogs = [
    "⚡ Initializing Vanguard AI Core Terminal v2.6.0...",
    "🔑 Authenticating Local API Cryptography Keys... OK (Sandbox Mode)",
    "🎯 TARGET: NVDA (NVIDIA Corporation)",
    "🤖 [WebSearchAgent] Launching Live Pipeline Crawler...",
    "🔍 [WebSearchAgent] Scraped 14 market articles & press releases.",
    "📊 [FinancialAgent] Extracting latest quarterly balance sheets...",
    "📈 [FinancialAgent] Computing Altman Z-Score: 18.34 (Extremely Safe)",
    "🧠 [SentimentAgent] Running news consensus sentiment NLP classifier...",
    "🗣️ [SentimentAgent] Social Sentiment index: +0.88 (Strong Bullish)",
    "📝 [ThesisAgent] Assembling final SWOT matrices & investment thesis...",
    "✅ [ThesisAgent] Pipeline research complete. Recommendation: INVEST.",
    "🖥️ Vanguard Terminal: Awaiting next command..."
  ];

  // Run a typing log simulation in the hero terminal mockup
  useEffect(() => {
    if (logIndex < mockLogs.length) {
      const timer = setTimeout(() => {
        setTerminalLogs((prev) => [...prev, mockLogs[logIndex]]);
        setLogIndex(logIndex + 1);
      }, logIndex === 0 ? 300 : logIndex === 3 || logIndex === 6 || logIndex === 9 ? 1200 : 700);
      return () => clearTimeout(timer);
    } else {
      // Loop simulator: clear and restart after a delay
      const resetTimer = setTimeout(() => {
        setTerminalLogs([]);
        setLogIndex(0);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [logIndex]);

  return (
    <div className="landing-page-wrapper">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-navbar-container">
          <div className="logo-group cursor-pointer">
            <div className="logo-icon-wrapper">
              <Cpu className="logo-icon text-indigo-100 animate-pulse" size={20} />
            </div>
            <div>
              <h1 className="logo-text">Vanguard AI</h1>
              <p className="logo-subtext">Autonomous Investment Terminal</p>
            </div>
          </div>

          <div className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#ecosystem" className="landing-nav-link">Agents</a>
            <a href="#presets" className="landing-nav-link">Presets Preview</a>
            <a href="#security" className="landing-nav-link">Security</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onToggleTheme} 
              className="settings-btn" 
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button 
              onClick={onStart} 
              className="btn-primary !py-2 !px-4 text-xs font-bold"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero-section">
        <div className="hero-text-content animate-fade-in">
          <div className="hero-capsule-badge">
            <Sparkles size={12} className="animate-spin text-amber-500" />
            <span>Autonomous Intelligence Platform</span>
          </div>

          <h2 className="hero-main-title">
            Deploy Autonomous Agents for Fundamental & Sentiment Analysis
          </h2>

          <p className="hero-subdescription">
            Vanguard AI orchestrates specialized autonomous sub-agent pipelines to scrape news, calculate financial solvency metrics, monitor investor sentiment, and compile institutional-grade SWOT theses in seconds.
          </p>

          <div className="hero-cta-buttons">
            <button 
              onClick={onStart} 
              className="search-submit-btn flex items-center justify-center gap-2 !w-auto !px-6 !py-3.5 text-sm"
            >
              <span>Launch Research Terminal</span>
              <ArrowRight size={16} />
            </button>
            <a 
              href="#features" 
              className="btn-secondary flex items-center justify-center gap-2 !px-6 !py-3.5 text-sm"
            >
              Explore Capabilities
            </a>
          </div>

          {/* Key Quick Stats */}
          <div className="grid grid-cols-3 gap-4 border-t border-rose-100/30 pt-6 mt-2">
            <div>
              <p className="text-xl sm:text-2xl font-black" style={{ color: "var(--maroon-deep)" }}>4</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: "var(--maroon-medium)" }}>Sub-Agents</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black" style={{ color: "var(--maroon-deep)" }}>15s</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: "var(--maroon-medium)" }}>Avg Pipeline Run</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black" style={{ color: "var(--maroon-deep)" }}>100%</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: "var(--maroon-medium)" }}>Local Key Privacy</p>
            </div>
          </div>
        </div>

        {/* Hero Interactive Terminal Mock */}
        <div className="w-full h-full flex flex-col justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="mock-terminal-wrapper">
            <div className="mock-terminal-header">
              <div className="terminal-dots">
                <div className="terminal-dot dot-red"></div>
                <div className="terminal-dot dot-yellow"></div>
                <div className="terminal-dot dot-green"></div>
              </div>
              <span className="terminal-tab-title">Active AI Execution Engine</span>
              <Terminal size={14} className="text-zinc-500" />
            </div>
            <div className="mock-terminal-body font-mono">
              {terminalLogs.map((log, index) => {
                let colorClass = "text-zinc-300";
                if (log.includes("[WebSearchAgent]")) colorClass = "terminal-accent-blue";
                else if (log.includes("[FinancialAgent]")) colorClass = "terminal-accent-yellow";
                else if (log.includes("[SentimentAgent]")) colorClass = "terminal-accent-rose";
                else if (log.includes("[ThesisAgent]")) colorClass = "terminal-accent-green";
                else if (log.includes("🎯 TARGET:") || log.includes("✅")) colorClass = "text-white font-bold";
                else if (log.startsWith("⚡")) colorClass = "text-indigo-400 font-bold";

                return (
                  <div key={index} className={`${colorClass} flex items-start gap-1.5`}>
                    <span className="text-zinc-600 select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                );
              })}
              {logIndex < mockLogs.length && (
                <div className="flex items-center gap-1 text-emerald-400 font-bold animate-pulse">
                  <span className="text-zinc-600 select-none">&gt;</span>
                  <span>Executing step {logIndex + 1}...</span>
                  <span className="w-1.5 h-3.5 bg-emerald-400 inline-block animate-pulse"></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="landing-section-wrapper border-t border-rose-100/20">
        <div className="section-intro-header">
          <span className="section-label-pill">Platform Strengths</span>
          <h3 className="section-main-heading">Modular Agent Architecture</h3>
          <p className="section-subtitle-description">
            Vanguard AI deploys a structured, sequential sub-agent pipeline. Each node performs automated domain research before passing insights downstream.
          </p>
        </div>

        <div className="agents-grid-container">
          {/* Card 1 */}
          <div className="agent-showcase-card">
            <div className="agent-icon-box bg-indigo-600">
              <Search size={22} />
            </div>
            <h4 className="agent-card-title">1. WebSearchAgent</h4>
            <p className="agent-card-desc">
              Performs autonomous queries on SEC files, corporate statements, and real-time press releases using Tavily Search API. 
            </p>
          </div>

          {/* Card 2 */}
          <div className="agent-showcase-card">
            <div className="agent-icon-box bg-amber-600">
              <Activity size={22} />
            </div>
            <h4 className="agent-card-title">2. FinancialAgent</h4>
            <p className="agent-card-desc">
              Parses balance sheets, extracts financial ratios (working capital, leverage, assets), and computes Altman Z-Scores to assess solvency.
            </p>
          </div>

          {/* Card 3 */}
          <div className="agent-showcase-card">
            <div className="agent-icon-box bg-rose-600">
              <TrendingUp size={22} />
            </div>
            <h4 className="agent-card-title">3. SentimentAgent</h4>
            <p className="agent-card-desc">
              Applies natural language processing models to index market mood indicators, news headings, and editorial sentiment scoring.
            </p>
          </div>

          {/* Card 4 */}
          <div className="agent-showcase-card">
            <div className="agent-icon-box bg-emerald-600">
              <Layers size={22} />
            </div>
            <h4 className="agent-card-title">4. ThesisAgent</h4>
            <p className="agent-card-desc">
              Synthesizes research streams into final SWOT matrices, risk tables, and outlines an investment thesis with a clear final recommendation.
            </p>
          </div>
        </div>
      </section>

      {/* Preset Stocks Preview Section */}
      <section id="presets" className="landing-section-wrapper border-t border-rose-100/20">
        <div className="section-intro-header">
          <span className="section-label-pill">Terminal Previews</span>
          <h3 className="section-main-heading">Pre-Evaluated Preset Assets</h3>
          <p className="section-subtitle-description">
            Vanguard AI stores pre-analyzed demo assets in Sandbox Mode. Sign in to view live real-time streams and run custom assets.
          </p>
        </div>

        <div className="presets-table-wrapper">
          <div className="presets-table-header">
            <h4 className="presets-table-title">Sample Investment Statuses</h4>
            <span className="interactive-badge">Preset Roster</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono">
              <thead>
                <tr className="border-b border-rose-100/20 text-rose-950 dark:text-rose-200 bg-rose-50/20 dark:bg-rose-950/20">
                  <th className="p-4">Symbol</th>
                  <th className="p-4">Sector</th>
                  <th className="p-4">Z-Score Index</th>
                  <th className="p-4">Financial Health</th>
                  <th className="p-4">Consensus</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-rose-50/50 dark:border-rose-950/30">
                  <td className="p-4 font-bold text-rose-950 dark:text-rose-100">AAPL</td>
                  <td className="p-4 text-rose-900 dark:text-rose-300">Technology</td>
                  <td className="p-4 text-emerald-600 font-bold dark:text-emerald-400">7.84</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 font-bold text-[10px]">SAFE</span>
                  </td>
                  <td className="p-4 text-emerald-600 font-bold dark:text-emerald-400">Strong Buy</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={onStart}
                      className="text-xs font-bold text-rose-800 hover:text-rose-950 dark:text-rose-300 dark:hover:text-white flex items-center gap-1 ml-auto"
                    >
                      <span>Analyze</span>
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-rose-50/50 dark:border-rose-950/30">
                  <td className="p-4 font-bold text-rose-950 dark:text-rose-100">NVDA</td>
                  <td className="p-4 text-rose-900 dark:text-rose-300">Semiconductors</td>
                  <td className="p-4 text-emerald-600 font-bold dark:text-emerald-400">18.34</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 font-bold text-[10px]">EXCEPTIONAL</span>
                  </td>
                  <td className="p-4 text-emerald-600 font-bold dark:text-emerald-400">Strong Buy</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={onStart}
                      className="text-xs font-bold text-rose-800 hover:text-rose-950 dark:text-rose-300 dark:hover:text-white flex items-center gap-1 ml-auto"
                    >
                      <span>Analyze</span>
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-rose-50/50 dark:border-rose-950/30">
                  <td className="p-4 font-bold text-rose-950 dark:text-rose-100">TSLA</td>
                  <td className="p-4 text-rose-900 dark:text-rose-300">Electric Vehicles</td>
                  <td className="p-4 text-amber-600 font-bold dark:text-amber-400">6.22</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 font-bold text-[10px]">SAFE</span>
                  </td>
                  <td className="p-4 text-amber-600 font-bold dark:text-amber-400">Neutral Pass</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={onStart}
                      className="text-xs font-bold text-rose-800 hover:text-rose-950 dark:text-rose-300 dark:hover:text-white flex items-center gap-1 ml-auto"
                    >
                      <span>Analyze</span>
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-rose-50/50 dark:border-rose-950/30">
                  <td className="p-4 font-bold text-rose-950 dark:text-rose-100">RELIANCE</td>
                  <td className="p-4 text-rose-900 dark:text-rose-300">Energy & Retail</td>
                  <td className="p-4 text-emerald-600 font-bold dark:text-emerald-400">3.10</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 font-bold text-[10px]">SAFE</span>
                  </td>
                  <td className="p-4 text-emerald-600 font-bold dark:text-emerald-400">Moderate Buy</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={onStart}
                      className="text-xs font-bold text-rose-800 hover:text-rose-950 dark:text-rose-300 dark:hover:text-white flex items-center gap-1 ml-auto"
                    >
                      <span>Analyze</span>
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Security & Client-side Storage Callout Banner */}
      <section id="security" className="landing-section-wrapper border-t border-rose-100/20">
        <div className="local-sovereignty-banner">
          <div className="sovereignty-icon-circle">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-rose-950 dark:text-rose-100 mb-1 flex items-center gap-2 justify-center md:justify-start">
              <Lock size={16} />
              <span>100% Client-Side Credentials Sovereignty</span>
            </h4>
            <p className="text-sm text-rose-900 dark:text-rose-300 leading-relaxed font-semibold">
              Vanguard AI operates on a local-first security architecture. All research API credentials (OpenAI, Gemini, Tavily) are cached exclusively inside your browser's private <code className="bg-rose-100 dark:bg-rose-950 px-1 py-0.5 rounded text-xs">localStorage</code>. Credentials are sent straight from your browser to target providers and are never transmitted to outside servers.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="logo-group">
            <div className="logo-icon-wrapper">
              <Cpu className="logo-icon text-indigo-100" size={16} />
            </div>
            <span className="logo-text !text-sm">Vanguard AI Terminal</span>
          </div>
          <p className="text-xs text-rose-900 dark:text-rose-400 font-semibold">
            © {new Date().getFullYear()} Vanguard AI. Designed for Autonomous Investment Research.
          </p>
          <div className="flex gap-4 mt-2 text-[10px] sm:text-xs text-rose-800 dark:text-rose-300 font-mono">
            <span>Client Platform v2.6.0</span>
            <span>•</span>
            <span>Next.js Architecture</span>
            <span>•</span>
            <span>Agentic Systems Group</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
