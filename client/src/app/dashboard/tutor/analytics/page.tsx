"use client";

import { useState, useEffect } from "react";
import { BrainCircuit, TrendingDown, TrendingUp, BarChart2, Star, AlertTriangle, Users } from "lucide-react";

const BASE_URL = "http://localhost:8000/api";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
}

interface DashboardData {
  total_students?: number;
  total_courses?: number;
  total_revenue?: number;
  [key: string]: any;
}

interface PerformanceData {
  avg_score?: number;
  at_risk_count?: number;
  top_performers?: { name: string; score: number }[];
  score_distribution?: { name: string; score: number; risk: string; predicted?: number; trend?: string }[];
  [key: string]: any;
}

interface RevenueData {
  total_collected?: number;
  total_pending?: number;
  by_method?: { method: string; amount: number }[];
  [key: string]: any;
}

interface EnquiriesAnalyticsData {
  by_stage?: { stage: string; count: number }[];
  by_source?: { source: string; count: number }[];
  [key: string]: any;
}

const riskColors: Record<string, string> = {
  Low: "bg-success-100 text-success-600",
  Medium: "bg-warning-100 text-warning-600",
  High: "bg-danger-100 text-danger-600",
};

export default function AnalyticsPage() {
  const [loading, setLoading]       = useState(true);
  const [dashboard, setDashboard]   = useState<DashboardData>({});
  const [performance, setPerformance] = useState<PerformanceData>({});
  const [revenue, setRevenue]       = useState<RevenueData>({});
  const [enquiriesData, setEnquiries] = useState<EnquiriesAnalyticsData>({});

  useEffect(() => {
    (async () => {
      try {
        const [dashRes, perfRes, revRes, enqRes] = await Promise.all([
          fetch(`${BASE_URL}/analytics/dashboard/`, { headers: authHeaders() }),
          fetch(`${BASE_URL}/analytics/performance/`, { headers: authHeaders() }),
          fetch(`${BASE_URL}/analytics/revenue/`, { headers: authHeaders() }),
          fetch(`${BASE_URL}/analytics/enquiries/`, { headers: authHeaders() }),
        ]);

        const [dashData, perfData, revData, enqData] = await Promise.all([
          dashRes.ok ? dashRes.json() : {},
          perfRes.ok ? perfRes.json() : {},
          revRes.ok ? revRes.json() : {},
          enqRes.ok ? enqRes.json() : {},
        ]);

        setDashboard(dashData);
        setPerformance(perfData);
        setRevenue(revData);
        setEnquiries(enqData);
      } catch {
        alert("Failed to load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const avg = performance.avg_score ?? 0;
  const atRisk = performance.at_risk_count ?? 0;
  const students = performance.score_distribution ?? [];
  const topPerformer = students.length > 0 ? students.reduce((a, b) => (a.score > b.score ? a : b)) : null;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
            <BrainCircuit size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-text-primary">AI Analytics</h1>
        </div>
        <div className="text-center py-20 text-sm text-text-muted animate-pulse">Loading analytics data…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <BrainCircuit size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">AI Analytics</h1>
          </div>
          <p className="text-sm text-text-muted mt-0.5">Predictive performance insights powered by AI</p>
        </div>
      </div>

      {/* Insight summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="page-card border-l-4 border-l-danger-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger-100 rounded-xl flex items-center justify-center">
              <AlertTriangle size={18} className="text-danger-500" />
            </div>
            <div>
              <p className="text-xs text-text-muted">At Risk Students</p>
              <p className="text-2xl font-bold text-danger-600">{atRisk}</p>
            </div>
          </div>
        </div>
        <div className="page-card border-l-4 border-l-primary-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <BarChart2 size={18} className="text-primary-500" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Avg Score</p>
              <p className="text-2xl font-bold text-primary-600">{avg}%</p>
            </div>
          </div>
        </div>
        <div className="page-card border-l-4 border-l-warning-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center">
              <Star size={18} className="text-warning-600" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Top Performer</p>
              {topPerformer ? (
                <>
                  <p className="text-base font-bold text-warning-700">{topPerformer.name}</p>
                  <p className="text-xs text-text-muted">{topPerformer.score}% score</p>
                </>
              ) : (
                <p className="text-base font-bold text-text-muted">—</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance table */}
      {students.length > 0 && (
        <div className="page-card">
          <div className="flex items-center gap-2 mb-5">
            <Users size={16} className="text-primary-500" />
            <h2 className="text-base font-semibold text-text-primary">Student Performance Predictions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header text-left rounded-l-lg">Student</th>
                  <th className="table-header text-right">Current Score</th>
                  <th className="table-header text-right">AI Predicted</th>
                  <th className="table-header text-center">Trend</th>
                  <th className="table-header text-left rounded-r-lg">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{s.name.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-medium text-text-primary">{s.name}</span>
                      </div>
                    </td>
                    <td className="table-cell text-right font-semibold text-text-primary">{s.score}%</td>
                    <td className="table-cell text-right">
                      <span className={`font-bold ${(s.predicted ?? s.score) >= s.score ? "text-success-600" : "text-danger-600"}`}>
                        {s.predicted ?? "—"}{s.predicted !== undefined ? "%" : ""}
                      </span>
                    </td>
                    <td className="table-cell text-center">
                      {s.trend === "up"
                        ? <TrendingUp size={16} className="text-success-500 mx-auto" />
                        : <TrendingDown size={16} className="text-danger-500 mx-auto" />}
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${riskColors[s.risk] ?? "bg-surface-muted text-text-muted"}`}>{s.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Score Distribution */}
          <div className="mt-6 pt-4 border-t border-surface-border">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Score Distribution</h3>
            <div className="space-y-2">
              {students.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-text-muted w-24 truncate flex-shrink-0">{s.name.split(" ")[0]}</span>
                  <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.risk === "High" ? "bg-danger-400" : s.risk === "Medium" ? "bg-warning-400" : "bg-primary-500"}`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-text-primary w-10 text-right">{s.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Summary */}
      {(revenue.total_collected !== undefined || revenue.total_pending !== undefined) && (
        <div className="page-card">
          <h2 className="text-base font-semibold text-text-primary mb-4">Revenue Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-success-500/10 border border-success-500/30 rounded-2xl p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Collected</p>
              <p className="text-2xl font-bold text-success-600">₹{(revenue.total_collected ?? 0).toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-danger-500/10 border border-danger-500/30 rounded-2xl p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Pending</p>
              <p className="text-2xl font-bold text-danger-600">₹{(revenue.total_pending ?? 0).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Enquiries Funnel */}
      {enquiriesData.by_stage && enquiriesData.by_stage.length > 0 && (
        <div className="page-card">
          <h2 className="text-base font-semibold text-text-primary mb-4">Enquiry Pipeline</h2>
          <div className="space-y-2">
            {enquiriesData.by_stage.map((s: any) => (
              <div key={s.stage} className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-24 truncate flex-shrink-0">{s.stage}</span>
                <div className="flex-1 h-3 bg-surface-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary-500"
                    style={{ width: `${Math.min((s.count / Math.max(...(enquiriesData.by_stage ?? []).map((x: any) => x.count), 1)) * 100, 100)}%` }} />
                </div>
                <span className="text-xs font-semibold text-text-primary w-6 text-right">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
