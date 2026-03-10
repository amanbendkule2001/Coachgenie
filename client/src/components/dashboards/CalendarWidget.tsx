"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// Sample events for March 2026
const events: Record<number, { type: "class"|"holiday"|"test"; label: string }[]> = {
  11: [{ type: "class", label: "Batch A - Math" }],
  13: [{ type: "class", label: "Batch B - Physics" }],
  15: [{ type: "test", label: "Math Quiz" }],
  17: [{ type: "class", label: "Chemistry" }],
  20: [{ type: "holiday", label: "Holi" }],
  22: [{ type: "class", label: "Batch A" }],
  25: [{ type: "test", label: "Full Test" }],
  28: [{ type: "class", label: "Batch C" }],
};

const EVENT_COLORS = {
  class: "bg-primary-500",
  holiday: "bg-success-500",
  test: "bg-warning-500",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarWidget() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(2); // March (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(10);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div className="page-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Calendar</h2>
          <p className="text-xs text-text-muted mt-0.5">{MONTHS[viewMonth]} {viewYear}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-muted transition-colors"
          >
            <ChevronLeft size={15} className="text-text-secondary" />
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-muted transition-colors"
          >
            <ChevronRight size={15} className="text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-text-muted py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = events[day] ?? [];
          const selected = selectedDay === day;
          const todayCheck = isToday(day);

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={clsx(
                "flex flex-col items-center justify-start py-1.5 rounded-xl text-xs font-medium transition-all duration-200",
                selected
                  ? "bg-primary-500 text-white shadow-md"
                  : todayCheck
                  ? "bg-primary-50 text-primary-600 ring-1 ring-primary-300"
                  : "hover:bg-surface-muted text-text-primary"
              )}
            >
              <span>{day}</span>
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayEvents.map((e, idx) => (
                    <span
                      key={idx}
                      className={clsx(
                        "w-1.5 h-1.5 rounded-full",
                        selected ? "bg-white" : EVENT_COLORS[e.type]
                      )}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-border">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary-500" />
          <span className="text-xs text-text-muted">Class</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-warning-500" />
          <span className="text-xs text-text-muted">Test</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success-500" />
          <span className="text-xs text-text-muted">Holiday</span>
        </div>
      </div>
    </div>
  );
}
