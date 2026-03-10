import { Palmtree, Plus, Calendar } from "lucide-react";

const events = [
  { date: "Mar 15", day: "Sun", name: "Holi",                     type: "Holiday",   color: "bg-success-100 text-success-600 border-success-200" },
  { date: "Mar 20", day: "Fri", name: "Parent-Teacher Meeting",   type: "Activity",  color: "bg-primary-100 text-primary-600 border-primary-200" },
  { date: "Mar 25", day: "Wed", name: "Unit Test – All Batches",  type: "Test",      color: "bg-warning-100 text-warning-600 border-warning-200" },
  { date: "Apr 01", day: "Wed", name: "Annual Day",               type: "Activity",  color: "bg-danger-100 text-danger-600 border-danger-200" },
  { date: "Apr 05", day: "Sun", name: "Ram Navami",               type: "Holiday",   color: "bg-success-100 text-success-600 border-success-200" },
  { date: "Apr 14", day: "Tue", name: "Dr. Ambedkar Jayanti",     type: "Holiday",   color: "bg-success-100 text-success-600 border-success-200" },
  { date: "Apr 18", day: "Sat", name: "Science Exhibition",       type: "Activity",  color: "bg-primary-100 text-primary-600 border-primary-200" },
  { date: "Apr 25", day: "Sat", name: "Final Term Tests Begin",   type: "Test",      color: "bg-warning-100 text-warning-600 border-warning-200" },
];

export default function ActivitiesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Palmtree size={22} className="text-primary-500" />
            Activities & Holidays
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Manage academic calendar and holiday schedule</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Add Event
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {["Holiday", "Activity", "Test"].map((t) => {
          const e = events.find(ev => ev.type === t);
          return (
            <div key={t} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${e?.color.split(" ")[0]}`} />
              <span className="text-xs text-text-muted font-medium">{t}</span>
            </div>
          );
        })}
      </div>

      <div className="page-card space-y-3">
        {events.map((e, i) => (
          <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${e.color}`}>
            <div className="flex flex-col items-center text-center w-12 flex-shrink-0">
              <Calendar size={16} className="mb-1 opacity-60" />
              <p className="text-xs font-bold leading-tight">{e.date.split(" ")[1]}</p>
              <p className="text-xs opacity-70">{e.date.split(" ")[0]}</p>
            </div>
            <div className="w-px h-10 bg-current opacity-20" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{e.name}</p>
              <p className="text-xs opacity-70 mt-0.5">{e.day}</p>
            </div>
            <span className="badge bg-white/60 text-current text-xs">{e.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
