"use client";

import { Bell, Settings, LogOut, Search, ChevronDown, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// =========================================================================
// Global Search Logic
// =========================================================================
interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  link: string;
  icon: React.ReactNode;
  bgClass: string;
}

function useGlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase();
    const found: SearchResult[] = [];

    // 1. Search Students
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    students.forEach((s: any) => {
      if (s.name.toLowerCase().includes(q) || s.course.toLowerCase().includes(q)) {
        found.push({
          id: `s-${s.id}`, type: "Student", title: s.name, subtitle: `${s.course} • ${s.batch}`,
          link: `/dashboard/tutor/students?search=${encodeURIComponent(s.name)}`,
          icon: <span className="font-bold text-[10px]">{s.name.charAt(0)}</span>,
          bgClass: "bg-blue-100 text-blue-700",
        });
      }
    });

    // 2. Search Courses
    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    courses.forEach((c: any) => {
      if (c.title.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q)) {
        found.push({
          id: `c-${c.id}`, type: "Course", title: c.title, subtitle: `${c.subject} • ${c.batch}`,
          link: `/dashboard/tutor/courses`,
          icon: <span className="font-bold text-[10px]">C</span>,
          bgClass: "bg-purple-100 text-purple-700",
        });
      }
    });

    // 3. Search Materials
    const materials = JSON.parse(localStorage.getItem("materials") || "[]");
    materials.forEach((m: any) => {
      if (m.title.toLowerCase().includes(q) || m.fileName.toLowerCase().includes(q)) {
        found.push({
          id: `m-${m.id}`, type: "Material", title: m.title, subtitle: `${m.courseName} • ${m.fileType}`,
          link: `/dashboard/tutor/materials`,
          icon: <span className="font-bold text-[10px]">M</span>,
          bgClass: "bg-orange-100 text-orange-700",
        });
      }
    });

    // 4. Search Tests
    const tests = JSON.parse(localStorage.getItem("tests") || "[]");
    tests.forEach((t: any) => {
      if (t.testName.toLowerCase().includes(q)) {
        found.push({
          id: `t-${t.id}`, type: "Test", title: t.testName, subtitle: `${t.course} • ${t.date}`,
          link: `/dashboard/tutor/tests`,
          icon: <span className="font-bold text-[10px]">T</span>,
          bgClass: "bg-rose-100 text-rose-700",
        });
      }
    });

    // 5. Search Activities/Events
    const activities = JSON.parse(localStorage.getItem("activities") || "[]");
    activities.forEach((a: any) => {
      if (a.title.toLowerCase().includes(q)) {
        found.push({
          id: `a-${a.id}`, type: "Event", title: a.title, subtitle: `${a.type} • ${a.date}`,
          link: `/dashboard/tutor/activities`,
          icon: <span className="font-bold text-[10px]">E</span>,
          bgClass: "bg-emerald-100 text-emerald-700",
        });
      }
    });

    setResults(found.slice(0, 6)); // limit to top 6 results
    setIsOpen(true);
  }, [query]);

  return { query, setQuery, results, isOpen, setIsOpen };
}
// =========================================================================

interface TopHeaderProps {
  tutorName?: string;
}

export default function TopHeader({ tutorName }: TopHeaderProps) {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [displayName, setDisplayName] = useState(tutorName ?? "Mr. Sharma");
  
  const { query, setQuery, results, isOpen, setIsOpen } = useGlobalSearch();

  useEffect(() => {
    const stored = localStorage.getItem("tutorName");
    if (stored) setDisplayName(stored);

    // Initialize dark mode
    if (localStorage.getItem("theme") === "dark" || 
       (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tutorAuth");
    localStorage.removeItem("tutorName");
    localStorage.removeItem("tutorEmail");
    router.push("/login");
  };

  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 bg-surface-card border-b border-surface-border shadow-header flex items-center justify-between px-6 flex-shrink-0 z-10 transition-colors">
      {/* Left: Welcome */}
      <div className="flex flex-col">
        <p className="text-xs text-text-muted font-medium">Good evening 👋</p>
        <h1 className="text-base font-semibold text-text-primary">
          Welcome, <span className="text-primary-500">{displayName}</span>
        </h1>
      </div>

      {/* Center: Search */}
      <div className="hidden md:block relative">
        <div className="flex items-center gap-2 bg-surface-muted border border-surface-border rounded-xl px-3 py-2 w-72 lg:w-96 focus-within:ring-2 focus-within:ring-primary-300 focus-within:border-primary-400 transition-all duration-200">
          <Search size={15} className="text-text-muted flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder="Search students, courses, materials..."
            className="bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none w-full"
          />
        </div>

        {/* Global Search Results Dropdown */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface-card rounded-xl shadow-2xl border border-surface-border overflow-hidden z-40 animate-fade-in">
              {results.length === 0 ? (
                <div className="p-4 text-center text-sm text-text-muted">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="py-2">
                  <p className="px-4 py-1 text-xs font-bold text-text-secondary uppercase tracking-widest bg-surface-muted">
                    Search Results
                  </p>
                  {results.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                        router.push(res.link);
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-surface-muted transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${res.bgClass}`}>
                        {res.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-text-primary truncate">{res.title}</p>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-surface-border/50 text-text-secondary">
                            {res.type}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted truncate mt-0.5">{res.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-muted transition-colors duration-200 group"
          >
            <Bell size={18} className="text-text-secondary group-hover:text-primary-500 transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-surface-card animate-pulse-soft" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-72 bg-surface-card rounded-xl shadow-card-hover border border-surface-border overflow-hidden animate-fade-in z-50">
                <div className="px-4 py-3 border-b border-surface-border flex justify-between items-center">
                  <p className="text-sm font-bold text-text-primary">Notifications</p>
                  <button className="text-xs text-primary-500 hover:text-primary-600 font-medium tracking-wide">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-4 border-b border-surface-border hover:bg-surface-muted transition-colors cursor-pointer">
                    <p className="text-sm text-text-primary font-semibold">New Enquiry received</p>
                    <p className="text-xs text-text-muted mt-0.5">Arjun Singh is interested in JEE Batch.</p>
                    <p className="text-[10px] text-text-secondary mt-1 font-medium">Just now</p>
                  </div>
                  <div className="p-4 hover:bg-surface-muted transition-colors cursor-pointer">
                    <p className="text-sm text-text-primary font-semibold">Overdue Fee Alert</p>
                    <p className="text-xs text-text-muted mt-0.5">Amit Sharma's fee is overdue by 5 days.</p>
                    <p className="text-[10px] text-text-secondary mt-1 font-medium">2 hours ago</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-surface-border bg-surface-muted text-center cursor-pointer hover:bg-surface-border transition-colors">
                  <p className="text-xs font-semibold text-text-secondary">View all notifications</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dark Mode Toggle — inline in navbar */}
        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-muted transition-colors duration-200 group"
        >
          {isDarkMode
            ? <Sun size={18} className="text-warning-400 group-hover:text-warning-300 transition-colors" />
            : <Moon size={18} className="text-text-secondary group-hover:text-primary-500 transition-colors" />
          }
        </button>

        {/* Settings */}
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-muted transition-colors duration-200 group"
          >
            <Settings size={18} className="text-text-secondary group-hover:text-primary-500 transition-colors" />
          </button>

          {showSettings && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface-card rounded-xl shadow-card-hover border border-surface-border overflow-hidden animate-fade-in z-50">
                <div className="px-4 py-3 border-b border-surface-border">
                  <p className="text-sm font-bold text-text-primary">Quick Settings</p>
                </div>
                <div className="p-2 space-y-1">
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-surface-muted transition-colors cursor-pointer">
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-text-primary">Email Alerts</p>
                      <p className="text-xs text-text-secondary">Fees & Enquiries</p>
                    </div>
                    <div className="w-10 h-5 rounded-full relative bg-primary-500 transition-colors">
                      <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm" />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-surface-border bg-surface-muted text-center cursor-pointer hover:bg-surface-border transition-colors">
                  <p className="text-xs font-semibold text-text-secondary">All Settings</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-surface-border mx-1" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            id="profile-menu-btn"
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-surface-muted transition-colors duration-200"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-text-primary leading-tight">{displayName}</p>
              <p className="text-xs text-text-muted leading-tight">Tutor</p>
            </div>
            <ChevronDown size={14} className="text-text-muted hidden lg:block" />
          </button>

          {/* Dropdown Menu */}
          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface-card rounded-xl shadow-card-hover border border-surface-border overflow-hidden animate-fade-in z-50">
                {/* Tutor info */}
                <div className="px-4 py-3 border-b border-surface-border">
                  <p className="text-sm font-semibold text-text-primary">{displayName}</p>
                  <p className="text-xs text-text-muted truncate">
                    {localStorage.getItem("tutorEmail") ?? "tutor@smartedu.com"}
                  </p>
                </div>

                <div className="border-t border-surface-border" />

                {/* ── Logout ────────────────────────────────────────── */}
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger-600 hover:bg-danger-50 transition-colors font-medium"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
