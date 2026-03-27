# SmartEdu Tutor Dashboard — Client Folder Walkthrough

> **Project:** SmartEdu EdTech Platform  
> **Scope:** `/client` — the Next.js frontend  
> **Last Updated:** March 27, 2026

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Folder Structure](#2-folder-structure)
3. [Configuration Files](#3-configuration-files)
4. [Routing Architecture](#4-routing-architecture)
5. [Authentication Flow](#5-authentication-flow)
6. [Data Layer — localStorage](#6-data-layer--localstorage)
7. [Type Definitions](#7-type-definitions)
8. [Layout System](#8-layout-system)
9. [Pages Reference](#9-pages-reference)
10. [Dashboard Components](#10-dashboard-components)
11. [Shared UI Components](#11-shared-ui-components)
12. [Theming System — Dark Mode](#12-theming-system--dark-mode)
13. [Tailwind Design Tokens](#13-tailwind-design-tokens)
14. [Global CSS & Utility Classes](#14-global-css--utility-classes)
15. [Navigation Flow Diagram](#15-navigation-flow-diagram)
16. [localStorage Keys Reference](#16-localstorage-keys-reference)

---

## 1. Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14.2.28 | React framework, App Router |
| **React** | ^18 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^3.4.1 | Utility-first styling |
| **Lucide React** | ^0.460.0 | Icon set |
| **clsx** | ^2.1.1 | Conditional className utility |
| **PostCSS** | ^8 | CSS pre-processing |

> **No backend is connected.** All data is stored and retrieved from the browser's `localStorage`. This is a fully functional frontend prototype designed to simulate real tutor workflows.

---

## 2. Folder Structure

```
client/
├── public/
│   └── favicon.svg                  # SmartEdu graduation cap logo (browser tab)
│
├── src/
│   ├── app/                         # Next.js App Router pages
│   │   ├── layout.tsx               # Root HTML layout + metadata
│   │   ├── page.tsx                 # Root "/" → redirects to /dashboard/tutor
│   │   ├── login/
│   │   │   └── page.tsx             # Tutor login page
│   │   └── dashboard/
│   │       └── tutor/
│   │           ├── layout.tsx       # Dashboard shell (AuthGuard + DashboardLayout)
│   │           ├── page.tsx         # Main dashboard overview
│   │           ├── students/        # Student management
│   │           ├── courses/         # Course management
│   │           ├── timetable/       # Weekly class schedule
│   │           ├── tests/           # Tests & marks
│   │           ├── materials/       # Study material uploads
│   │           ├── fees/            # Fee & payment tracking
│   │           ├── enquiries/       # Lead/enquiry CRM
│   │           ├── todo/            # Task manager
│   │           ├── activities/      # Events & activities calendar
│   │           ├── certificates/    # Student certificate issuance
│   │           └── analytics/       # AI analytics & insights
│   │
│   ├── components/
│   │   ├── dashboards/              # Dashboard widget cards
│   │   │   ├── StatCards.tsx        # Top-level KPI cards (4 stats)
│   │   │   ├── AlertsPanel.tsx      # Alerts & Reminders card
│   │   │   ├── ActivityFeed.tsx     # Recent activity timeline
│   │   │   ├── CalendarWidget.tsx   # Monthly calendar + events
│   │   │   └── AIInsightsPanel.tsx  # Performance insights
│   │   │
│   │   ├── layout/                  # App shell components
│   │   │   ├── DashboardLayout.tsx  # Sidebar + Header wrapper
│   │   │   ├── Sidebar.tsx          # Collapsible left navigation
│   │   │   ├── TopHeader.tsx        # Header bar (search, bell, dark mode, profile)
│   │   │   └── AuthGuard.tsx        # LocalStorage-based auth protection
│   │   │
│   │   └── ui/
│   │       └── Modal.tsx            # Reusable overlay modal
│   │
│   ├── lib/
│   │   └── storage.ts               # localStorage helper functions
│   │
│   ├── types/
│   │   └── index.ts                 # All shared TypeScript interfaces
│   │
│   ├── styles/
│   │   └── globals.css              # CSS variables + Tailwind directives + utility classes
│   │
│   ├── features/                    # (Reserved for future feature modules)
│   ├── hooks/                       # (Reserved for custom React hooks)
│   └── store/                       # (Reserved for global state management)
│
├── tailwind.config.ts               # Design token system
├── next.config.js                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
├── postcss.config.js                # PostCSS setup
└── package.json                     # Dependencies & scripts
```

---

## 3. Configuration Files

### `package.json`
Defines the project and its scripts:
```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Build for production
npm run start    # Serve production build
npm run lint     # Run ESLint
```

### `next.config.js`
Minimal Next.js config. No custom rewrites or redirects — routing is handled within the app itself.

### `tsconfig.json`
Key setting: `"@/*"` path alias maps to `./src/*`, allowing clean imports like:
```ts
import { loadFromStorage } from "@/lib/storage";
import Modal from "@/components/ui/Modal";
```

### `tailwind.config.ts`
Defines the full design token system. See [Section 13](#13-tailwind-design-tokens) for complete details.

---

## 4. Routing Architecture

The app uses Next.js 14 **App Router**. All routes are file-based under `src/app/`.

```
/                         → Redirects to /dashboard/tutor
/login                    → Tutor login page
/dashboard/tutor          → Main overview dashboard
/dashboard/tutor/students       → Student list & management
/dashboard/tutor/courses        → Course list & management
/dashboard/tutor/timetable      → Weekly timetable grid
/dashboard/tutor/tests          → Tests & marks entry
/dashboard/tutor/materials      → Study material uploads
/dashboard/tutor/fees           → Fee & payment tracker
/dashboard/tutor/enquiries      → Enquiry/lead CRM pipeline
/dashboard/tutor/todo           → Task manager
/dashboard/tutor/activities     → Events & activities
/dashboard/tutor/certificates   → Certificate issuance
/dashboard/tutor/analytics      → AI-powered analytics
```

### Layout Nesting

```
app/layout.tsx                    ← Root: sets HTML, fonts, favicon
  └── app/login/page.tsx          ← Login (no dashboard shell)
  └── app/dashboard/tutor/layout.tsx  ← AuthGuard + DashboardLayout
        └── app/dashboard/tutor/page.tsx        ← Dashboard Overview
        └── app/dashboard/tutor/students/page.tsx
        └── ... (all other tutor pages)
```

The `dashboard/tutor/layout.tsx` wraps every dashboard page with:
1. **`AuthGuard`** — validates session before rendering
2. **`DashboardLayout`** — adds Sidebar + TopHeader around the page content

---

## 5. Authentication Flow

Authentication is entirely frontend-based using `localStorage`. There is **no server-side session** or JWT involved.

### Login Process (`/login/page.tsx`)
1. User enters **email** and **password** in the login form
2. Credentials are validated against hardcoded demo values (no API call)
3. On success: `localStorage.setItem("tutorAuth", "true")` is called, along with storing `tutorName` and `tutorEmail`
4. User is redirected to `/dashboard/tutor`

### Session Guard (`AuthGuard.tsx`)
Every dashboard page is wrapped in `AuthGuard`. On mount, it checks:
```ts
const isAuth = localStorage.getItem("tutorAuth") === "true";
if (!isAuth) router.replace("/login");
```

While checking (SSR → hydration gap), a branded loading screen is displayed to prevent a flash of unauthenticated content.

### Logout (`TopHeader.tsx`)
Clicking "Logout" in the profile dropdown:
```ts
localStorage.removeItem("tutorAuth");
localStorage.removeItem("tutorName");
localStorage.removeItem("tutorEmail");
router.push("/login");
```

### localStorage Auth Keys
| Key | Type | Purpose |
|---|---|---|
| `tutorAuth` | `"true"` | Session presence flag |
| `tutorName` | `string` | Display name in header |
| `tutorEmail` | `string` | Display email in profile dropdown |

---

## 6. Data Layer — localStorage

**File:** `src/lib/storage.ts`

All application data is stored in the browser's `localStorage` as serialized JSON. Three utility functions handle all read/write operations:

### `loadFromStorage<T>(key, fallback)`
Reads and parses a value. Returns `fallback` if the key doesn't exist or the JSON is malformed.
```ts
const students = loadFromStorage<Student[]>("students", []);
```

### `saveToStorage<T>(key, data)`
Serializes and writes a value. Fails silently with a console error.
```ts
saveToStorage("students", updatedStudents);
```

### `generateId()`
Produces a unique ID for new records using timestamp + random string:
```ts
const id = generateId(); // e.g. "1711527419320-k4m2x"
```

Each page seeds default demo data on first load if the localStorage key is empty. This means the dashboard works out of the box without any setup.

---

## 7. Type Definitions

**File:** `src/types/index.ts`

All shared data interfaces are defined here. Every page imports from this single file to ensure consistency.

| Interface | Key Fields | Used In |
|---|---|---|
| `Student` | `id, name, email, phone, course, batch, feeStatus, status, score, joinDate` | Students, Fees, Certificates |
| `Course` | `id, title, subject, batch, duration, totalStudents, progress, status, startDate` | Courses, Materials |
| `Material` | `id, courseId, courseName, title, fileName, fileType, uploadDate, size` | Materials |
| `Test` | `id, testName, course, batch, date, maxMarks, status, studentMarks[]` | Tests & Marks |
| `Payment` | `id, studentId, studentName, course, totalAmount, paidAmount, status, dueDate` | Fees & Payments |
| `Enquiry` | `id, name, phone, email, interestedCourse, stage, source, notes, date` | Enquiries |
| `Todo` | `id, task, priority, completed, createdAt` | Todo Tasks |
| `Activity` | `id, title, type, date, description` | Activities, Calendar |

### Enum Values
```ts
Student.feeStatus  → "Paid" | "Pending" | "Overdue" | "Partial"
Student.status     → "Active" | "At Risk" | "Inactive"
Course.status      → "Active" | "Upcoming" | "Completed"
Enquiry.stage      → "New" | "Contacted" | "Interested" | "Converted" | "Rejected"
Todo.priority      → "Low" | "Medium" | "High"
Activity.type      → "Holiday" | "Event" | "Activity" | "Test"
```

---

## 8. Layout System

### `DashboardLayout.tsx`
The top-level shell for all authenticated pages:

```tsx
<div className="flex h-screen overflow-hidden bg-surface transition-colors">
  <Sidebar />
  <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
    <TopHeader />
    <main className="flex-1 overflow-y-auto p-6">
      {children}
    </main>
  </div>
</div>
```

- **`bg-surface`** — uses CSS variable, adapts to light/dark mode
- **`min-w-0`** — prevents flex children from overflowing
- **`overflow-y-auto`** on `<main>` — only the content scrolls, not the entire page

### `Sidebar.tsx`
Collapsible left navigation with all dashboard links.

- **Expanded:** shows icon + label
- **Collapsed:** shows icon only (toggleable via "Collapse" button at bottom)
- Active route is highlighted with `bg-primary-500 text-white`
- Sidebar background is hardcoded dark (`#0F172A`) regardless of theme — intentional design choice for contrast

### `TopHeader.tsx`
Fixed header bar containing:

| Element | Description |
|---|---|
| **Welcome message** | Dynamic greeting + tutor name from localStorage |
| **Global Search** | Searches students, courses, materials, tests, activities by name in realtime |
| **Notification Bell** | Shows badge + dropdown with recent alerts |
| **🌙/☀️ Toggle** | Inline dark mode toggle button (Moon in light mode, Sun in dark mode) |
| **⚙️ Settings** | Quick settings dropdown (Email alerts toggle) |
| **Profile Dropdown** | Shows tutor name, email, and Logout button |

---

## 9. Pages Reference

### `/login` — Login Page
A two-field login form (email + password) with demo credentials validation.
- On success → saves auth to localStorage → redirects to dashboard
- Fully styled with brand gradient and SmartEdu logo

### `/dashboard/tutor` — Dashboard Overview
The main landing page after login. Contains:
- **StatCards** — 4 KPI cards (Total Students, Active Courses, Upcoming Events, Pending Fees)
- **AlertsPanel** — Overdue fees and upcoming tests as actionable alerts
- **ActivityFeed** — Timeline of recent enrollments, payments, materials
- **CalendarWidget** — Mini monthly calendar with event dots and day-selection
- **AIInsightsPanel** — Batch average score, at-risk students, top performers

Grid layout:
```
[StatCards — full width, 4 columns]
[AlertsPanel + ActivityFeed] [CalendarWidget + AIInsightsPanel]
      2/3 width                        1/3 width
```

### `/dashboard/tutor/students` — Student Management
Full CRUD for student records:
- Searchable, filterable list (by status: Active / At Risk / Inactive)
- Add / Edit via Modal form
- Inline delete with confirmation
- Shows score, fee status badge, join date

### `/dashboard/tutor/courses` — Course Management
Full CRUD for courses:
- Status filter (Active / Upcoming / Completed)
- Progress bar per course
- Material count and student count display
- Add / Edit via Modal

### `/dashboard/tutor/timetable` — Weekly Timetable
Static weekly grid (Mon–Sat) × time slots (8 AM–5 PM):
- Color-coded class blocks by subject type
- Subject name + batch displayed in each cell
- "Add Class" button (UI only, no persistence yet)

### `/dashboard/tutor/tests` — Tests & Marks
- List of tests with status (Upcoming / Completed)
- Mark entry: enter scores for each student per test
- Average score calculation
- Add test via Modal

### `/dashboard/tutor/materials` — Study Materials
- Upload simulation (stores metadata, not actual files)
- Filter by course
- File type badges (PDF, Video, Image, Document)
- Delete with confirmation

### `/dashboard/tutor/fees` — Fees & Payments
- Payment records for each student
- Status badges: Paid / Pending / Overdue / Partial
- Record payment entry (partial or full)
- Overdue records highlighted in red

### `/dashboard/tutor/enquiries` — Enquiries / CRM
Pipeline-style lead management:
- Stage summary cards at top (New / Contacted / Interested / Converted / Rejected)
- Click a stage card to filter the list
- Inline stage dropdown to move leads through the pipeline
- Phone call and email action buttons
- Add / Edit via Modal

### `/dashboard/tutor/todo` — Task Manager
- Add tasks with Low / Medium / High priority
- Toggle complete / incomplete (checkbox)
- Filter by All / Active / Completed
- Priority badges color-coded
- "Clear completed" bulk action

### `/dashboard/tutor/activities` — Activities & Events
- Calendar-linked events (Holidays, Tests, Activities, Events)
- Add activity with date and type
- Displayed as cards with color-coded type badges

### `/dashboard/tutor/certificates` — Certificates
- Issue certificates to students
- Status: Issued / Pending
- Grade and issue date fields
- "Mark as Issued" action for pending certs
- Grid card layout with color-coded left accent bar

### `/dashboard/tutor/analytics` — AI Analytics
- Batch performance overview
- Score distribution charts
- At-risk student identification
- Top performer highlights

---

## 10. Dashboard Components

### `StatCards.tsx`
Reads from `students`, `courses`, `payments`, `activities` in localStorage and computes:
- **Total Students** — `students.length`
- **Active Courses** — courses with `status === "Active"`
- **Upcoming Events** — activities of type Test/Event/Activity with future date
- **Pending Fees** — sum of `totalAmount - paidAmount` for non-Paid payments

Each card has a colored left border (`border-l-4`) and an icon in an opacity-tinted box.

### `AlertsPanel.tsx`
Generates actionable alerts from:
- **Overdue payments** → "Overdue Fee" alert (red/danger)
- **Upcoming tests** with status "Upcoming" → "Upcoming Test" alert (orange/warning)

Uses a `border-left-accent` pattern so card backgrounds adapt to dark mode.

### `ActivityFeed.tsx`
Pulls recent records from students, courses, payments, and materials. Sorts all items descending by date and shows the top 6 as a vertical timeline with colored icon dots.

### `CalendarWidget.tsx`
- Generates a 7×6 day grid for the current month
- Loads `activities` from localStorage and shows colored dots on days with events
- Clicking a day shows that day's events below the calendar
- Today is highlighted with `bg-primary-500/20`

### `AIInsightsPanel.tsx`
Simulates an 800ms "AI processing" delay, then computes:
- **Average Score** — mean of all active student scores
- **At-Risk Count** — students with score < 50 or status "At Risk"
- **Top Performers** — students with score ≥ 85

---

## 11. Shared UI Components

### `Modal.tsx`
A fully reusable modal overlay used for all add/edit forms across the app.

**Props:**
```ts
isOpen: boolean       // Controls visibility
title: string         // Header title
onClose: () => void   // Close handler
children: ReactNode   // Form content
size?: "sm" | "md" | "lg"  // Controls max-width (default: "md")
```

**Features:**
- Closes on `Escape` key
- Prevents body scroll when open
- Backdrop blur + semi-transparent overlay
- Background uses `bg-[var(--surface-card)]` for dark mode compatibility

---

## 12. Theming System — Dark Mode

Dark mode is implemented via **CSS custom properties (variables)** controlled by a `.dark` class on the `<html>` element.

### How it toggles (`TopHeader.tsx`)
```ts
// Enable dark mode
document.documentElement.classList.add("dark");
localStorage.setItem("theme", "dark");

// Disable dark mode
document.documentElement.classList.remove("dark");
localStorage.setItem("theme", "light");
```

On app load, the saved theme preference is read from localStorage and applied.

### CSS Variable Map (`globals.css`)

| Variable | Light Mode | Dark Mode |
|---|---|---|
| `--surface` | `#F8F9FC` | `#0F172A` |
| `--surface-card` | `#FFFFFF` | `#1E293B` |
| `--surface-muted` | `#F1F3F9` | `#334155` |
| `--surface-border` | `#E4E7F0` | `#475569` |
| `--text-primary` | `#111827` | `#F8FAFC` |
| `--text-secondary` | `#6B7280` | `#CBD5E1` |
| `--text-muted` | `#9CA3AF` | `#94A3B8` |
| `--sidebar-bg` | `#0F172A` | `#0B1120` |

### Badge Color Strategy
All colored badges (priority, status, stage) use **opacity-based tokens** to avoid invisible text in dark mode:
```
bg-primary-500/20 text-primary-400 border-primary-500/30
bg-success-500/20 text-success-400 border-success-500/30
bg-warning-500/20 text-warning-500 border-warning-500/30
bg-danger-500/20  text-danger-400  border-danger-500/30
```
This approach works because `/20` opacity on `#4F6EF7` (blue) creates a visible tint on both light and dark surfaces.

---

## 13. Tailwind Design Tokens

**File:** `tailwind.config.ts`

### Color Palette
```
primary   → Blue    (#4F6EF7)  — brand, buttons, highlights
success   → Green   (#22C55E)  — success states, active
warning   → Orange  (#F97316)  — warnings, upcoming
danger    → Red     (#EF4444)  — errors, overdue, alerts
surface   → CSS variables      — backgrounds (light/dark)
text      → CSS variables      — text layers (light/dark)
sidebar   → Fixed dark theme   — always dark regardless of mode
```

### Custom Shadows
```
shadow-card         → subtle card elevation
shadow-card-hover   → elevated on hover/interaction
shadow-sidebar      → left sidebar depth
shadow-header       → top bar separation
```

### Custom Animations
```
animate-fade-in     → opacity 0→1 + translateY 4px→0 (0.2s)
animate-slide-in    → opacity 0→1 + translateX -8px→0 (0.25s)
animate-pulse-soft  → gentle opacity pulse (2s loop) — used on notification dot
```

### Border Radius
```
rounded-xl   → 12px  (buttons, inputs, small cards)
rounded-2xl  → 16px  (stat cards, modals, panels)
rounded-3xl  → 20px  (large decorative elements)
```

---

## 14. Global CSS & Utility Classes

**File:** `src/styles/globals.css`

Beyond CSS variables, `globals.css` defines reusable component classes via `@layer components`:

| Class | Description |
|---|---|
| `.stat-card` | Dashboard stat card — uses `var(--surface-card)`, border, hover lift |
| `.page-card` | Standard content card — same surface, used on all pages |
| `.alert-card` | Flex alert row with border and hover |
| `.nav-item` | Sidebar navigation item |
| `.table-header` | `<th>` styling — muted background, uppercase, tracked |
| `.table-cell` | `<td>` styling — border-bottom, primary text |
| `.badge` | Inline tag/chip — inline-flex, rounded-full, small text |
| `.btn-primary` | Blue filled button with hover |
| `.btn-secondary` | Muted secondary button |
| `.input-field` | Form input/select — surface-muted background, focus ring |

---

## 15. Navigation Flow Diagram

```
Browser hits "/"
       │
       ▼
app/page.tsx → redirect("/dashboard/tutor")
       │
       ▼
app/dashboard/tutor/layout.tsx
       │
       ├── AuthGuard checks localStorage["tutorAuth"]
       │       │
       │       ├── Not found → redirect("/login")
       │       │       │
       │       │       └── /login/page.tsx
       │       │               │
       │       │               └── Login success → set auth → redirect("/dashboard/tutor")
       │       │
       │       └── Found → render children
       │
       └── DashboardLayout
               ├── Sidebar (navigation)
               ├── TopHeader (search, dark mode, profile)
               └── <main> → page content
                       ├── /dashboard/tutor            → Overview
                       ├── /dashboard/tutor/students   → Students
                       ├── /dashboard/tutor/courses    → Courses
                       └── ... (all other pages)
```

---

## 16. localStorage Keys Reference

All data is stored under these top-level keys:

| Key | Type | First-load Seeded? | Used In |
|---|---|---|---|
| `tutorAuth` | `"true"` | No | AuthGuard, TopHeader |
| `tutorName` | `string` | No | TopHeader |
| `tutorEmail` | `string` | No | TopHeader profile dropdown |
| `theme` | `"dark" \| "light"` | No | TopHeader dark mode |
| `students` | `Student[]` | Yes (5 demo records) | Students, StatCards, Fees, Certificates |
| `courses` | `Course[]` | Yes (4 demo courses) | Courses, StatCards, Materials |
| `payments` | `Payment[]` | Yes (5 demo payments) | Fees, StatCards, AlertsPanel, ActivityFeed |
| `materials` | `Material[]` | Yes (3 demo materials) | Materials, ActivityFeed |
| `tests` | `Test[]` | Yes (3 demo tests) | Tests & Marks, AlertsPanel |
| `enquiries` | `Enquiry[]` | Yes (5 demo leads) | Enquiries |
| `todos` | `Todo[]` | Yes (5 demo tasks) | Todo Tasks |
| `activities` | `Activity[]` | Yes (3 demo events) | Activities, CalendarWidget, StatCards |
| `certificates` | `Certificate[]` | Yes (3 demo certs) | Certificates |

> **Note:** Each page checks if its key exists in localStorage on mount. If empty, it writes the seed data and renders it. On subsequent visits, it reads from the stored (user-modified) data.

---

## Running the Project

```bash
# From the client/ directory:
cd client

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Open in browser
# → http://localhost:3000
# → Will redirect to /login automatically
# → Use any email/password to log in (demo mode)
```

---

*This document covers 100% of the files currently in `client/src`. The `features/`, `hooks/`, and `store/` directories are reserved for future expansion (feature modules, custom hooks, and global state management respectively).*
