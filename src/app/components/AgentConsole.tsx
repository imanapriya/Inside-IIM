"use client";

import React, { useEffect, useRef } from "react";
import { Terminal, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

export interface AgentLog {
  message: string;
  logType: "info" | "success" | "warn" | "error";
  progress: number;
  timestamp: string;
}

interface AgentConsoleProps {
  logs: AgentLog[];
  progress: number;
  isLoading: boolean;
  companyName: string;
}

export default function AgentConsole({ logs, progress, isLoading, companyName }: AgentConsoleProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getLogIcon = (type: "info" | "success" | "warn" | "error") => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />;
      case "warn":
        return <AlertTriangle size={14} className="text-amber-400 shrink-0" />;
      case "error":
        return <XCircle size={14} className="text-red-400 shrink-0" />;
      default:
        return <Info size={14} className="text-blue-400 shrink-0" />;
    }
  };

  const getLogColorClass = (type: "info" | "success" | "warn" | "error") => {
    switch (type) {
      case "success":
        return "text-emerald-400 font-medium";
      case "warn":
        return "text-amber-400";
      case "error":
        return "text-red-400 font-semibold";
      default:
        return "text-zinc-300";
    }
  };

  return (
    <div className="console-card">
      <div className="console-header">
        <div className="flex items-center gap-2">
          <Terminal className="text-indigo-400" size={18} />
          <span className="font-mono text-sm font-semibold text-zinc-300">
            Agent Execution Environment {companyName && `:: [${companyName}]`}
          </span>
        </div>
        {isLoading && (
          <div className="flex items-center gap-1.5">
            <span className="live-pulse-dot"></span>
            <span className="text-xs text-indigo-400 font-medium font-mono uppercase tracking-wider">Processing</span>
          </div>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="progress-container">
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-labels">
          <span className="progress-percent font-mono">{progress}% Complete</span>
          {isLoading && <span className="progress-status animate-pulse">Running sub-agents...</span>}
        </div>
      </div>

      {/* Console log window */}
      <div className="console-window">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono py-12">
            <p className="text-sm">Console idle. Select an asset to execute research pipeline.</p>
          </div>
        ) : (
          <div className="console-logs font-mono text-xs leading-relaxed">
            {logs.map((log, index) => (
              <div key={index} className={`log-row flex items-start gap-2 py-1 border-b border-zinc-900/10 ${index === logs.length - 1 ? 'last-row-animate' : ''}`}>
                <span className="log-time text-zinc-600 shrink-0 select-none">[{log.timestamp}]</span>
                {getLogIcon(log.logType)}
                <span className={getLogColorClass(log.logType)}>{log.message}</span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
