import { BrainCircuit, TrendingDown, TrendingUp, BarChart2, Star, AlertTriangle, Users } from "lucide-react";

const students = [
  { name: "Ravi Sharma",   score: 96, predicted: 98, risk: "Low",    trend: "up" },
  { name: "Ananya Singh",  score: 88, predicted: 91, risk: "Low",    trend: "up" },
  { name: "Priya Sharma",  score: 91, predicted: 89, risk: "Low",    trend: "down" },
  { name: "Arjun Verma",   score: 83, predicted: 85, risk: "Low",    trend: "up" },
  { name: "Meena Joshi",   score: 78, predicted: 76, risk: "Medium", trend: "down" },
  { name: "Rajesh Kumar",  score: 72, predicted: 70, risk: "Medium", trend: "down" },
  { name: "Suresh Patel",  score: 65, predicted: 62, risk: "High",   trend: "down" },
  { name: "Kavya Iyer",    score: 59, predicted: 55, risk: "High",   trend: "down" },
];

const riskColors: Record<string, string> = {
  Low: "bg-success-100 text-success-600",
  Medium: "bg-warning-100 text-warning-600",
  High: "bg-danger-100 text-danger-600",
};

export default function AnalyticsPage() {
  const avg = Math.round(students.reduce((s, st) => s + st.score, 0) / students.length);
  const atRisk = students.filter(s => s.risk === "High").length;
  const topPerformer = students.reduce((a, b) => a.score > b.score ? a : b);

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
              <p className="text-xs text-text-muted">Avg Predicted Score</p>
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
              <p className="text-base font-bold text-warning-700">{topPerformer.name}</p>
              <p className="text-xs text-text-muted">{topPerformer.score}% score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance table */}
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
                    <span className={`font-bold ${s.predicted >= s.score ? "text-success-600" : "text-danger-600"}`}>
                      {s.predicted}%
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    {s.trend === "up"
                      ? <TrendingUp size={16} className="text-success-500 mx-auto" />
                      : <TrendingDown size={16} className="text-danger-500 mx-auto" />}
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${riskColors[s.risk]}`}>{s.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Class score bar chart (visual) */}
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
    </div>
  );
}
