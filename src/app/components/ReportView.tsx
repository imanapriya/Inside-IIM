"use client";

import React, { useState } from "react";
import { Download, FileText, Share2, ClipboardCheck, Sparkles, TrendingUp } from "lucide-react";

interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface ReportViewProps {
  reasoning: string;
  swot: SWOT;
  companyName: string;
}

export default function ReportView({ reasoning, swot, companyName }: ReportViewProps) {
  const [activeTab, setActiveTab] = useState<"thesis" | "swot">("thesis");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(reasoning);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-card">
      <div className="report-toolbar">
        <div className="report-tabs">
          <button
            onClick={() => setActiveTab("thesis")}
            className={`report-tab-btn ${activeTab === "thesis" ? "active-tab" : ""}`}
          >
            <Sparkles size={16} />
            <span>Investment Thesis</span>
          </button>
          <button
            onClick={() => setActiveTab("swot")}
            className={`report-tab-btn ${activeTab === "swot" ? "active-tab" : ""}`}
          >
            <TrendingUp size={16} />
            <span>SWOT Profile</span>
          </button>
        </div>

        <div className="toolbar-actions">
          <button onClick={handleCopy} className="toolbar-btn" title="Copy markdown to clipboard">
            {copied ? <ClipboardCheck size={16} className="text-emerald-400 animate-scale" /> : <Share2 size={16} />}
            <span>{copied ? "Copied" : "Share Thesis"}</span>
          </button>
          <button onClick={handlePrint} className="toolbar-btn" title="Print / Save PDF">
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="report-content">
        {activeTab === "thesis" ? (
          <article className="thesis-markdown prose prose-invert max-w-none">
            {/* Split and render markdown headers for better layout */}
            {reasoning.split("\n").map((line, index) => {
              if (line.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-indigo-400 font-semibold text-lg mt-6 mb-2 border-b border-zinc-800 pb-1">
                    {line.replace("### ", "")}
                  </h3>
                );
              }
              if (line.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-zinc-100 font-bold text-xl mt-8 mb-4 border-l-4 border-indigo-500 pl-3">
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={index} className="font-bold text-zinc-200 mt-2">
                    {line.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (line.startsWith("- ")) {
                const parts = line.replace("- ", "").split(": ");
                if (parts.length > 1) {
                  return (
                    <li key={index} className="text-zinc-300 ml-4 list-disc py-0.5">
                      <strong className="text-indigo-300">{parts[0]}:</strong> {parts.slice(1).join(": ")}
                    </li>
                  );
                }
                return (
                  <li key={index} className="text-zinc-300 ml-4 list-disc py-0.5">
                    {line.replace("- ", "")}
                  </li>
                );
              }
              if (line.trim().match(/^\d+\.\s/)) {
                return (
                  <li key={index} className="text-zinc-300 ml-4 list-decimal py-0.5">
                    {line.replace(/^\d+\.\s/, "")}
                  </li>
                );
              }
              if (!line.trim()) return <div key={index} className="h-2" />;
              return (
                <p key={index} className="text-zinc-300 leading-relaxed text-sm mb-4">
                  {line}
                </p>
              );
            })}
          </article>
        ) : (
          <div className="swot-grid">
            <div className="swot-card swot-strengths">
              <div className="swot-tag">S</div>
              <h4 className="swot-title">Strengths</h4>
              <ul className="swot-list">
                {swot.strengths.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="swot-card swot-weaknesses">
              <div className="swot-tag">W</div>
              <h4 className="swot-title">Weaknesses</h4>
              <ul className="swot-list">
                {swot.weaknesses.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="swot-card swot-opportunities">
              <div className="swot-tag">O</div>
              <h4 className="swot-title">Opportunities</h4>
              <ul className="swot-list">
                {swot.opportunities.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="swot-card swot-threats">
              <div className="swot-tag">T</div>
              <h4 className="swot-title">Threats</h4>
              <ul className="swot-list">
                {swot.threats.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
