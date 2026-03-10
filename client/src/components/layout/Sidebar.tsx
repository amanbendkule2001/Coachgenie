"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  CreditCard,
  MessageSquare,
  CheckSquare,
  Palmtree,
  Award,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { label: "Dashboard",         href: "/dashboard/tutor",             icon: LayoutDashboard },
  { label: "Students",          href: "/dashboard/tutor/students",    icon: Users },
  { label: "Courses",           href: "/dashboard/tutor/courses",     icon: BookOpen },
  { label: "Timetable",         href: "/dashboard/tutor/timetable",   icon: Calendar },
  { label: "Tests & Marks",     href: "/dashboard/tutor/tests",       icon: ClipboardList },
  { label: "Materials",         href: "/dashboard/tutor/materials",   icon: FileText },
  { label: "Fees & Payments",   href: "/dashboard/tutor/fees",        icon: CreditCard },
  { label: "Enquiries",         href: "/dashboard/tutor/enquiries",   icon: MessageSquare },
  { label: "Todo Tasks",        href: "/dashboard/tutor/todo",        icon: CheckSquare },
  { label: "Activities",        href: "/dashboard/tutor/activities",  icon: Palmtree },
  { label: "Certificates",      href: "/dashboard/tutor/certificates",icon: Award },
  { label: "AI Analytics",      href: "/dashboard/tutor/analytics",   icon: BrainCircuit },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "relative flex flex-col h-screen bg-sidebar-bg shadow-sidebar transition-all duration-300 ease-in-out flex-shrink-0",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className={clsx(
        "flex items-center gap-3 px-4 py-5 border-b border-white/10",
        collapsed && "justify-center px-2"
      )}>
        <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
          <GraduationCap size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-base leading-tight">SmartEdu</p>
            <p className="text-sidebar-text text-xs">Tutor Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={clsx(
                "nav-item group",
                isActive ? "active" : "",
                collapsed && "justify-center px-2 py-3"
              )}
            >
              <Icon
                size={18}
                className={clsx(
                  "flex-shrink-0 transition-colors duration-200",
                  isActive ? "text-white" : "text-sidebar-text group-hover:text-white"
                )}
              />
              {!collapsed && (
                <span className={clsx(
                  "text-sm font-medium transition-colors duration-200",
                  isActive ? "text-white" : "text-sidebar-text group-hover:text-white"
                )}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="px-2 pb-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sidebar-text hover:bg-sidebar-hover hover:text-white transition-all duration-200 text-sm font-medium",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
