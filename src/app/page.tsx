"use client";

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SettingsModal from "./components/SettingsModal";
import CompanySelector from "./components/CompanySelector";
import AgentConsole, { AgentLog } from "./components/AgentConsole";
import FinancialDashboard from "./components/FinancialDashboard";
import ReportView from "./components/ReportView";
import LoginPage from "./components/LoginPage";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Home() {
  // Authentication & Theme States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasKeys, setHasKeys] = useState(false);
  const [apiKeys, setApiKeys] = useState({ openai: "", gemini: "", tavily: "" });

  const [companyName, setCompanyName] = useState("");
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Load API keys, theme, and authentication state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const openai = localStorage.getItem("vanguard_openai_key") || "";
      const gemini = localStorage.getItem("vanguard_gemini_key") || "";
      const tavily = localStorage.getItem("vanguard_tavily_key") || "";
      
      setApiKeys({ openai, gemini, tavily });
      setHasKeys(!!(openai || gemini));

      // Theme configuration
      const savedTheme = localStorage.getItem("vanguard_theme") as "light" | "dark";
      if (savedTheme) {
        setTheme(savedTheme);
      }

      // Retrieve session token if available to bypass re-login
      const sessionAuth = sessionStorage.getItem("vanguard_authorized");
      if (sessionAuth === "true") {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    sessionStorage.setItem("vanguard_authorized", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("vanguard_authorized");
    setIsLoggedIn(false);
    setCompanyName("");
    setLogs([]);
    setProgress(0);
    setResultData(null);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("vanguard_theme", nextTheme);
  };

  const handleSaveKeys = (keys: { openai: string; gemini: string; tavily: string }) => {
    setApiKeys(keys);
    setHasKeys(!!(keys.openai || keys.gemini));
  };

  const handleResearch = async (targetCompany: string) => {
    setCompanyName(targetCompany);
    setLogs([]);
    setProgress(0);
    setIsLoading(true);
    setResultData(null);
    setErrorMsg("");

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: targetCompany,
          useDemo: !hasKeys,
          apiKeys,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned error status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received from stream endpoint");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const line = part.trim();
          if (line.startsWith("data: ")) {
            try {
              const dataStr = line.substring(6);
              const data = JSON.parse(dataStr);

              if (data.type === "log") {
                const now = new Date();
                const timeStr = now.toTimeString().split(" ")[0];
                
                setLogs((prev) => [
                  ...prev,
                  {
                    message: data.message,
                    logType: data.logType,
                    progress: data.progress,
                    timestamp: timeStr,
                  },
                ]);
                setProgress(data.progress);
              } else if (data.type === "result") {
                setResultData(data.data);
              }
            } catch (err) {
              console.error("Error parsing stream chunk:", err);
            }
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during research.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCompanyName("");
    setLogs([]);
    setProgress(0);
    setResultData(null);
    setErrorMsg("");
  };

  // Guard routing using LoginPage
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`app-container theme-${theme}`}>
      {/* Background Blobs for aesthetic elevation */}
      <div className="bg-blob-container">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>

      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasKeys={hasKeys}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <div className="workspace-grid">
          {/* Sidebar / Left Column */}
          <div className="flex flex-col gap-6">
            {!companyName ? (
              <CompanySelector onSearch={handleResearch} isLoading={isLoading} />
            ) : (
              <div className="selector-card flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-rose-950">Active Pipeline</h3>
                  <button
                    onClick={handleReset}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 text-xs text-rose-800 hover:text-rose-950 font-bold disabled:opacity-50 transition-colors"
                  >
                    <RotateCcw size={12} />
                    <span>Analyze Another</span>
                  </button>
                </div>
                <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                  <span className="text-xs text-rose-900 font-mono font-bold">TARGET SYMBOL / NAME</span>
                  <p className="text-lg font-bold text-rose-950 mt-0.5">{companyName}</p>
                </div>
              </div>
            )}

            {(companyName || logs.length > 0) && (
              <AgentConsole
                logs={logs}
                progress={progress}
                isLoading={isLoading}
                companyName={companyName}
              />
            )}
          </div>

          {/* Main Panel / Right Column */}
          <div className="flex flex-col gap-6">
            {errorMsg && (
              <div className="flex gap-3 bg-red-50 border border-red-200 p-4 rounded-xl text-red-700">
                <AlertCircle size={20} className="shrink-0" />
                <div>
                  <h4 className="font-bold">Execution Failed</h4>
                  <p className="text-sm mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            {!companyName && !resultData && (
              /* Welcome Dashboard (Fills the right-side blank space beautifully with active statistics) */
              <div className="flex flex-col gap-6 w-full animate-fade-in">
                <div className="dashboard-card bg-gradient-to-r from-rose-950 to-rose-900 text-white p-6 rounded-2xl border-none relative overflow-hidden shadow-lg flex flex-col md:flex-row gap-6 items-center">
                  <div className="absolute right-0 top-0 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black mb-2 text-rose-100">Vanguard AI Core Terminal</h2>
                    <p className="text-sm text-rose-100/90 max-w-xl leading-relaxed font-medium">
                      Welcome to the Next-Generation Autonomous Investment Research Environment. 
                      Vanguard AI uses advanced language models to run deep analyses on corporate statements, live market sentiment, and financial distress ratios.
                    </p>
                  </div>
                  <div className="w-full md:w-48 shrink-0">
                    <img
                      src="/images/finance_banner.png"
                      alt="Finance Analytics"
                      className="w-full h-24 object-cover rounded-xl border border-white/10 shadow-md"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Market Overview Widget */}
                  <div className="dashboard-card">
                    <div className="card-header border-b border-rose-100/50 pb-2 mb-4">
                      <h3 className="card-title">Live Presets Overview</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-mono">
                        <thead>
                          <tr className="border-b border-rose-100 text-rose-900">
                            <th className="py-2">Asset</th>
                            <th className="py-2">Sector</th>
                            <th className="py-2 text-right">Z-Score</th>
                            <th className="py-2 text-right">Recommendation</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-rose-50/50">
                            <td className="py-2.5 font-bold text-rose-950">AAPL</td>
                            <td className="py-2.5 text-rose-900">Tech</td>
                            <td className="py-2.5 text-right text-emerald-600 font-bold">7.84</td>
                            <td className="py-2.5 text-right"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">INVEST</span></td>
                          </tr>
                          <tr className="border-b border-rose-50/50">
                            <td className="py-2.5 font-bold text-rose-950">NVDA</td>
                            <td className="py-2.5 text-rose-900">Chips</td>
                            <td className="py-2.5 text-right text-emerald-600 font-bold">18.34</td>
                            <td className="py-2.5 text-right"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">INVEST</span></td>
                          </tr>
                          <tr className="border-b border-rose-50/50">
                            <td className="py-2.5 font-bold text-rose-950">TSLA</td>
                            <td className="py-2.5 text-rose-900">EVs</td>
                            <td className="py-2.5 text-right text-amber-600 font-bold">6.22</td>
                            <td className="py-2.5 text-right"><span className="px-2 py-0.5 rounded bg-rose-200 text-rose-800 font-bold text-[9px]">PASS</span></td>
                          </tr>
                          <tr className="border-b border-rose-50/50">
                            <td className="py-2.5 font-bold text-rose-950">RELIANCE</td>
                            <td className="py-2.5 text-rose-900">Conglomerate</td>
                            <td className="py-2.5 text-right text-emerald-600 font-bold">3.10</td>
                            <td className="py-2.5 text-right"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">INVEST</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Capability Cards */}
                  <div className="dashboard-card flex flex-col justify-between">
                    <div>
                      <div className="card-header border-b border-rose-100/50 pb-2 mb-3">
                        <h3 className="card-title">Sub-Agent Pipelines</h3>
                      </div>
                      <ul className="flex flex-col gap-2.5 text-xs text-rose-900 leading-relaxed font-semibold">
                        <li className="flex items-start gap-1.5">
                          <span className="text-indigo-600 font-bold">⬢</span>
                          <span><strong>WebSearchAgent:</strong> Crawls real-time news articles and stock releases.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">⬢</span>
                          <span><strong>FinancialAgent:</strong> Calculates solvency margins and Altman Z-Scores.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-coral-orange font-bold">⬢</span>
                          <span><strong>SentimentAgent:</strong> Tracks investor social/media consensus gauges.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">⬢</span>
                          <span><strong>ThesisAgent:</strong> Synthesizes final SWOT matrices and core recommendations.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-100 text-[10px] text-rose-800 font-bold">
                      ⚡ Select an asset from the left sidebar to execute the pipeline.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {resultData && (
              <>
                <FinancialDashboard
                  recommendation={resultData.recommendation}
                  metrics={resultData.metrics}
                  sentiment={resultData.sentiment}
                  risks={resultData.risks}
                  companyName={companyName}
                />
                <ReportView
                  reasoning={resultData.reasoning}
                  swot={resultData.swot}
                  companyName={companyName}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveKeys}
      />
    </div>
  );
}
