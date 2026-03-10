import { Calendar, Plus } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const classes: Record<string, Record<string, { subject: string; batch: string; color: string }>> = {
  Monday: {
    "9:00 AM": { subject: "JEE Mathematics", batch: "Batch A", color: "bg-primary-50 border-primary-300 text-primary-700" },
    "2:00 PM": { subject: "NEET Biology", batch: "Batch B", color: "bg-success-50 border-success-300 text-success-700" },
  },
  Tuesday: {
    "10:00 AM": { subject: "JEE Physics", batch: "Batch C", color: "bg-warning-50 border-warning-300 text-warning-700" },
    "4:00 PM": { subject: "Board Chemistry", batch: "Batch B", color: "bg-danger-50 border-danger-300 text-danger-700" },
  },
  Wednesday: {
    "9:00 AM": { subject: "Crash Course Maths", batch: "Batch D", color: "bg-primary-50 border-primary-300 text-primary-700" },
    "3:00 PM": { subject: "JEE Mathematics", batch: "Batch A", color: "bg-primary-50 border-primary-300 text-primary-700" },
  },
  Thursday: {
    "11:00 AM": { subject: "NEET Biology", batch: "Batch B", color: "bg-success-50 border-success-300 text-success-700" },
    "5:00 PM": { subject: "JEE Physics", batch: "Batch C", color: "bg-warning-50 border-warning-300 text-warning-700" },
  },
  Friday: {
    "9:00 AM": { subject: "Board Chemistry", batch: "Batch B", color: "bg-danger-50 border-danger-300 text-danger-700" },
    "2:00 PM": { subject: "Crash Course Maths", batch: "Batch D", color: "bg-primary-50 border-primary-300 text-primary-700" },
  },
  Saturday: {
    "10:00 AM": { subject: "Full Test – All Batches", batch: "All", color: "bg-surface-muted border-surface-border text-text-primary" },
  },
};

export default function TimetablePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Calendar size={22} className="text-primary-500" />
            Weekly Timetable
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Week of March 09 – 14, 2026</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Add Class
        </button>
      </div>

      <div className="page-card overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr>
              <th className="table-header text-left rounded-l-lg w-24">Time</th>
              {days.map((d) => (
                <th key={d} className="table-header text-center">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot} className="border-b border-surface-border/50 hover:bg-surface-muted/30 transition-colors">
                <td className="px-4 py-3 text-xs font-semibold text-text-muted whitespace-nowrap">{slot}</td>
                {days.map((day) => {
                  const cls = classes[day]?.[slot];
                  return (
                    <td key={day} className="px-2 py-2 text-center">
                      {cls ? (
                        <div className={`rounded-xl border px-2 py-2 text-left ${cls.color}`}>
                          <p className="text-xs font-semibold leading-tight">{cls.subject}</p>
                          <p className="text-xs opacity-70 mt-0.5">{cls.batch}</p>
                        </div>
                      ) : (
                        <div className="h-10" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
