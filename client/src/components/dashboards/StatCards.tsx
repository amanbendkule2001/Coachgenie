"use client";

import { useState, useEffect } from "react";
import { Users, BookOpen, CalendarClock, IndianRupee } from "lucide-react";
import { loadFromStorage } from "@/lib/storage";
import { Student, Course, Payment, Activity } from "@/types";
import clsx from "clsx";

export default function StatCards() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    upcomingClasses: 0,
    pendingFees: 0,
    overdueStudents: 0,
  });

  useEffect(() => {
    const students   = loadFromStorage<Student[]>("students", []);
    const courses    = loadFromStorage<Course[]>("courses", []);
    const payments   = loadFromStorage<Payment[]>("payments", []);
    const activities = loadFromStorage<Activity[]>("activities", []);

    const todayStr = new Date().toISOString().split("T")[0];

    const totalStudents = students.length;
    const activeCourses = courses.filter((c) => c.status === "Active").length;
    const pendingFees   = payments
      .filter((p) => ["Pending", "Overdue", "Partial"].includes(p.status))
      .reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0);
    const overdueStudents = payments.filter((p) => p.status === "Overdue").length;

    // Upcoming classes are "Test", "Event", "Activity" scheduled today or later
    const upcomingClasses = activities.filter(
      (a) => ["Test", "Event", "Activity"].includes(a.type) && a.date >= todayStr
    ).length;

    setStats({ totalStudents, activeCourses, upcomingClasses, pendingFees, overdueStudents });
  }, []);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const cards = [
    {
      label: "Total Students",
      value: stats.totalStudents.toString(),
      subtext: "Enrolled",
      icon: Users,
      iconBg: "bg-primary-50",
      iconColor: "text-primary-500",
      borderColor: "border-l-primary-500",
    },
    {
      label: "Active Courses",
      value: stats.activeCourses.toString(),
      subtext: "Running batches",
      icon: BookOpen,
      iconBg: "bg-success-50",
      iconColor: "text-success-600",
      borderColor: "border-l-success-500",
    },
    {
      label: "Upcoming Events",
      value: stats.upcomingClasses.toString(),
      subtext: "Tests & Activities",
      icon: CalendarClock,
      iconBg: "bg-warning-50",
      iconColor: "text-warning-600",
      borderColor: "border-l-warning-500",
    },
    {
      label: "Pending Fees",
      value: fmt(stats.pendingFees),
      subtext: `${stats.overdueStudents} students overdue`,
      icon: IndianRupee,
      iconBg: "bg-danger-50",
      iconColor: "text-danger-500",
      borderColor: "border-l-danger-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-fade-in">
      {cards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className={clsx("stat-card border-l-4", stat.borderColor)}>
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
