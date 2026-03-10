import { AlertTriangle, IndianRupee, PhoneCall, Bell } from "lucide-react";
import clsx from "clsx";

const alerts = [
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Test Tomorrow",
    detail: "Math Quiz for Batch A — 10:00 AM",
    time: "Tomorrow",
    borderColor: "border-warning-200",
    bg: "bg-warning-50",
    iconBg: "bg-warning-100",
    iconColor: "text-warning-600",
    timeColor: "text-warning-600",
  },
  {
    type: "danger",
    icon: IndianRupee,
    title: "Fee Overdue",
    detail: "Rajesh Kumar — ₹5,000 pending",
    time: "3 days ago",
    borderColor: "border-danger-200",
    bg: "bg-danger-50",
    iconBg: "bg-danger-100",
    iconColor: "text-danger-500",
    timeColor: "text-danger-500",
  },
  {
    type: "info",
    icon: PhoneCall,
    title: "Follow-Up Reminder",
    detail: "Call enquiry from Arjun Patel",
    time: "Today, 5:00 PM",
    borderColor: "border-primary-200",
    bg: "bg-primary-50",
    iconBg: "bg-primary-100",
    iconColor: "text-primary-500",
    timeColor: "text-primary-500",
  },
  {
    type: "warning",
    icon: Bell,
    title: "Parent Meeting",
    detail: "Rohan Mehra's parents — scheduled",
    time: "Mar 12",
    borderColor: "border-warning-200",
    bg: "bg-warning-50",
    iconBg: "bg-warning-100",
    iconColor: "text-warning-600",
    timeColor: "text-warning-600",
  },
];

export default function AlertsPanel() {
  return (
    <div className="page-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Alerts & Reminders</h2>
          <p className="text-xs text-text-muted mt-0.5">{alerts.length} active notifications</p>
        </div>
        <span className="badge bg-danger-100 text-danger-600">{alerts.length} New</span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, i) => {
          const Icon = alert.icon;
          return (
            <div
              key={i}
              className={clsx("alert-card border", alert.borderColor, alert.bg)}
            >
              <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", alert.iconBg)}>
                <Icon size={15} className={alert.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{alert.title}</p>
                <p className="text-xs text-text-secondary mt-0.5 truncate">{alert.detail}</p>
              </div>
              <span className={clsx("text-xs font-medium flex-shrink-0", alert.timeColor)}>
                {alert.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
