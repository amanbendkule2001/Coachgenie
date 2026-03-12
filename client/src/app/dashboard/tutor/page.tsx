import StatCards from "@/components/dashboards/StatCards";
import CalendarWidget from "@/components/dashboards/CalendarWidget";
import AlertsPanel from "@/components/dashboards/AlertsPanel";
import AIInsightsPanel from "@/components/dashboards/AIInsightsPanel";
import ActivityFeed from "@/components/dashboards/ActivityFeed";

export default function TutorDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">Dashboard Overview</h1>
        <p className="text-sm text-text-muted mt-0.5">Tuesday, March 10, 2026</p>
      </div>

      {/* Quick Stat Cards */}
      <StatCards />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column (75%) */}
        <div className="lg:col-span-3 space-y-6">
          <AlertsPanel />
          <ActivityFeed />
        </div>

        {/* Right column (25%) */}
        <div className="space-y-6">
          <CalendarWidget />
          <AIInsightsPanel />
        </div>
      </div>
    </div>
  );
}
