"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import { loadFromStorage } from "@/lib/storage";
import { Payment, Test } from "@/types";
import clsx from "clsx";
import Link from "next/link";

interface AlertItem {
  id: string;
  title: string;
  desc: string;
  type: "danger" | "warning" | "success";
  link: string;
  time: string;
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    const payments = loadFromStorage<Payment[]>("payments", []);
    const tests = loadFromStorage<Test[]>("tests", []);
    const list: AlertItem[] = [];

    // 1. Overdue payments (Danger)
    const overdue = payments.filter((p) => p.status === "Overdue");
    overdue.forEach((p) => {
      list.push({
        id: `p-${p.id}`,
        title: "Overdue Fee",
        desc: `${p.studentName} has an overdue fee of ₹${(p.totalAmount - p.paidAmount).toLocaleString("en-IN")}`,
        type: "danger",
        link: "/dashboard/tutor/fees",
        time: p.dueDate,
      });
    });

    // 2. Upcoming Tests (Warning)
    const upcomingTests = tests.filter((t) => t.status === "Upcoming");
    upcomingTests.forEach((t) => {
      list.push({
        id: `t-${t.id}`,
        title: "Upcoming Test",
        desc: `${t.testName} for ${t.batch} is scheduled on ${t.date}`,
        type: "warning",
        link: "/dashboard/tutor/tests",
        time: t.date,
      });
    });

    setAlerts(list);
  }, []);

  if (alerts.length === 0) {
    return (
      <div className="page-card flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-text-primary">Alerts & Reminders</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
          <CheckCircle size={32} className="text-success-400 mb-2" />
          <p className="text-sm font-semibold text-text-primary">All caught up!</p>
          <p className="text-xs text-text-muted mt-1">No pending alerts at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-card flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          Alerts & Reminders
          <span className="bg-danger-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {alerts.length}
          </span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2 custom-scrollbar">
        {alerts.slice(0, 5).map((alert) => (
          <Link
            key={alert.id}
            href={alert.link}
            className={clsx(
              "block p-3 rounded-xl border-l-4 border border-surface-border bg-surface-muted transition-all hover:-translate-y-0.5 hover:shadow-sm",
              {
                "border-l-danger-500": alert.type === "danger",
                "border-l-warning-500": alert.type === "warning",
                "border-l-success-500": alert.type === "success",
              }
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className={clsx("flex items-center gap-2 font-semibold text-sm text-text-primary")}>
                <AlertCircle size={14} className={clsx({
                  "text-danger-500": alert.type === "danger",
                  "text-warning-500": alert.type === "warning",
                  "text-success-500": alert.type === "success",
                })} />
                {alert.title}
              </div>
              <span className="text-[10px] font-medium text-text-muted flex items-center gap-1 shrink-0">
                <Clock size={10} /> {alert.time}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{alert.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
