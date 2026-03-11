# Tutor Dashboard UI — Complete Development Log

> **Project:** SmartEdu — Edu-Tech Platform  
> **Repository:** [Edu-Tech-Platform-SmartEdu](https://github.com/Lokesh-Sohanda8/Edu-Tech-Platform-SmartEdu)  
> **Author:** Antigravity AI (Pair Programming Assistant)  
> **Date:** March 10–11, 2026  
> **Document Type:** Technical Development Log + Architecture Documentation

---

## Table of Contents

1. [Project Context](#1-project-context)
2. [Development Environment](#2-development-environment)
3. [Initial Folder Structure](#3-initial-folder-structure)
4. [UI Architecture Design](#4-ui-architecture-design)
5. [Component Creation](#5-component-creation)
6. [Pages Created](#6-pages-created)
7. [Routing System](#7-routing-system)
8. [UI Design System](#8-ui-design-system)
9. [Errors Encountered During Development](#9-errors-encountered-during-development)
10. [Git Operations Performed](#10-git-operations-performed)
11. [Final Folder Structure](#11-final-folder-structure)
12. [UI Screens Overview](#12-ui-screens-overview)
13. [Future Improvements](#13-future-improvements)

---

## 1. Project Context

### 1.1 About SmartEdu

SmartEdu is a comprehensive **EdTech Tutoring Management Platform** built to help private tutors and coaching centers manage every aspect of their tutoring business — students, courses, schedules, tests, fees, certificates, analytics, and communication.

The platform is a **full-stack SaaS application** organized into clearly separated concerns:

| Layer | Technology | Location |
|---|---|---|
| Frontend (Client) | Next.js 14, Tailwind CSS | `client/` |
| Backend (Server) | Node.js + Express | `server/` |
| Database | PostgreSQL | `PostgreSQL-DB/` |
| Shared Types | TypeScript interfaces | `shared/` |
| Infrastructure | Docker | `docker/` |

### 1.2 Purpose of the Tutor Dashboard

The **Tutor Dashboard** is the primary interface that tutors interact with daily. It gives them a centralized workspace to:

- Monitor student progress and attendance
- Manage course schedules and timetables
- Record and analyze test marks
- Track fee payment status
- Upload and share study materials
- Manage enquiries and follow-ups with prospective students
- Review AI-powered performance predictions
- Issue completion certificates

The dashboard is designed to feel like a **premium SaaS product** — clean, calm, and productivity-oriented — taking inspiration from tools like Notion, Linear, and Stripe.

### 1.3 Role of Tutors in the Platform

Tutors are the **primary users** of the SmartEdu platform. The user roles in the system are:

```
Users
├── Admin       → Platform owner/manager
├── Tutor       → Course creator, student manager (PRIMARY ROLE)
├── Teacher     → Employed teachers under admin
└── Student     → Learners enrolled in courses
```

Each role has its own dashboard under `/dashboard/{role}`. The Tutor Dashboard lives at `/dashboard/tutor`.

### 1.4 System Architecture Fit

The Tutor Dashboard is the **frontend module** within the client application:

```
SmartEdu Platform
│
├── client/                        ← Next.js 14 Frontend (THIS MODULE)
│   └── dashboard/tutor/           ← Tutor Dashboard (BUILT IN THIS LOG)
│
├── server/                        ← Express REST API
│   └── routes/tutor/              ← Tutor-specific API endpoints
│
└── PostgreSQL-DB/                 ← Tutor, Student, Course, Fee tables
```

The frontend communicates with the backend via REST APIs defined in `client/src/app/api's/`. The Tutor Dashboard is a **read + write** interface connected to these APIs.

---

## 2. Development Environment

### 2.1 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14.2.28 | App framework (App Router) |
| **React** | 18 | UI rendering |
| **TypeScript** | 5.x | Type-safe development |
| **Tailwind CSS** | 3.4.1 | Utility-first styling |
| **Lucide React** | 0.460.0 | Icon library |
| **clsx** | 2.1.1 | Conditional className utility |
| **PostCSS** | 8.x | CSS processing |
| **Autoprefixer** | 10.x | CSS vendor prefixing |
| **ESLint** | 8.x | Code linting |

### 2.2 Frameworks and Libraries

#### Next.js App Router
Next.js 14's **App Router** was chosen over the Pages Router because:
- File-based routing maps directly to dashboard sections
- `layout.tsx` enables shared sidebar + header across all pages without re-rendering
- Server components reduce client-side bundle size
- Native TypeScript support with zero configuration

#### Tailwind CSS
Tailwind was configured with a **custom design system** that matches the SmartEdu brand:
- Custom color scale for `primary`, `success`, `warning`, `danger`
- Custom `sidebar` color group for the dark navy navigation
- Custom `surface` colors for backgrounds and cards
- Custom shadow tokens (`card`, `card-hover`, `sidebar`, `header`)
- Custom animations (`fade-in`, `slide-in`, `pulse-soft`)

#### Lucide React
A lightweight, tree-shakable icon library providing clean SVG icons for every navigation item and UI widget.

#### clsx
Used for conditional class composition (e.g., toggling `active` states on sidebar items, collapsed/expanded sidebar modes).

### 2.3 Frontend Architecture

The Tutor Dashboard follows **Next.js App Router conventions**:

```
Rendering Strategy:
├── Server Components (default)   → All page content (static/data)
└── Client Components ("use client") → Interactive widgets only
    ├── Sidebar.tsx               → Collapse toggle, active link tracking
    ├── TopHeader.tsx             → Profile dropdown toggle
    ├── CalendarWidget.tsx        → Month navigation, day selection
    └── TodoPage                  → Live task add/complete/delete
```

### 2.4 Folder Structure Philosophy

The project follows the **Feature-Colocation** pattern:
- All `page.tsx` files live inside `app/dashboard/tutor/{feature}/`
- Reusable UI components live in `components/dashboards/` and `components/layout/`
- Global styles are in `styles/globals.css`
- Types will eventually live in `types/`

---

## 3. Initial Folder Structure

When development began, the `client/` directory was a **skeleton** — empty files with `.gitkeep` placeholders. There was no `package.json`, no Tailwind config, and all source files were empty.

### 3.1 State Before Development

```
client/
├── public/
└── src/
    ├── app/
    │   ├── api's/        (empty)
    │   ├── dashboard/
    │   │   ├── admin/    (empty)
    │   │   ├── student/  (empty)
    │   │   ├── teacher/  (empty)
    │   │   └── tutor/    (empty - .gitkeep)
    │   ├── loggers/      (empty)
    │   ├── login/        (empty)
    │   ├── register/     (empty)
    │   ├── layout.tsx    (EMPTY FILE)
    │   └── page.tsx      (EMPTY FILE)
    ├── components/
    │   ├── dashboards/   (.gitkeep)
    │   ├── forms/        (empty)
    │   ├── layout/       (.gitkeep)
    │   └── ui/           (empty)
    ├── features/         (empty)
    ├── hooks/            (empty)
    ├── lib/              (empty)
    ├── store/            (empty)
    ├── styles/           (.gitkeep)
    └── types/            (empty)
```

No `package.json`, `tsconfig.json`, `tailwind.config.ts`, or `next.config.js` existed in `client/`.

---

## 4. UI Architecture Design

### 4.1 Layout Shell

The dashboard uses a **3-part layout** shared across all pages:

```
┌─────────────────────────────────────────────────────┐
│  SIDEBAR (fixed, collapsible)  │  TOP HEADER        │
│  ─────────────────────────────│────────────────────│
│                                │                    │
│  Logo: SmartEdu                │  Welcome, Mr.Sharma│
│  ─────────────────────────────│  🔍 Search         │
│  › Dashboard (active)          │  🔔 Bell  👤 Avatar│
│  › Students                    │                    │
│  › Courses                     ├────────────────────│
│  › Timetable                   │                    │
│  › Tests & Marks               │  MAIN CONTENT AREA │
│  › Materials                   │  (scrollable)      │
│  › Fees & Payments             │                    │
│  › Enquiries                   │  [page.tsx renders │
│  › Todo Tasks                  │   here]            │
│  › Activities                  │                    │
│  › Certificates                │                    │
│  › AI Analytics                │                    │
│  ─────────────────────────────│                    │
│  [← Collapse]                  │                    │
└─────────────────────────────────────────────────────┘
```

### 4.2 Dashboard Main Page Widget Grid

```
┌──────────┬──────────┬──────────┬──────────┐
│ Students │ Courses  │ Classes  │  Fees    │
│   120    │    5     │ 3 Today  │ ₹15,000  │
└──────────┴──────────┴──────────┴──────────┘

┌──────────────────────┬─────────────────────┐
│   ALERTS PANEL       │   CALENDAR WIDGET   │
│ • Test Tomorrow      │  March 2026         │
│ • Fee Overdue        │  [interactive grid] │
│ • Follow-Up Reminder │  ● Class  ✦ Test   │
│ • Parent Meeting     │                     │
├──────────────────────┼─────────────────────┤
│   ACTIVITY FEED      │   AI INSIGHTS       │
│ ▸ New Enrollment     │  At Risk: 8         │
│ ▸ Payment Received   │  Avg Score: 72%     │
│ ▸ Material Uploaded  │  Top: Ravi Sharma   │
│ ▸ Test Marked        │  ─────────────────  │
│ ▸ Class Completed    │  Progress: 68%      │
└──────────────────────┴─────────────────────┘
```

### 4.3 Sidebar States

The sidebar has two modes:

**Expanded (default, `w-[240px]`)**
```
┌──────────────────────┐
│ 🎓 SmartEdu          │
│    Tutor Portal      │
├──────────────────────┤
│ ⬛ Dashboard         │ ← active (primary blue BG)
│ 👤 Students          │
│ 📚 Courses           │
│ 📅 Timetable         │
│ ...                  │
└──────────────────────┘
│ ← Collapse           │
└──────────────────────┘
```

**Collapsed (`w-[72px]`, icon-only)**
```
┌────┐
│ 🎓 │
├────┤
│ ⬛ │ ← active
│ 👤 │
│ 📚 │
│ ...│
├────┤
│  → │
└────┘
```

---

## 5. Component Creation

### 5.1 Configuration Files

#### `package.json`
**Location:** `client/package.json`  
**Purpose:** Defines the Next.js 14 project with all required dependencies.

```json
{
  "name": "smartedu-client",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.28",
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.460.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.28"
  }
}
```

#### `tailwind.config.ts`
**Location:** `client/tailwind.config.ts`  
**Purpose:** Extends Tailwind with the full SmartEdu color palette, shadows, and animations.

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F6EF7",
          50: "#EEF1FE", 100: "#D9DFFD", 200: "#B3BFFB",
          300: "#8D9FF9", 400: "#677FF8", 500: "#4F6EF7",
          600: "#2147F4", 700: "#0B2FD9", 800: "#0923A6", 900: "#071873",
        },
        success: { DEFAULT: "#22C55E", 50: "#F0FDF4", 100: "#DCFCE7", 500: "#22C55E", 600: "#16A34A" },
        warning: { DEFAULT: "#F97316", 50: "#FFF7ED", 100: "#FFEDD5", 500: "#F97316", 600: "#EA580C" },
        danger:  { DEFAULT: "#EF4444", 50: "#FEF2F2", 100: "#FEE2E2", 500: "#EF4444", 600: "#DC2626" },
        surface: { DEFAULT: "#F8F9FC", card: "#FFFFFF", muted: "#F1F3F9", border: "#E4E7F0" },
        text:    { primary: "#111827", secondary: "#6B7280", muted: "#9CA3AF" },
        sidebar: { bg: "#0F172A", hover: "#1E293B", active: "#4F6EF7", text: "#94A3B8", activeText: "#FFFFFF" },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
        sidebar: "4px 0 24px rgba(0,0,0,0.12)",
        header: "0 1px 4px rgba(0,0,0,0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.25s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:    { "0%": { opacity: "0", transform: "translateY(4px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideIn:   { "0%": { opacity: "0", transform: "translateX(-8px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        pulseSoft: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.7" } },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### 5.2 Layout Components

#### Sidebar Component

**Location:** `client/src/components/layout/Sidebar.tsx`  
**Purpose:** Collapsible left navigation with 12 menu items, active-state highlighting, icon-only collapsed mode, and SmartEdu branding.

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, BookOpen, Calendar, ClipboardList,
  FileText, CreditCard, MessageSquare, CheckSquare, Palmtree,
  Award, BrainCircuit, ChevronLeft, ChevronRight, GraduationCap,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { label: "Dashboard",       href: "/dashboard/tutor",               icon: LayoutDashboard },
  { label: "Students",        href: "/dashboard/tutor/students",      icon: Users },
  { label: "Courses",         href: "/dashboard/tutor/courses",       icon: BookOpen },
  { label: "Timetable",       href: "/dashboard/tutor/timetable",     icon: Calendar },
  { label: "Tests & Marks",   href: "/dashboard/tutor/tests",         icon: ClipboardList },
  { label: "Materials",       href: "/dashboard/tutor/materials",     icon: FileText },
  { label: "Fees & Payments", href: "/dashboard/tutor/fees",          icon: CreditCard },
  { label: "Enquiries",       href: "/dashboard/tutor/enquiries",     icon: MessageSquare },
  { label: "Todo Tasks",      href: "/dashboard/tutor/todo",          icon: CheckSquare },
  { label: "Activities",      href: "/dashboard/tutor/activities",    icon: Palmtree },
  { label: "Certificates",    href: "/dashboard/tutor/certificates",  icon: Award },
  { label: "AI Analytics",    href: "/dashboard/tutor/analytics",     icon: BrainCircuit },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={clsx(
      "relative flex flex-col h-screen bg-sidebar-bg shadow-sidebar transition-all duration-300 ease-in-out flex-shrink-0",
      collapsed ? "w-[72px]" : "w-[240px]"
    )}>
      {/* Logo */}
      <div className={clsx("flex items-center gap-3 px-4 py-5 border-b border-white/10", collapsed && "justify-center px-2")}>
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
            <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
              className={clsx("nav-item group", isActive ? "active" : "", collapsed && "justify-center px-2 py-3")}>
              <Icon size={18} className={clsx("flex-shrink-0", isActive ? "text-white" : "text-sidebar-text group-hover:text-white")} />
              {!collapsed && (
                <span className={clsx("text-sm font-medium", isActive ? "text-white" : "text-sidebar-text group-hover:text-white")}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="px-2 pb-4">
        <button onClick={() => setCollapsed(!collapsed)}
          className={clsx("w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sidebar-text hover:bg-sidebar-hover hover:text-white transition-all duration-200 text-sm font-medium", collapsed && "justify-center")}>
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
```

---

#### TopHeader Component

**Location:** `client/src/components/layout/TopHeader.tsx`  
**Purpose:** Top navigation bar with tutor welcome message, global search, notification bell, settings icon, and profile avatar dropdown.

```tsx
"use client";

import { Bell, Settings, LogOut, Search, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function TopHeader({ tutorName = "Mr. Sharma" }: { tutorName?: string }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-surface-border shadow-header flex items-center justify-between px-6 flex-shrink-0 z-10">
      {/* Welcome */}
      <div className="flex flex-col">
        <p className="text-xs text-text-muted font-medium">Good evening 👋</p>
        <h1 className="text-base font-semibold text-text-primary">
          Welcome, <span className="text-primary-500">{tutorName}</span>
        </h1>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-surface-muted border border-surface-border rounded-xl px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-primary-300 transition-all">
        <Search size={15} className="text-text-muted flex-shrink-0" />
        <input type="text" placeholder="Search students, courses..."
          className="bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none w-full" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-muted transition-colors group">
          <Bell size={18} className="text-text-secondary group-hover:text-primary-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white animate-pulse-soft" />
        </button>

        {/* Settings */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-muted transition-colors group">
          <Settings size={18} className="text-text-secondary group-hover:text-primary-500" />
        </button>

        <div className="w-px h-6 bg-surface-border mx-1" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-surface-muted transition-colors">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">MS</span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-text-primary leading-tight">{tutorName}</p>
              <p className="text-xs text-text-muted leading-tight">Tutor</p>
            </div>
            <ChevronDown size={14} className="text-text-muted hidden lg:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-card-hover border border-surface-border overflow-hidden animate-fade-in z-50">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-surface-muted">
                <Settings size={15} className="text-text-muted" /> Settings
              </button>
              <div className="border-t border-surface-border" />
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger-600 hover:bg-danger-50">
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
```

---

#### DashboardLayout Component

**Location:** `client/src/components/layout/DashboardLayout.tsx`  
**Purpose:** Shell wrapper that composes `Sidebar` + `TopHeader` + main scrollable content slot. Used by all tutor dashboard pages via `layout.tsx`.

```tsx
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

### 5.3 Dashboard Widget Components

#### StatCards

**Location:** `client/src/components/dashboards/StatCards.tsx`  
**Purpose:** 4 quick-stat cards displayed at the top of the main dashboard — Total Students, Active Courses, Upcoming Classes, and Pending Fees. Each card has a colored left border, icon, primary value, and subtext.

```tsx
import { Users, BookOpen, CalendarClock, IndianRupee } from "lucide-react";
import clsx from "clsx";

const stats = [
  { label: "Total Students",    value: "120",      subtext: "+8 this month",     icon: Users,         iconBg: "bg-primary-50", iconColor: "text-primary-500", borderColor: "border-l-primary-500" },
  { label: "Active Courses",    value: "5",        subtext: "2 starting soon",   icon: BookOpen,      iconBg: "bg-success-50", iconColor: "text-success-600", borderColor: "border-l-success-500" },
  { label: "Upcoming Classes",  value: "3 Today",  subtext: "Next: 4:00 PM",     icon: CalendarClock, iconBg: "bg-warning-50", iconColor: "text-warning-600", borderColor: "border-l-warning-500" },
  { label: "Pending Fees",      value: "₹15,000",  subtext: "4 students overdue",icon: IndianRupee,   iconBg: "bg-danger-50",  iconColor: "text-danger-500",  borderColor: "border-l-danger-500"  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className={clsx("stat-card border-l-4", stat.borderColor)}>
            <div className={clsx("stat-icon-box", stat.iconBg)}>
              <Icon size={22} className={stat.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary leading-tight">{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

#### CalendarWidget

**Location:** `client/src/components/dashboards/CalendarWidget.tsx`  
**Purpose:** Interactive monthly calendar with event dot markers (class, test, holiday), today highlighting, selected day highlighting, and previous/next month navigation.

Key features:
- Dynamically calculates days-in-month and first-weekday-offset
- Stores events as a typed dictionary keyed by day number
- Shows color-coded dot legend at the bottom

---

#### AlertsPanel

**Location:** `client/src/components/dashboards/AlertsPanel.tsx`  
**Purpose:** Stack of 4 color-coded alert cards — warning (test), danger (fee overdue), info (follow-up), warning (meeting). Each card has a colored background, border, icon, title, detail text, and time label.

---

#### AIInsightsPanel

**Location:** `client/src/components/dashboards/AIInsightsPanel.tsx`  
**Purpose:** Displays 3 AI-generated insight metrics (at-risk students, average predicted score, top performer) plus an overall class progress bar. Styled with a gradient BrainCircuit icon to signal AI-powered content.

---

#### ActivityFeed

**Location:** `client/src/components/dashboards/ActivityFeed.tsx`  
**Purpose:** Vertical timeline of 6 recent platform activities — enrollment, payment, material upload, test marking, class completion, timetable update. Each item has an icon, title, description, and relative timestamp.

---

## 6. Pages Created

### 6.1 Root Page

**Path:** `client/src/app/page.tsx`  
**Description:** Immediately redirects the user to the tutor dashboard.

```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/tutor");
}
```

---

### 6.2 Root Layout

**Path:** `client/src/app/layout.tsx`  
**Description:** Root HTML wrapper, imports global CSS, sets page metadata.

```tsx
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "SmartEdu – Tutor Dashboard",
  description: "Professional EdTech tutoring management platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

---

### 6.3 Tutor Dashboard Layout

**Path:** `client/src/app/dashboard/tutor/layout.tsx`  
**Description:** Route segment layout that wraps all tutor pages with `DashboardLayout` (sidebar + header).

```tsx
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TutorDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

---

### 6.4 Dashboard Home

**Path:** `client/src/app/dashboard/tutor/page.tsx`  
**Description:** Main dashboard view assembling all 5 widgets in a responsive grid.

```tsx
import StatCards from "@/components/dashboards/StatCards";
import CalendarWidget from "@/components/dashboards/CalendarWidget";
import AlertsPanel from "@/components/dashboards/AlertsPanel";
import AIInsightsPanel from "@/components/dashboards/AIInsightsPanel";
import ActivityFeed from "@/components/dashboards/ActivityFeed";

export default function TutorDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Dashboard Overview</h1>
        <p className="text-sm text-text-muted mt-0.5">Tuesday, March 10, 2026</p>
      </div>
      <StatCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AlertsPanel />
          <ActivityFeed />
        </div>
        <div className="space-y-6">
          <CalendarWidget />
          <AIInsightsPanel />
        </div>
      </div>
    </div>
  );
}
```

---

### 6.5 All Section Pages

| # | Route | Page File | Description |
|---|---|---|---|
| 1 | `/dashboard/tutor/students` | `students/page.tsx` | Searchable student table with fee/status badges and pagination |
| 2 | `/dashboard/tutor/courses` | `courses/page.tsx` | Course cards with gradient headers, progress bars, student counts |
| 3 | `/dashboard/tutor/timetable` | `timetable/page.tsx` | Weekly schedule grid, color-coded by subject/batch |
| 4 | `/dashboard/tutor/tests` | `tests/page.tsx` | Test list with averages + live mark-entry form for students |
| 5 | `/dashboard/tutor/materials` | `materials/page.tsx` | Drag-drop upload zone + file list with view/download/delete |
| 6 | `/dashboard/tutor/fees` | `fees/page.tsx` | Summary stat cards + full payment table with balances |
| 7 | `/dashboard/tutor/enquiries` | `enquiries/page.tsx` | Lead CRM with stage counters (New/Follow-Up/Enrolled/Cold) |
| 8 | `/dashboard/tutor/todo` | `todo/page.tsx` | Interactive task checklist — live add/check/delete with priority |
| 9 | `/dashboard/tutor/activities` | `activities/page.tsx` | Color-coded holiday/activity/test event cards |
| 10 | `/dashboard/tutor/certificates` | `certificates/page.tsx` | Certificate issuing with gold gradient and grade badges |
| 11 | `/dashboard/tutor/analytics` | `analytics/page.tsx` | AI prediction table with trend arrows + horizontal score bar chart |

---

## 7. Routing System

### 7.1 Next.js App Router (Folder-Based Routing)

Next.js 14 App Router uses the **filesystem as the router**. Each folder inside `app/` maps to a URL segment.

```
app/
├── page.tsx                          →  /               (redirects to /dashboard/tutor)
├── layout.tsx                        →  root layout (HTML shell)
└── dashboard/
    └── tutor/
        ├── layout.tsx                →  /dashboard/tutor  (layout: sidebar + header)
        ├── page.tsx                  →  /dashboard/tutor
        ├── students/page.tsx         →  /dashboard/tutor/students
        ├── courses/page.tsx          →  /dashboard/tutor/courses
        ├── timetable/page.tsx        →  /dashboard/tutor/timetable
        ├── tests/page.tsx            →  /dashboard/tutor/tests
        ├── materials/page.tsx        →  /dashboard/tutor/materials
        ├── fees/page.tsx             →  /dashboard/tutor/fees
        ├── enquiries/page.tsx        →  /dashboard/tutor/enquiries
        ├── todo/page.tsx             →  /dashboard/tutor/todo
        ├── activities/page.tsx       →  /dashboard/tutor/activities
        ├── certificates/page.tsx     →  /dashboard/tutor/certificates
        └── analytics/page.tsx        →  /dashboard/tutor/analytics
```

### 7.2 layout.tsx — Shared Layout Without Re-Rendering

The key advantage of the App Router's `layout.tsx` convention is that the `Sidebar` and `TopHeader` are **rendered once and persisted** across all page navigations inside the tutor dashboard. Only the `{children}` slot re-renders when the route changes — making navigation feel instantaneous.

```
GET /dashboard/tutor          → layout.tsx wraps page.tsx
GET /dashboard/tutor/students → same layout, new page.tsx children
```

### 7.3 Active Link Detection

The sidebar uses `usePathname()` from `next/navigation` to detect the current route and apply the `.active` CSS class:

```tsx
const pathname = usePathname();
const isActive = pathname === item.href;
```

### 7.4 Client vs Server Components

| File | Type | Reason |
|---|---|---|
| `page.tsx` (all pages) | Server | No interactivity needed — data display |
| `layout.tsx` | Server | Static shell |
| `Sidebar.tsx` | **Client** | `useState` for collapse toggle; `usePathname` for active detection |
| `TopHeader.tsx` | **Client** | `useState` for profile dropdown |
| `CalendarWidget.tsx` | **Client** | `useState` for month navigation and day selection |
| `todo/page.tsx` | **Client** | Live add/check/delete task interactions |

---

## 8. UI Design System

### 8.1 Color Palette

The SmartEdu color system is built on a **cool blue primary** with semantic accent colors:

| Token | Hex | Usage |
|---|---|---|
| `primary-500` | `#4F6EF7` | Buttons, active states, links, icons |
| `success-500` | `#22C55E` | Paid status, enrolled, completed |
| `warning-500` | `#F97316` | Upcoming, partial, alerts |
| `danger-500` | `#EF4444` | Overdue fees, at-risk students |
| `sidebar-bg` | `#0F172A` | Sidebar background (dark navy) |
| `surface` | `#F8F9FC` | Page background (soft cool gray) |
| `surface-card` | `#FFFFFF` | Card backgrounds |
| `surface-border` | `#E4E7F0` | Borders, dividers |
| `text-primary` | `#111827` | Main text |
| `text-muted` | `#9CA3AF` | Labels, subtitles |

### 8.2 Typography

Font: **Inter** (Google Fonts) — loaded via CSS `@import`.

| Scale | Class | Usage |
|---|---|---|
| `text-xs` | 12px | Labels, badges, timestamps |
| `text-sm` | 14px | Body text, table rows |
| `text-base` | 16px | Card titles, headers |
| `text-xl` | 20px | Page titles (h1) |
| `text-2xl` | 24px | Stat card numbers |

### 8.3 Spacing System

All spacing uses Tailwind's default 4px grid scale. Key spacing patterns:
- **Cards:** `p-5` (20px) or `p-6` (24px)
- **Grid gaps:** `gap-4` (16px) or `gap-6` (24px)
- **Sections:** `space-y-6` (24px vertical rhythm)
- **Sidebar nav items:** `px-3 py-2.5` (12px / 10px)

### 8.4 Reusable Component Classes (globals.css)

Custom `@layer components` block defines reusable class names:

```css
@layer components {
  .stat-card     { @apply bg-white rounded-2xl p-5 shadow-card border border-surface-border flex items-start gap-4 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5; }
  .stat-icon-box { @apply w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0; }
  .alert-card    { @apply flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-sm; }
  .nav-item      { @apply flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-sidebar-text font-medium text-sm; }
  .nav-item.active { @apply bg-primary-500 text-white shadow-md; }
  .page-card     { @apply bg-white rounded-2xl shadow-card border border-surface-border p-6 animate-fade-in; }
  .table-header  { @apply text-xs font-semibold text-text-secondary uppercase tracking-wider px-4 py-3 bg-surface-muted; }
  .table-cell    { @apply px-4 py-3 text-sm text-text-primary border-b border-surface-border; }
  .badge         { @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium; }
  .btn-primary   { @apply bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors duration-200 flex items-center gap-2; }
  .input-field   { @apply w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all; }
}
```

### 8.5 Animations

Three custom animations are defined:

| Animation | Effect | Used In |
|---|---|---|
| `animate-fade-in` | Fade + rise 4px on mount | All pages, dropdown menus |
| `animate-slide-in` | Fade + slide 8px from left | — |
| `animate-pulse-soft` | Soft opacity pulse | Notification bell badge |

### 8.6 Card Design Patterns

All cards use the `.page-card` class with these consistent properties:
- `bg-white` background
- `rounded-2xl` (16px border radius)
- `shadow-card` (subtle 1-3px shadow)
- `border border-surface-border` (1px cool gray border)
- `p-6` (24px padding)
- `animate-fade-in` on page load

Stat cards additionally use a **4px colored left border** to indicate category (primary/success/warning/danger).

---

## 9. Errors Encountered During Development

### Error 1: `next.config.ts` Not Supported

**Error Message:**
```
Error: Configuring Next.js via 'next.config.ts' is not supported.
Please replace the file with 'next.config.js' or 'next.config.mjs'.
```

**When It Occurred:**  
Running `npm run dev` after `npm install` completed.

**Cause:**  
The initial config file was created as `next.config.ts` (TypeScript). Next.js version **14.2.28** does **not** support TypeScript config files — support for `next.config.ts` was only added in Next.js 15.

**Diagnosis:**  
The error was thrown at server startup inside `node_modules/next/dist/server/config.js` at the `loadConfig` function.

**Fix:**  
1. Created a new `next.config.js` with CommonJS `module.exports` syntax:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
```
2. Deleted `next.config.ts`
3. Re-ran `npm run dev` — server started successfully

---

### Error 2: GitHub Push Rejected — 100MB File Size Limit

**Error Message:**
```
remote: error: File client/node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node is 129.57 MB;
this exceeds GitHub's file size limit of 100.00 MB
remote: error: GH001: Large files detected.
! [remote rejected] main -> main (pre-receive hook declined)
```

**When It Occurred:**  
First `git push origin main` attempt.

**Cause:**  
The `.gitignore` was created **after** `git add -A` was run. This caused `node_modules/` to be staged and committed, including the `@next/swc-win32-x64-msvc` binary which is 129.57 MB.

**Diagnosis:**  
GitHub's pre-receive hook detected a file exceeding the 100 MB single-file limit and rejected the entire push.

**Fix:**  
1. Created `.gitignore` at the project root with `node_modules/` as the first entry
2. Ran `git rm -r --cached client/node_modules/` to remove `node_modules` from the git index without deleting from disk
3. Ran `git commit --amend --no-edit` to rewrite the commit without `node_modules`
4. Ran `git push origin main --force-with-lease` to push the corrected commit

---

### Error 3: Push Going to Wrong Repository

**Error Message:**  
*(No error — push silently succeeded but to the wrong GitHub repo)*

**When It Occurred:**  
After fixing the large file error and successfully pushing.

**Cause:**  
The original `[remote "origin"]` URL in `.git/config` was:
```
https://github.com/Lokesh-Sohanda8/Smart-Edu-Knowletive-Project.git
```
This was a different repository — not the intended `Edu-Tech-Platform-SmartEdu`.

**Diagnosis:**  
User reported the commit went to a new/wrong repository. Confirmed by reading `.git/config` directly.

**Fix:**  
Edited `.git/config` to update the remote URL:
```ini
[remote "origin"]
    url = https://github.com/Lokesh-Sohanda8/Edu-Tech-Platform-SmartEdu.git
```
Also cleared `packed-refs` to remove the stale remote-tracking SHA from the old repo.

---

### Error 4: History Divergence — Force Push Required

**Error Message:**
```
! [rejected] main -> main (non-fast-forward)
error: failed to push some refs to 'https://github.com/...'
hint: Updates were rejected because the tip of your current branch is behind its remote counterpart.
```

**Cause:**  
After switching remotes, the local commit history (rooted at SHA `ba8d23c`) was not an ancestor of the `Edu-Tech-Platform-SmartEdu` repo's `main` branch history. The two repositories had independent commit trees.

**Fix:**  
Used `--force` flag to overwrite the remote's `main` branch with the local history:
```cmd
git push origin main --force
```

---

## 10. Git Operations Performed

### 10.1 Initial State

The repository was cloned from GitHub and had existing commits on `main`. The local branch was tracking `origin/main` at commit `ba8d23c375fa453376804b4989fe37e03af2c7c8`.

### 10.2 Files Added in This Development Session

**Configuration files (project root of client/):**
- `package.json`
- `tsconfig.json`
- `next.config.js` *(replacing next.config.ts)*
- `tailwind.config.ts`
- `postcss.config.js`

**Global styles:**
- `src/styles/globals.css`

**App router files:**
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/dashboard/tutor/layout.tsx`
- `src/app/dashboard/tutor/page.tsx`

**Section pages (11 files):**
- `src/app/dashboard/tutor/students/page.tsx`
- `src/app/dashboard/tutor/courses/page.tsx`
- `src/app/dashboard/tutor/timetable/page.tsx`
- `src/app/dashboard/tutor/tests/page.tsx`
- `src/app/dashboard/tutor/materials/page.tsx`
- `src/app/dashboard/tutor/fees/page.tsx`
- `src/app/dashboard/tutor/enquiries/page.tsx`
- `src/app/dashboard/tutor/todo/page.tsx`
- `src/app/dashboard/tutor/activities/page.tsx`
- `src/app/dashboard/tutor/certificates/page.tsx`
- `src/app/dashboard/tutor/analytics/page.tsx`

**Layout components:**
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/TopHeader.tsx`
- `src/components/layout/DashboardLayout.tsx`

**Dashboard widget components:**
- `src/components/dashboards/StatCards.tsx`
- `src/components/dashboards/CalendarWidget.tsx`
- `src/components/dashboards/AlertsPanel.tsx`
- `src/components/dashboards/AIInsightsPanel.tsx`
- `src/components/dashboards/ActivityFeed.tsx`

**Project root:**
- `.gitignore`

### 10.3 Commits

```
ba8d23c  (origin/main)  [pre-existing] Initial project structure
  ↓
[new]    feat: Add SmartEdu Tutor Dashboard UI with Next.js 14 and Tailwind CSS
```

### 10.4 Full Git Command Sequence

```bash
# Stage all new files (excludes node_modules via .gitignore)
git add -A

# Commit
git commit -m "feat: Add SmartEdu Tutor Dashboard UI with Next.js 14 and Tailwind CSS"

# Update remote to correct repo
git remote set-url origin https://github.com/Lokesh-Sohanda8/Edu-Tech-Platform-SmartEdu.git

# Push (force required due to diverged histories between repos)
git push origin main --force
```

### 10.5 .gitignore Rules Applied

```
node_modules/         ← Prevents large binary binaries being tracked
.next/                ← Build output excluded
.env, .env.*          ← Environment secrets excluded
*.tsbuildinfo         ← TypeScript incremental build cache excluded
next-env.d.ts         ← Auto-generated Next.js types excluded
```

---

## 11. Final Folder Structure

```
client/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── node_modules/              ← (not committed to git)
└── src/
    ├── styles/
    │   └── globals.css        ← Tailwind directives, custom CSS classes, Google Fonts
    ├── app/
    │   ├── layout.tsx         ← Root HTML layout + metadata
    │   ├── page.tsx           ← Redirect → /dashboard/tutor
    │   └── dashboard/
    │       └── tutor/
    │           ├── layout.tsx            ← DashboardLayout wrapper
    │           ├── page.tsx              ← Main dashboard (all 5 widgets)
    │           ├── students/
    │           │   └── page.tsx          ← Student table + search
    │           ├── courses/
    │           │   └── page.tsx          ← Course card grid
    │           ├── timetable/
    │           │   └── page.tsx          ← Weekly schedule grid
    │           ├── tests/
    │           │   └── page.tsx          ← Test list + mark entry
    │           ├── materials/
    │           │   └── page.tsx          ← Upload zone + file list
    │           ├── fees/
    │           │   └── page.tsx          ← Payment tracker + summary
    │           ├── enquiries/
    │           │   └── page.tsx          ← Lead CRM
    │           ├── todo/
    │           │   └── page.tsx          ← Interactive task manager
    │           ├── activities/
    │           │   └── page.tsx          ← Holiday + event calendar
    │           ├── certificates/
    │           │   └── page.tsx          ← Certificate issuing UI
    │           └── analytics/
    │               └── page.tsx          ← AI performance predictions
    └── components/
        ├── layout/
        │   ├── Sidebar.tsx               ← Collapsible sidebar, 12 nav items
        │   ├── TopHeader.tsx             ← Search, bell, avatar, logout
        │   └── DashboardLayout.tsx       ← Full shell wrapper
        └── dashboards/
            ├── StatCards.tsx             ← 4 KPI stat cards
            ├── CalendarWidget.tsx        ← Interactive monthly calendar
            ├── AlertsPanel.tsx           ← Color-coded alert reminders
            ├── AIInsightsPanel.tsx       ← AI metrics + progress bar
            └── ActivityFeed.tsx          ← Activity timeline
```

---

## 12. UI Screens Overview

### 12.1 Dashboard Home (`/dashboard/tutor`)

The main dashboard presents a complete operational overview in a single view:

- **Top row:** 4 KPI stat cards with colored left borders
  - Total Students (120) — Blue
  - Active Courses (5) — Green
  - Upcoming Classes (3 Today) — Orange
  - Pending Fees (₹15,000) — Red
- **Left column (2/3 width):**
  - Alerts Panel — 4 prioritized reminders with colored icons
  - Activity Feed — 6-item chronological timeline
- **Right column (1/3 width):**
  - Calendar Widget — interactive monthly view with event dots
  - AI Insights Panel — 3 metric tiles + class progress bar

### 12.2 Students (`/dashboard/tutor/students`)

Full-width data table with:
- Search bar + Filter button
- Avatar initials, student name column
- Batch badge (primary blue pill)
- Fee status badge (green/red/orange)
- Score with trend icon
- Active / At Risk status badge
- Row hover state
- Pagination footer

### 12.3 Courses (`/dashboard/tutor/courses`)

Responsive 3-column card grid:
- Each card has a gradient color bar header (unique per course)
- Course name, batch label
- Status badge (Active / Upcoming)
- Student count + duration metadata
- Progress bar with percentage
- "View Details" link
- "+ Create New Course" dashed placeholder card

### 12.4 Timetable (`/dashboard/tutor/timetable`)

7-column weekly grid (Monday–Saturday) × 9 time slots:
- Each class block shows subject + batch
- Color-coded by subject (blue = Math, green = Biology, orange = Physics, red = Chemistry)
- Empty slots shown as blank cells
- Horizontally scrollable on small screens

### 12.5 Tests & Marks (`/dashboard/tutor/tests`)

Two-column layout:
- **Left:** Test list cards with average score + Upcoming badge
- **Right:** Mark entry form with number inputs per student (0–max), Save button

### 12.6 Materials (`/dashboard/tutor/materials`)

- Large drag-and-drop upload zone with icon and "Browse Files" button
- File list with emoji file type icons, name, batch, size, date
- PDF/Image/Video type badges
- View / Download / Delete action buttons per file

### 12.7 Fees & Payments (`/dashboard/tutor/fees`)

- 3 summary cards: Collected (green), Pending (red), Paid count (blue)
- Full payment table: student avatar, batch, total fee, paid, balance, date, status
- Status badges with icons: ✓ Paid, ⚠ Overdue, ⏰ Partial, ⏰ Pending

### 12.8 Enquiries (`/dashboard/tutor/enquiries`)

- 4 stage summary mini-cards: New, Follow-Up, Enrolled, Cold
- Lead cards with avatar, name, status badge, course interest, date, note
- Call (green phone icon) and Email (blue mail icon) action buttons

### 12.9 Todo Tasks (`/dashboard/tutor/todo`)

- Text input + "Add" button for new tasks
- Task list with checkbox, priority badge (High/Medium/Low), delete button
- Completed tasks shown with strikethrough + 50% opacity
- Live React state — fully interactive

### 12.10 Activities & Holidays (`/dashboard/tutor/activities`)

- Color legend (Holiday/Activity/Test)
- Event cards with date, day-of-week, event name, type badge
- Color-coded backgrounds matching event type

### 12.11 Certificates (`/dashboard/tutor/certificates`)

- 2-column card grid
- Issued certificates: gold gradient header bar, yellow Award icon, grade badge, download button
- Pending certificates: gray header, neutral styling

### 12.12 AI Analytics (`/dashboard/tutor/analytics`)

- 3 insight cards: At-Risk (red), Avg Predicted Score (blue), Top Performer (orange)
- Full prediction table: student, current score, AI predicted score, trend arrow (↑/↓), risk level
- Horizontal bar chart at bottom showing individual student scores color-coded by risk level

---

## 13. Future Improvements

### 13.1 Backend Integration

All pages currently use **static/mock data**. The next development phase should connect each page to the SmartEdu REST API:

- `GET /api/tutor/students` → populate students table
- `GET /api/tutor/courses` → populate course cards
- `POST /api/tutor/fees/record` → submit fee payment
- `GET /api/tutor/analytics/predictions` → fetch AI predictions

### 13.2 Authentication & Role Guards

- Implement JWT-based auth from the server
- Add Next.js middleware to protect `/dashboard/tutor/*` routes
- Redirect unauthenticated users to `/login`
- Pass tutor profile data (`name`, `avatar`) to `TopHeader` from context/session

### 13.3 Real-Time Notifications

- WebSocket or Server-Sent Events for live activity feed updates
- Toast notification system for payment received, new enrollment
- Real-time badge count on notification bell

### 13.4 AI Analytics Expansion

- Replace static predictions with real ML model API calls
- Add score trend charts (line chart over time per student)
- Dropout risk scoring with intervention recommendations
- Batch performance comparison heatmaps
- Monthly progress reports exportable as PDF

### 13.5 Revenue & Financial Tracking

- Monthly fee collection chart
- Revenue vs. target gauge
- Outstanding fee aging analysis (30/60/90 day buckets)
- Automatic fee reminder notifications via WhatsApp/SMS
- UPI payment link generation per student

### 13.6 Student Portal Integration

- Student-facing dashboard showing their own marks, attendance, materials
- Parent login with fee payment and progress view
- Shared calendar between tutor and student

### 13.7 Course Builder

- Drag-drop lesson plan creator
- Video lecture upload + embedding
- Quiz builder with auto-grading
- Assignment submission and feedback workflow

### 13.8 AI Tutor Assistant

- In-dashboard AI chat for tutors
- "Explain this topic to a student" prompt templates
- Question paper generation from topic input
- Homework assignment suggestion based on weak areas

### 13.9 Mobile Responsiveness

- Responsive sidebar (hamburger menu on mobile)
- Bottom navigation bar on small screens
- Touch-optimized calendar widget
- PWA support for offline access

### 13.10 Dark Mode

- System-preference detection via `prefers-color-scheme`
- Manual dark mode toggle in TopHeader settings
- All color tokens remapped for dark variant using Tailwind `dark:` classes

---

*Document generated by Antigravity — March 11, 2026*  
*SmartEdu Edu-Tech Platform — Tutor Dashboard Development Log v1.0*
