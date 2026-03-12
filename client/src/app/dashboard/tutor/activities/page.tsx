"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, Clock, MapPin } from "lucide-react";
import { loadFromStorage, saveToStorage, generateId } from "@/lib/storage";
import { Activity } from "@/types";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

const SEED: Activity[] = [
  { id:"a1", title:"Republic Day Holiday", type:"Holiday",  date:"2026-01-26", description:"Institute will remain closed on account of Republic Day." },
  { id:"a2", title:"Parent-Teacher Meeting",type:"Event",   date:"2026-02-10", description:"Quarterly progress review with parents for Batch A & B." },
  { id:"a3", title:"JEE Mock Test Series", type:"Test",     date:"2026-02-20", description:"Full syllabus mock test 1 for JEE Advanced batch." },
  { id:"a4", title:"Science Exhibition",   type:"Activity", date:"2026-03-05", description:"Annual science exhibition. Participation mandatory for Class 9 & 10." },
  { id:"a5", title:"Holi Holiday",         type:"Holiday",  date:"2026-03-24", description:"Institute will remain closed for Holi festival." },
];

const TYPES: Activity["type"][] = ["Holiday","Event","Activity","Test"];

const TYPE_COLORS: Record<Activity["type"], { light: string; border: string; icon: string }> = {
  Holiday:  { light:"bg-danger-50",   border:"border-danger-200",   icon:"bg-danger-100 text-danger-600" },
  Event:    { light:"bg-primary-50",  border:"border-primary-200",  icon:"bg-primary-100 text-primary-600" },
  Activity: { light:"bg-success-50",  border:"border-success-200",  icon:"bg-success-100 text-success-600" },
  Test:     { light:"bg-warning-50",  border:"border-warning-200",  icon:"bg-warning-100 text-warning-600" },
};

const BLANK: Omit<Activity,"id"> = {
  title:"", type:"Event", date: new Date().toISOString().split("T")[0], description:""
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [modalOpen, setModal]       = useState(false);
  const [form, setForm]             = useState<Omit<Activity,"id">>(BLANK);
  const [deleteId, setDeleteId]     = useState<string|null>(null);

  useEffect(() => {
    const stored = loadFromStorage<Activity[]>("activities", []);
    setActivities(stored.length ? stored : SEED);
    if (!stored.length) saveToStorage("activities", SEED);
  }, []);

  const persist = (data: Activity[]) => {
    // Keep activities sorted by date closely matched
    const sorted = [...data].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setActivities(sorted);
    saveToStorage("activities", sorted);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    persist([...activities, { ...form, id: generateId() }]);
    setModal(false);
  };

  // Group activities by Month Year (e.g., "March 2026")
  const grouped = activities.reduce((acc, curr) => {
    const d = new Date(curr.date);
    const month = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(curr);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Calendar size={20} className="text-primary-500"/> Calendar & Activities
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Manage holidays, tests, and events</p>
        </div>
        <button onClick={() => { setForm(BLANK); setModal(true); }} className="btn-primary">
          <Plus size={16}/> Add Event
        </button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="page-card py-16 text-center flex flex-col items-center gap-3">
          <Calendar size={48} className="text-surface-border"/>
          <p className="text-sm text-text-primary font-semibold">No planned activities</p>
          <p className="text-xs text-text-muted max-w-sm mx-auto">Your schedule looks empty. Click above to add some upcoming events or holidays.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([month, acts]) => (
            <div key={month}>
              <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest border-b border-surface-border pb-2 mb-4">
                {month}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {acts.map(a => {
                  const day = new Date(a.date).getDate().toString().padStart(2,"0");
                  const dName = new Date(a.date).toLocaleString('en-US', { weekday: 'short' });
                  const style = TYPE_COLORS[a.type];

                  return (
                    <div key={a.id} className={clsx("relative page-card !p-0 border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-card-hover group", style.border)}>
                      {/* Left color bar */}
                      <div className={clsx("absolute left-0 top-0 bottom-0 w-1.5", style.icon.split(" ")[0])} />

                      <div className="flex items-start gap-4 p-5">
                        {/* Date Cube */}
                        <div className={clsx("w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-white/50 shadow-sm", style.icon)}>
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{dName}</span>
                          <span className="text-xl font-black">{day}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <span className={clsx("text-[10px] font-bold uppercase tracking-widest mb-1 block", style.icon.split(" ")[1])}>{a.type}</span>
                          <h3 className="text-sm font-bold text-text-primary leading-tight mb-1 truncate">{a.title}</h3>
                          <p className="text-xs text-text-muted line-clamp-2">{a.description || "No description provided."}</p>
                        </div>
                      </div>

                      {/* Hover action overlay */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {deleteId === a.id ? (
                          <div className="flex gap-1 bg-white p-1 rounded-lg shadow-sm border border-surface-border">
                            <button onClick={()=> {persist(activities.filter(x=>x.id!==a.id)); setDeleteId(null);}} className="text-xs px-2 bg-danger-500 text-white rounded">Yes</button>
                            <button onClick={()=>setDeleteId(null)} className="text-xs px-2 bg-surface-muted text-text-muted rounded">No</button>
                          </div>
                        ) : (
                          <button onClick={()=>setDeleteId(a.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm border border-surface-border text-text-muted hover:text-danger-500 hover:bg-danger-50 transition-colors">
                            <Trash2 size={14}/>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={modalOpen} title="Add Event / Holiday" onClose={()=>setModal(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Title</label>
            <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Navratri Holiday or Mock Test" className="input-field"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Type</label>
              <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value as Activity["type"]}))} className="input-field">
                {TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Date</label>
              <input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} className="input-field"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Description</label>
            <textarea rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Event details..." className="input-field resize-none"/>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={()=>setModal(false)} className="px-4 py-2 text-sm border border-surface-border rounded-xl hover:bg-surface-muted">Cancel</button>
            <button onClick={handleSave} disabled={!form.title.trim()} className="btn-primary disabled:opacity-50">Add to Calendar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
