"use client";

import { useState, useEffect } from "react";
import { Users, BookOpen, CalendarClock, IndianRupee } from "lucide-react";
import clsx from "clsx";

const BASE_URL = "http://localhost:8000/api";

function authHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

interface DashboardStats {
    total_students: number;
    total_courses: number;
    upcoming_events: number;
    pending_fees: number;
    revenue_collected: number;
    pending_todos: number;
}

export default function StatCards() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    // ── Fetch from analytics endpoint ─────────────────────────────────────────
    useEffect(() => {
        fetch(`${BASE_URL}/analytics/dashboard/`, { headers: authHeaders() })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch stats");
                return res.json();
            })
            .then((data: DashboardStats) => setStats(data))
            .catch((err) => console.error("StatCards error:", err))
            .finally(() => setLoading(false));
    }, []);

    const fmt = (n: number) =>
        `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

    const cards = [
        {
            label: "Total Students",
            value: stats ? stats.total_students.toString() : "—",
            subtext: "Enrolled & active",
            icon: Users,
            iconBg: "bg-primary-500/20",
            iconColor: "text-primary-400",
            borderColor: "border-l-primary-500",
        },
        {
            label: "Active Courses",
            value: stats ? stats.total_courses.toString() : "—",
            subtext: "Running batches",
            icon: BookOpen,
            iconBg: "bg-success-500/20",
            iconColor: "text-success-400",
            borderColor: "border-l-success-500",
        },
        {
            label: "Upcoming Events",
            value: stats ? stats.upcoming_events.toString() : "—",
            subtext: "Tests & activities",
            icon: CalendarClock,
            iconBg: "bg-warning-500/20",
            iconColor: "text-warning-500",
            borderColor: "border-l-warning-500",
        },
        {
            label: "Pending Fees",
            value: stats ? fmt(stats.pending_fees) : "—",
            subtext: stats ? `₹${stats.revenue_collected.toLocaleString("en-IN", { maximumFractionDigits: 0 })} collected` : "Loading…",
            icon: IndianRupee,
            iconBg: "bg-danger-500/20",
            iconColor: "text-danger-400",
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
                            <p className={clsx(
                                "text-2xl font-bold text-text-primary leading-tight transition-all",
                                loading && "animate-pulse opacity-40"
                            )}>
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
