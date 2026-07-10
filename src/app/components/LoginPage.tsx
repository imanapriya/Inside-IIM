"use client";

import React, { useState } from "react";
import { Cpu, Eye, EyeOff, ShieldCheck, Lock, Mail } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("analyst@vanguard.ai");
  const [password, setPassword] = useState("vanguard2026");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    // Simple authentication logic for evaluation
    setTimeout(() => {
      if (email.trim() === "analyst@vanguard.ai" && password === "vanguard2026") {
        onLoginSuccess();
      } else {
        setErrorMsg("Invalid authorization credentials. Use the default preview account.");
        setIsSubmitting(false);
      }
    }, 800);
  };

  const handleQuickLogin = () => {
    setEmail("analyst@vanguard.ai");
    setPassword("vanguard2026");
    onLoginSuccess();
  };

  return (
    <div className="login-page-container">
      {/* Background Blobs */}
      <div className="bg-blob-container">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>

      <div className="login-card">
        <div className="login-logo-wrapper">
          <div className="login-logo-icon">
            <Cpu size={32} />
          </div>
          <h1 className="login-title">Vanguard AI</h1>
          <p className="login-subtitle">Autonomous Investment Research Terminal</p>
          <img
            src="/images/login_illustration.png"
            alt="Vanguard AI Illustration"
            className="w-full max-h-24 object-contain my-3 rounded-lg opacity-90"
          />
        </div>

        <div className="login-alert">
          <ShieldCheck size={18} className="text-rose-700 shrink-0 mt-0.5" />
          <p className="login-alert-text">
            For interview review, use the default credentials below or click the <strong>Quick Access</strong> button to login instantly.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="absolute left-3 text-zinc-400" size={16} />
              <input
                type="email"
                className="form-input !pl-9"
                placeholder="analyst@vanguard.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Access Password</label>
            <div className="input-wrapper">
              <Lock className="absolute left-3 text-zinc-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                className="form-input !pl-9 !pr-10"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="search-submit-btn mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Authorizing Security..." : "Sign In to Terminal"}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-5">
          <div className="h-px bg-zinc-200 w-full"></div>
          <span className="absolute bg-white px-3 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Alternative</span>
        </div>

        <button
          onClick={handleQuickLogin}
          className="w-full bg-rose-50 border border-rose-200 text-rose-950 font-bold text-xs py-3 rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
        >
          🚀 Instant Quick Access
        </button>
      </div>
    </div>
  );
}
