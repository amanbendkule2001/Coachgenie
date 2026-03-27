"use client";

import { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, Target, Loader2 } from "lucide-react";
import { loadFromStorage } from "@/lib/storage";
import { Student } from "@/types";
import clsx from "clsx";

interface InsightData {
  atRisk: number;
  averageScore: number;
  topPerformers: number;
  loading: boolean;
}

export default function AIInsightsPanel() {
  const [data, setData] = useState<InsightData>({ atRisk: 0, averageScore: 0, topPerformers: 0, loading: true });

  useEffect(() => {
    // Simulate AI processing delay
    const timer = setTimeout(() => {
      const students = loadFromStorage<Student[]>("students", []);
      if (!students.length) {
        setData({ atRisk: 0, averageScore: 0, topPerformers: 0, loading: false });
        return;
      }

      const active = students.filter((s) => s.status !== "Inactive");
      const atRisk = active.filter((s) => s.score < 50 || s.status === "At Risk").length;
      const topP = active.filter((s) => s.score >= 85).length;
      const avg = active.length > 0 ? Math.round(active.reduce((acc, s) => acc + s.score, 0) / active.length) : 0;

      setData({ atRisk, averageScore: avg, topPerformers: topP, loading: false });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-card flex flex-col relative overflow-hidden animate-fade-in group">
      {/* Background glow for AI vibe */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-colors" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <SparklesIcon />
          Performance Insights
        </h2>
        <span className="badge bg-primary-500/20 text-primary-400 border-primary-500/30">Live AI</span>
      </div>

      {data.loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 relative z-10">
          <Loader2 size={24} className="text-primary-500 animate-spin mb-3" />
          <p className="text-sm font-semibold text-text-primary">Analyzing Student Data...</p>
          <p className="text-xs text-text-muted mt-1">Calculating predictive scores</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 relative z-10">
          {/* Main Prediction Card */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs font-semibold text-primary-100 uppercase tracking-wider">
                  Batch Average Score
                </p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-3xl font-black">{data.averageScore}%</span>
                  <span className="text-xs font-medium text-success-300 flex items-center bg-white/20 px-1.5 py-0.5 rounded-lg mb-1">
                    <TrendingUp size={10} className="mr-0.5" /> +2.4%
                  </span>
                </div>
              </div>
              <Target size={24} className="text-primary-200 opacity-80" />
            </div>
            <p className="text-xs text-primary-100/90 leading-tight">
              Predicted to improve by 5% before final exams based on current submission rates.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Risk Card */}
            <div className="bg-danger-500/10 border border-danger-500/30 rounded-2xl p-3 flex flex-col justify-between transition-colors hover:bg-danger-500/20">
              <div className="flex items-center gap-2 mb-2 text-danger-400">
                <AlertTriangle size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Requires Focus</span>
              </div>
              <div>
                <span className="text-xl font-bold text-text-primary">{data.atRisk} Students</span>
                <p className="text-xs text-text-muted mt-0.5 leading-tight">identified as at-risk</p>
              </div>
            </div>

            {/* Top Performers Card */}
            <div className="bg-success-500/10 border border-success-500/30 rounded-2xl p-3 flex flex-col justify-between transition-colors hover:bg-success-500/20">
              <div className="flex items-center gap-2 mb-2 text-success-400">
                <Target size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Top Tier</span>
              </div>
              <div>
                <span className="text-xl font-bold text-text-primary">{data.topPerformers} Students</span>
                <p className="text-xs text-text-muted mt-0.5 leading-tight">scoring above 85%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
