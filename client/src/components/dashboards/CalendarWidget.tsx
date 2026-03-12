"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import { loadFromStorage } from "@/lib/storage";
import { Activity } from "@/types";
import clsx from "clsx";

const TYPE_COLORS: Record<Activity["type"], string> = {
  Holiday:  "bg-danger-500",
  Event:    "bg-primary-500",
  Activity: "bg-success-500",
  Test:     "bg-warning-500",
};
const BADGE_COLORS: Record<Activity["type"], string> = {
  Holiday:  "bg-danger-50 text-danger-700 border-danger-200",
  Event:    "bg-primary-50 text-primary-700 border-primary-200",
  Activity: "bg-success-50 text-success-700 border-success-200",
  Test:     "bg-warning-50 text-warning-700 border-warning-200",
};

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date("2026-03-10"));
  const [selectedDate, setSelectedDate] = useState<number | null>(10);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities(loadFromStorage<Activity[]>("activities", []));
  }, []);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDate(null); };
  const nextMonth = () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDate(null); };

  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    return (day > 0 && day <= daysInMonth) ? day : null;
  });

  const getDayEvents = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return activities.filter((a) => a.date === dateStr);
  };

  const selectedEvents = selectedDate ? getDayEvents(selectedDate) : [];

  return (
    <div className="page-card h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <CalendarIcon size={18} className="text-primary-500" />
          Schedule
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-surface-muted transition-colors">
            <ChevronLeft size={16} className="text-text-muted" />
          </button>
          <span className="text-sm font-semibold text-text-primary min-w-[100px] text-center">
            {currentDate.toLocaleString("default", { month: "long" })} {year}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-surface-muted transition-colors">
            <ChevronRight size={16} className="text-text-muted" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-text-secondary py-1">
            {d}
          </div>
        ))}

        {days.map((day, i) => {
          const isToday = day === 10 && month === 2 && year === 2026;
          const isSelected = day === selectedDate;
          const evts = day ? getDayEvents(day) : [];

          return (
            <div key={i} className="aspect-square p-0.5">
              {day ? (
                <button
                  onClick={() => setSelectedDate(day)}
                  className={clsx(
                    "w-full h-full flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 relative group",
                    isSelected
                      ? "bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-105 z-10"
                      : isToday
                      ? "bg-primary-50 text-primary-700 hover:bg-primary-100 font-bold"
                      : "text-text-primary hover:bg-surface-muted"
                  )}
                >
                  <span className={clsx("z-10", isSelected && "font-bold")}>{day}</span>

                  {/* Event Dots */}
                  {evts.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-0.5 z-10">
                      {evts.slice(0, 3).map((e, idx) => (
                        <div
                          key={idx}
                          className={clsx(
                            "w-1.5 h-1.5 rounded-full",
                            isSelected ? "bg-white" : TYPE_COLORS[e.type]
                          )}
                        />
                      ))}
                    </div>
                  )}
                </button>
              ) : (
                <div className="w-full h-full rounded-xl bg-surface-muted/30" />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day View */}
      <div className="mt-auto pt-4 border-t border-surface-border">
        {selectedDate ? (
          <div>
            <p className="text-sm font-bold text-text-primary mb-3">
              Events on {currentDate.toLocaleString("default", { month: "short" })} {selectedDate}
            </p>
            <div className="space-y-2">
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4 bg-surface-muted/50 rounded-xl">
                  No events scheduled for this day.
                </p>
              ) : (
                selectedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex justify-between items-center p-3 rounded-xl border border-surface-border hover:shadow-sm transition-shadow bg-white"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {evt.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={clsx("badge border !px-1.5 !py-0", BADGE_COLORS[evt.type])}>
                          {evt.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-muted text-center py-4">Select a day to view details</p>
        )}
      </div>
    </div>
  );
}
