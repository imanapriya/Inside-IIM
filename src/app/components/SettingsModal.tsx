"use client";

import React, { useState, useEffect } from "react";
import { X, Key, ShieldCheck, Eye, EyeOff } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: { openai: string; gemini: string; tavily: string }) => void;
}

export default function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [tavilyKey, setTavilyKey] = useState("");

  const [showOpenai, setShowOpenai] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [showTavily, setShowTavily] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOpenaiKey(localStorage.getItem("vanguard_openai_key") || "");
      setGeminiKey(localStorage.getItem("vanguard_gemini_key") || "");
      setTavilyKey(localStorage.getItem("vanguard_tavily_key") || "");
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem("vanguard_openai_key", openaiKey);
    localStorage.setItem("vanguard_gemini_key", geminiKey);
    localStorage.setItem("vanguard_tavily_key", tavilyKey);
    onSave({ openai: openaiKey, gemini: geminiKey, tavily: tavilyKey });
    onClose();
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your API keys?")) {
      setOpenaiKey("");
      setGeminiKey("");
      setTavilyKey("");
      localStorage.removeItem("vanguard_openai_key");
      localStorage.removeItem("vanguard_gemini_key");
      localStorage.removeItem("vanguard_tavily_key");
      onSave({ openai: "", gemini: "", tavily: "" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Key className="text-indigo-400" size={20} />
            <h2 className="modal-title">API Configurations</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Provide your API credentials to run **Live AI Analysis**. If left empty, Vanguard AI will automatically use **Sandbox Mode** with high-fidelity simulated runs.
          </p>

          <div className="modal-alert">
            <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
            <p className="text-xs text-zinc-300">
              Keys are stored 100% locally in your browser's <code>localStorage</code> and are only transmitted directly to your local API route.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">OpenAI API Key (for GPT Models)</label>
            <div className="input-wrapper">
              <input
                type={showOpenai ? "text" : "password"}
                className="form-input"
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowOpenai(!showOpenai)}
              >
                {showOpenai ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Gemini API Key (Alternative LLM)</label>
            <div className="input-wrapper">
              <input
                type={showGemini ? "text" : "password"}
                className="form-input"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowGemini(!showGemini)}
              >
                {showGemini ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tavily API Key (for Live Web Search)</label>
            <div className="input-wrapper">
              <input
                type={showTavily ? "text" : "password"}
                className="form-input"
                placeholder="tvly-..."
                value={tavilyKey}
                onChange={(e) => setTavilyKey(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowTavily(!showTavily)}
              >
                {showTavily ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleClear} className="btn-secondary text-red-400 border-red-900/30 hover:bg-red-950/20">
            Clear Keys
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              Save Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
