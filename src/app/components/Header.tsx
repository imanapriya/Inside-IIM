"use client";

import React from "react";
import { Cpu, Settings, ShieldAlert, Sun, Moon, LogOut } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
  hasKeys: boolean;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
}

export default function Header({ onOpenSettings, hasKeys, theme, onToggleTheme, onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-group">
          <div className="logo-icon-wrapper">
            <Cpu className="logo-icon text-indigo-100 animate-pulse" size={24} />
          </div>
          <div>
            <h1 className="logo-text">Vanguard AI</h1>
            <p className="logo-subtext">Autonomous Investment Research Agent</p>
          </div>
        </div>

        <div className="header-actions">
          {!hasKeys && (
            <div className="sandbox-badge">
              <ShieldAlert size={14} className="text-amber-500" />
              <span>Sandbox Mode Active</span>
            </div>
          )}
          {hasKeys && (
            <div className="live-badge">
              <span className="live-dot"></span>
              <span>Live AI Enabled</span>
            </div>
          )}
          
          <button onClick={onToggleTheme} className="settings-btn" title="Toggle Theme">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button onClick={onOpenSettings} className="settings-btn" title="API Settings">
            <Settings size={18} />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button onClick={onLogout} className="settings-btn border-rose-950/20 text-rose-800 hover:bg-rose-50" title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
