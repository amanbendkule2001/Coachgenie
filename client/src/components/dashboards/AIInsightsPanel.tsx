import { BrainCircuit, TrendingDown, BarChart2, Star, ArrowUpRight } from "lucide-react";

const insights = [
  {
    icon: TrendingDown,
    label: "At Risk Students",
    value: "8",
    sub: "Need extra attention",
    iconBg: "bg-danger-50",
    iconColor: "text-danger-500",
    valueColor: "text-danger-600",
  },
  {
    icon: BarChart2,
    label: "Avg Predicted Score",
    value: "72%",
    sub: "+4% from last month",
    iconBg: "bg-primary-50",
    iconColor: "text-primary-500",
    valueColor: "text-primary-600",
  },
  {
    icon: Star,
    label: "Top Performer",
    value: "Ravi Sharma",
    sub: "Score: 96% — Batch A",
    iconBg: "bg-warning-50",
    iconColor: "text-warning-600",
    valueColor: "text-warning-700",
  },
];

export default function AIInsightsPanel() {
  return (
    <div className="page-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <BrainCircuit size={14} className="text-white" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">AI Insights</h2>
          </div>
          <p className="text-xs text-text-muted mt-1 ml-9">Predictive analytics powered by AI</p>
        </div>
        <button className="flex items-center gap-1 text-xs text-primary-500 font-medium hover:text-primary-600 transition-colors">
          Full Report <ArrowUpRight size={13} />
        </button>
      </div>

      <div className="space-y-3">
        {insights.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-4 p-3.5 bg-surface-muted rounded-xl hover:bg-surface-border/50 transition-colors duration-200"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                <Icon size={17} className={item.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-muted font-medium">{item.label}</p>
                <p className={`text-sm font-bold truncate ${item.valueColor}`}>{item.value}</p>
              </div>
              <p className="text-xs text-text-muted text-right hidden sm:block max-w-[110px]">{item.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Gradient progress bar */}
      <div className="mt-5 pt-4 border-t border-surface-border">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span>Overall Class Progress</span>
          <span className="font-semibold text-primary-500">68%</span>
        </div>
        <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
          <div className="h-full w-[68%] bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}
