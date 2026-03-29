"use client";

import { useState, useEffect } from "react";
import { UserPlus, BookOpen, CreditCard, Clock, Upload } from "lucide-react";
import { getAll } from "@/lib/storage";
import clsx from "clsx";

interface FeedItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: React.ReactNode;
  bgClass: string;
  dateVal: number;
}

export default function ActivityFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [students, materials, fees, tests] = await Promise.all([
          getAll("students"),
          getAll("materials"),
          getAll("fees"),
          getAll("tests"),
        ]);

        const list: FeedItem[] = [];

        // Recent Students
        students.forEach((s: any) => {
          const date = s.enrolled_at ?? s.joinDate ?? s.created_at ?? "";
          list.push({
            id: `s-${s.id}`,
            title: "New Student Enrolled",
            desc: `${s.name} joined ${s.course ?? s.subject ?? ""}`,
            time: date,
            dateVal: date ? new Date(date).getTime() : 0,
            icon: <UserPlus size={16} />,
            bgClass: "bg-success-500/20 text-success-400",
          });
        });

        // Recent Materials
        materials.forEach((m: any) => {
          const date = m.created_at ?? m.uploadDate ?? "";
          list.push({
            id: `m-${m.id}`,
            title: "Material Uploaded",
            desc: `${m.title} added`,
            time: date?.split("T")[0] ?? date,
            dateVal: date ? new Date(date).getTime() : 0,
            icon: <Upload size={16} />,
            bgClass: "bg-purple-500/20 text-purple-400",
          });
        });

        // Recent Payments
        fees.filter((p: any) => p.status === "Paid").forEach((p: any) => {
          const date = p.paid_date ?? p.due_date ?? "";
          list.push({
            id: `p-${p.id}`,
            title: "Fee Paid",
            desc: `${p.student_name ?? `Student #${p.student}`} paid ₹${(p.amount ?? 0).toLocaleString("en-IN")}`,
            time: date,
            dateVal: date ? new Date(date).getTime() : 0,
            icon: <CreditCard size={16} />,
            bgClass: "bg-warning-500/20 text-warning-500",
          });
        });

        // Recent Tests
        tests.forEach((t: any) => {
          const date = t.date ?? t.created_at ?? "";
          list.push({
            id: `t-${t.id}`,
            title: "Test Scheduled",
            desc: `${t.title} — ${t.subject ?? ""}`,
            time: date,
            dateVal: date ? new Date(date).getTime() : 0,
            icon: <BookOpen size={16} />,
            bgClass: "bg-primary-500/20 text-primary-400",
          });
        });

        const sorted = list.sort((a, b) => b.dateVal - a.dateVal).slice(0, 6);
        setFeed(sorted);
      } catch {
        // Silently fail for feed — not critical
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page-card flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-text-primary">Recent Activity</h2>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
          <p className="text-sm text-text-muted animate-pulse">Loading activity…</p>
        </div>
      ) : feed.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <Clock size={32} className="text-surface-border mb-2" />
          <p className="text-sm font-semibold text-text-primary">No recent activity</p>
          <p className="text-xs text-text-muted mt-1">Actions will appear here</p>
        </div>
      ) : (
        <div className="relative pl-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-2 bottom-2 w-px bg-surface-border" />

          <div className="space-y-6 relative">
            {feed.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                {/* Icon wrapper */}
                <div className="relative z-10">
                  <div
                    className={clsx(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                      item.bgClass
                    )}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-text-primary leading-tight mb-0.5">
                    {item.title}
                  </p>
                  <p className="text-xs text-text-muted mb-1">{item.desc}</p>
                  <p className="text-[10px] font-medium text-text-secondary flex items-center gap-1">
                    <Clock size={10} /> {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
