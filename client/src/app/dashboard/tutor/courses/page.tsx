"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, BookOpen, Users, ChevronDown, ChevronUp, BarChart2 } from "lucide-react";
import { loadFromStorage, saveToStorage, generateId } from "@/lib/storage";
import { Course } from "@/types";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

const SEED: Course[] = [
  { id: "c1", title: "JEE Mains 2026",    subject: "Physics & Math",   description: "Complete JEE Mains preparation covering all chapters.", batch: "Batch A", duration: "6 months", totalStudents: 32, materialsCount: 14, progress: 65, status: "Active",    startDate: "2026-01-01" },
  { id: "c2", title: "NEET Prep 2026",     subject: "Biology & Chem",   description: "Full syllabus NEET preparation course.",                batch: "Batch B", duration: "8 months", totalStudents: 28, materialsCount: 20, progress: 45, status: "Active",    startDate: "2026-01-15" },
  { id: "c3", title: "JEE Advanced 2026",  subject: "Advanced Physics", description: "Advanced JEE preparation with mock tests.",             batch: "Batch A", duration: "4 months", totalStudents: 18, materialsCount: 8,  progress: 25, status: "Active",    startDate: "2026-02-01" },
  { id: "c4", title: "Board Booster XI",   subject: "All Subjects",     description: "Class 11 board exam preparation course.",               batch: "Batch C", duration: "5 months", totalStudents: 40, materialsCount: 30, progress: 80, status: "Active",    startDate: "2025-09-01" },
  { id: "c5", title: "Foundation IX–X",    subject: "Math & Science",   description: "Foundation course for Class 9-10 students.",            batch: "Batch D", duration: "10 months",totalStudents: 22, materialsCount: 0,  progress: 0,  status: "Upcoming",  startDate: "2026-04-01" },
];

const BLANK: Omit<Course, "id"> = {
  title: "", subject: "", description: "", batch: "", duration: "",
  totalStudents: 0, materialsCount: 0, progress: 0, status: "Active",
  startDate: new Date().toISOString().split("T")[0],
};

const GRAD = ["from-blue-500 to-primary-600","from-purple-500 to-pink-500","from-green-500 to-teal-500","from-orange-500 to-red-500","from-cyan-500 to-blue-500","from-rose-500 to-pink-600"];
const STATUS_COLORS: Record<Course["status"], string> = {
  Active:    "bg-success-50 text-success-600",
  Upcoming:  "bg-warning-50 text-warning-600",
  Completed: "bg-surface-muted text-text-muted",
};

export default function CoursesPage() {
  const [courses, setCourses]     = useState<Course[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState<Omit<Course,"id">>(BLANK);
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  useEffect(() => {
    const stored = loadFromStorage<Course[]>("courses", []);
    setCourses(stored.length ? stored : SEED);
    if (!stored.length) saveToStorage("courses", SEED);
  }, []);

  const persist = (data: Course[]) => { setCourses(data); saveToStorage("courses", data); };

  const handleSave = () => {
    if (!form.title.trim() || !form.subject.trim()) return;
    persist([...courses, { ...form, id: generateId() }]);
    setModalOpen(false);
    setForm(BLANK);
  };

  const handleDelete = (id: string) => { persist(courses.filter(c => c.id !== id)); setDeleteId(null); };

  const f = (field: keyof typeof form, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <BookOpen size={20} className="text-primary-500" /> Courses
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{courses.length} batches managed</p>
        </div>
        <button onClick={() => { setForm(BLANK); setModalOpen(true); }} className="btn-primary">
          <Plus size={16} /> New Course
        </button>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map((c, i) => (
          <div key={c.id} className="page-card !p-0 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
            {/* Gradient Header */}
            <div className={clsx("bg-gradient-to-r h-2", GRAD[i % GRAD.length])} />
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-text-primary leading-snug">{c.title}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{c.subject}</p>
                </div>
                <span className={clsx("badge text-xs flex-shrink-0", STATUS_COLORS[c.status])}>{c.status}</span>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1"><Users size={12} />{c.totalStudents} Students</span>
                <span className="flex items-center gap-1"><BookOpen size={12} />{c.materialsCount} Files</span>
                <span>{c.duration}</span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-text-muted">Progress</span>
                  <span className="font-semibold text-text-primary">{c.progress}%</span>
                </div>
                <div className="w-full bg-surface-muted rounded-full h-2">
                  <div className={clsx("h-2 rounded-full bg-gradient-to-r transition-all duration-500", GRAD[i % GRAD.length])}
                    style={{ width: `${c.progress}%` }} />
                </div>
              </div>

              {/* Expand details */}
              <button onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                className="w-full flex items-center justify-between text-xs text-primary-500 hover:text-primary-700 font-medium transition-colors pt-1 border-t border-surface-border">
                <span>{expanded === c.id ? "Hide details" : "View details"}</span>
                {expanded === c.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {expanded === c.id && (
                <div className="animate-fade-in space-y-2 pt-1">
                  <p className="text-xs text-text-secondary">{c.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-surface-muted rounded-lg p-2">
                      <p className="text-text-muted">Batch</p>
                      <p className="font-semibold text-text-primary">{c.batch}</p>
                    </div>
                    <div className="bg-surface-muted rounded-lg p-2">
                      <p className="text-text-muted">Start Date</p>
                      <p className="font-semibold text-text-primary">{c.startDate}</p>
                    </div>
                  </div>
                  {/* Delete */}
                  {deleteId === c.id ? (
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => handleDelete(c.id)} className="flex-1 py-1.5 text-xs bg-danger-500 text-white rounded-lg">Confirm Delete</button>
                      <button onClick={() => setDeleteId(null)} className="flex-1 py-1.5 text-xs bg-surface-muted text-text-muted rounded-lg">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteId(c.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-danger-500 hover:bg-danger-50 border border-danger-200 rounded-lg transition-colors">
                      <Trash2 size={12} /> Delete Course
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add placeholder card */}
        <button onClick={() => { setForm(BLANK); setModalOpen(true); }}
          className="page-card !p-0 border-2 border-dashed border-surface-border hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-200 min-h-[180px] flex flex-col items-center justify-center gap-3 group">
          <div className="w-12 h-12 bg-surface-muted rounded-2xl flex items-center justify-center group-hover:bg-primary-50 transition-colors">
            <Plus size={22} className="text-text-muted group-hover:text-primary-500 transition-colors" />
          </div>
          <p className="text-sm font-semibold text-text-muted group-hover:text-primary-500 transition-colors">Create New Course</p>
        </button>
      </div>

      {/* Add Course Modal */}
      <Modal isOpen={modalOpen} title="Create New Course" onClose={() => setModalOpen(false)} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Course Title</label>
              <input value={form.title} onChange={e => f("title", e.target.value)} placeholder="e.g. JEE Mains 2026" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Subject</label>
              <input value={form.subject} onChange={e => f("subject", e.target.value)} placeholder="e.g. Physics & Math" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Batch</label>
              <input value={form.batch} onChange={e => f("batch", e.target.value)} placeholder="e.g. Batch A" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Duration</label>
              <input value={form.duration} onChange={e => f("duration", e.target.value)} placeholder="e.g. 6 months" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Status</label>
              <select value={form.status} onChange={e => f("status", e.target.value)} className="input-field">
                {(["Active","Upcoming","Completed"] as const).map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => f("startDate", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Progress (%)</label>
              <input type="number" min={0} max={100} value={form.progress} onChange={e => f("progress", Number(e.target.value))} className="input-field" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Description</label>
              <textarea rows={3} value={form.description} onChange={e => f("description", e.target.value)}
                placeholder="Brief course description…" className="input-field resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-text-secondary border border-surface-border rounded-xl hover:bg-surface-muted">Cancel</button>
            <button onClick={handleSave} disabled={!form.title.trim()} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              <BarChart2 size={15} /> Create Course
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
