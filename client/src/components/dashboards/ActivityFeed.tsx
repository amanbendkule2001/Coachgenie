"use client";

import { useState, useEffect } from "react";
import { UserPlus, BookOpen, CreditCard, Clock, FileText, Upload } from "lucide-react";
import { loadFromStorage } from "@/lib/storage";
import { Student, Course, Payment, Material } from "@/types";
import clsx from "clsx";

interface FeedItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: React.ReactNode;
  bgClass: string;
  dateVal: number; // for sorting
}

export default function ActivityFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => {
    const students  = loadFromStorage<Student[]>("students", []);
    const courses   = loadFromStorage<Course[]>("courses", []);
    const payments  = loadFromStorage<Payment[]>("payments", []);
    const materials = loadFromStorage<Material[]>("materials", []);

    const list: FeedItem[] = [];

    // Recent Students
    students.forEach(s => list.push({
      id: `s-${s.id}`,
      title: "New Student Enrolled",
      desc: `${s.name} joined ${s.course}`,
      time: s.joinDate,
      dateVal: new Date(s.joinDate).getTime(),
      icon: <UserPlus size={16} />,
      bgClass: "bg-success-100 text-success-600",
    }));

    // Recent Courses
    courses.forEach(c => list.push({
      id: `c-${c.id}`,
      title: "Course Created",
      desc: `${c.title} (${c.batch}) started`,
      time: c.startDate,
      dateVal: new Date(c.startDate).getTime(),
      icon: <BookOpen size={16} />,
      bgClass: "bg-primary-100 text-primary-600",
    }));

    // Recent Completed Payments
    payments.filter(p => p.status === "Paid").forEach(p => list.push({
      id: `p-${p.id}`,
      title: "Fee Paid",
      desc: `${p.studentName} paid ₹${p.paidAmount.toLocaleString("en-IN")}`,
      time: p.lastPaidDate !== "—" ? p.lastPaidDate : p.dueDate,
      dateVal: new Date(p.lastPaidDate !== "—" ? p.lastPaidDate : p.dueDate).getTime(),
      icon: <CreditCard size={16} />,
      bgClass: "bg-warning-100 text-warning-600",
    }));

    // Recent Materials
    materials.forEach(m => list.push({
      id: `m-${m.id}`,
      title: "Material Uploaded",
      desc: `${m.title} added to ${m.courseName}`,
      time: m.uploadDate,
      dateVal: new Date(m.uploadDate).getTime(),
      icon: <Upload size={16} />,
      bgClass: "bg-purple-100 text-purple-600",
    }));

    // Sort descending by date, take top 6
    const sorted = list.sort((a,b) => b.dateVal - a.dateVal).slice(0, 6);
    setFeed(sorted);
  }, []);

  return (
    <div className="page-card h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-text-primary">Recent Activity</h2>
      </div>

      {feed.length === 0 ? (
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
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border-[3px] border-white transition-transform group-hover:scale-110",
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
