import { Users, BookOpen, CalendarClock, IndianRupee } from "lucide-react";
import clsx from "clsx";

const stats = [
  {
    label: "Total Students",
    value: "120",
    subtext: "+8 this month",
    icon: Users,
    iconBg: "bg-primary-50",
    iconColor: "text-primary-500",
    borderColor: "border-l-primary-500",
    trend: "up",
  },
  {
    label: "Active Courses",
    value: "5",
    subtext: "2 starting soon",
    icon: BookOpen,
    iconBg: "bg-success-50",
    iconColor: "text-success-600",
    borderColor: "border-l-success-500",
    trend: "neutral",
  },
  {
    label: "Upcoming Classes",
    value: "3 Today",
    subtext: "Next: 4:00 PM",
    icon: CalendarClock,
    iconBg: "bg-warning-50",
    iconColor: "text-warning-600",
    borderColor: "border-l-warning-500",
    trend: "neutral",
  },
  {
    label: "Pending Fees",
    value: "₹15,000",
    subtext: "4 students overdue",
    icon: IndianRupee,
    iconBg: "bg-danger-50",
    iconColor: "text-danger-500",
    borderColor: "border-l-danger-500",
    trend: "down",
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={clsx(
              "stat-card border-l-4",
              stat.borderColor
            )}
          >
            <div className={clsx("stat-icon-box", stat.iconBg)}>
              <Icon size={22} className={stat.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-text-primary leading-tight">
                {stat.value}
              </p>
              <p className="text-xs text-text-muted mt-1">{stat.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
