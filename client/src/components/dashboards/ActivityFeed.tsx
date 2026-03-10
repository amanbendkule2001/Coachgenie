import { UserPlus, CreditCard, FileUp, Clock, BookOpen, CheckCircle } from "lucide-react";
import clsx from "clsx";

const activities = [
  {
    icon: UserPlus,
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
    title: "New Enrollment",
    description: "Ananya Singh joined Batch B",
    time: "2 min ago",
    dotColor: "bg-primary-500",
  },
  {
    icon: CreditCard,
    iconBg: "bg-success-100",
    iconColor: "text-success-600",
    title: "Payment Received",
    description: "₹10,000 received from Suresh Kumar",
    time: "18 min ago",
    dotColor: "bg-success-500",
  },
  {
    icon: FileUp,
    iconBg: "bg-warning-100",
    iconColor: "text-warning-600",
    title: "Material Uploaded",
    description: "Physics Notes – Chapter 7 added",
    time: "1 hr ago",
    dotColor: "bg-warning-500",
  },
  {
    icon: CheckCircle,
    iconBg: "bg-success-100",
    iconColor: "text-success-600",
    title: "Test Marked",
    description: "Math Quiz results entered for Batch A",
    time: "3 hrs ago",
    dotColor: "bg-success-500",
  },
  {
    icon: BookOpen,
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
    title: "Class Completed",
    description: "Chemistry – Organic Reactions (Batch C)",
    time: "5 hrs ago",
    dotColor: "bg-primary-400",
  },
  {
    icon: Clock,
    iconBg: "bg-surface-muted",
    iconColor: "text-text-muted",
    title: "Timetable Updated",
    description: "Monday slot changed to 5:00 PM",
    time: "Yesterday",
    dotColor: "bg-text-muted",
  },
];

export default function ActivityFeed() {
  return (
    <div className="page-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Recent Activity</h2>
          <p className="text-xs text-text-muted mt-0.5">Latest updates from your dashboard</p>
        </div>
        <button className="text-xs text-primary-500 font-medium hover:text-primary-600 transition-colors">
          View All
        </button>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-surface-border" />

        <div className="space-y-1">
          {activities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <div key={i} className="relative flex items-start gap-3 pl-2 py-3 hover:bg-surface-muted/50 rounded-xl transition-colors duration-200 pr-2">
                {/* Dot on timeline */}
                <div className={clsx(
                  "absolute left-3.5 top-4.5 w-2 h-2 rounded-full border-2 border-white z-10 -translate-x-1/2",
                  activity.dotColor
                )} style={{ marginTop: "2px" }} />

                {/* Icon */}
                <div className={clsx(
                  "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ml-4",
                  activity.iconBg
                )}>
                  <Icon size={15} className={activity.iconColor} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary leading-tight">{activity.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{activity.description}</p>
                </div>

                {/* Time */}
                <span className="text-xs text-text-muted flex-shrink-0">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
