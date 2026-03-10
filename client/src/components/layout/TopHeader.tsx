"use client";

import { Bell, Settings, LogOut, Search, ChevronDown } from "lucide-react";
import { useState } from "react";

interface TopHeaderProps {
  tutorName?: string;
}

export default function TopHeader({ tutorName = "Mr. Sharma" }: TopHeaderProps) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-surface-border shadow-header flex items-center justify-between px-6 flex-shrink-0 z-10">
      {/* Left: Welcome */}
      <div className="flex flex-col">
        <p className="text-xs text-text-muted font-medium">Good evening 👋</p>
        <h1 className="text-base font-semibold text-text-primary">
          Welcome, <span className="text-primary-500">{tutorName}</span>
        </h1>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center gap-2 bg-surface-muted border border-surface-border rounded-xl px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-primary-300 focus-within:border-primary-400 transition-all duration-200">
        <Search size={15} className="text-text-muted flex-shrink-0" />
        <input
          type="text"
          placeholder="Search students, courses..."
          className="bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none w-full"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-muted transition-colors duration-200 group">
          <Bell size={18} className="text-text-secondary group-hover:text-primary-500 transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white animate-pulse-soft" />
        </button>

        {/* Settings */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-muted transition-colors duration-200 group">
          <Settings size={18} className="text-text-secondary group-hover:text-primary-500 transition-colors" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-surface-border mx-1" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-surface-muted transition-colors duration-200"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-xs font-bold">MS</span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-text-primary leading-tight">{tutorName}</p>
              <p className="text-xs text-text-muted leading-tight">Tutor</p>
            </div>
            <ChevronDown size={14} className="text-text-muted hidden lg:block" />
          </button>

          {/* Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-card-hover border border-surface-border overflow-hidden animate-fade-in z-50">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-surface-muted transition-colors">
                <Settings size={15} className="text-text-muted" />
                Settings
              </button>
              <div className="border-t border-surface-border" />
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger-600 hover:bg-danger-50 transition-colors">
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
