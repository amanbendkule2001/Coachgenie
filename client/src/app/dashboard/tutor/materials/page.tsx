"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, FileText, Upload, File, Video, Image, Download } from "lucide-react";
import { loadFromStorage, saveToStorage, generateId } from "@/lib/storage";
import { Material, Course } from "@/types";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

const SEED: Material[] = [
  { id: "m1", courseId: "c1", courseName: "JEE Mains 2026",   title: "Chapter 1 Notes - Mechanics",    fileName: "ch1_mechanics.pdf",    fileType: "PDF",      uploadDate: "2026-01-15", size: "2.3 MB" },
  { id: "m2", courseId: "c1", courseName: "JEE Mains 2026",   title: "Lecture Recording - Wave Optics", fileName: "wave_optics.mp4",      fileType: "Video",    uploadDate: "2026-01-20", size: "145 MB" },
  { id: "m3", courseId: "c2", courseName: "NEET Prep 2026",    title: "Biology Diagrams Sheet",          fileName: "bio_diagrams.pdf",     fileType: "PDF",      uploadDate: "2026-02-01", size: "5.1 MB" },
  { id: "m4", courseId: "c3", courseName: "JEE Advanced 2026", title: "Thermodynamics Formula Sheet",    fileName: "thermo_formulas.pdf",  fileType: "PDF",      uploadDate: "2026-02-10", size: "1.2 MB" },
  { id: "m5", courseId: "c2", courseName: "NEET Prep 2026",    title: "Anatomy Diagram - Human Heart",   fileName: "heart_diagram.png",   fileType: "Image",    uploadDate: "2026-02-15", size: "0.8 MB" },
];

const FILE_ICONS: Record<Material["fileType"], React.ReactNode> = {
  PDF:      <File  size={18} className="text-danger-500" />,
  Video:    <Video size={18} className="text-primary-500" />,
  Image:    <Image size={18} className="text-success-500" />,
  Document: <FileText size={18} className="text-warning-500" />,
};

const FILE_COLORS: Record<Material["fileType"], string> = {
  PDF:      "bg-danger-50  text-danger-600  border-danger-100",
  Video:    "bg-primary-50 text-primary-600 border-primary-100",
  Image:    "bg-success-50 text-success-600 border-success-100",
  Document: "bg-warning-50 text-warning-600 border-warning-100",
};

const BLANK = { courseId: "", courseName: "", title: "", fileName: "", fileType: "PDF" as Material["fileType"], size: "" };

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses]     = useState<Course[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState(BLANK);
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [filterCourse, setFilter] = useState("all");

  useEffect(() => {
    const m = loadFromStorage<Material[]>("materials", []);
    const c = loadFromStorage<Course[]>("courses", []);
    setMaterials(m.length ? m : SEED);
    setCourses(c);
    if (!m.length) saveToStorage("materials", SEED);
  }, []);

  const persist = (data: Material[]) => { setMaterials(data); saveToStorage("materials", data); };

  const handleSave = () => {
    if (!form.title.trim() || !form.fileName.trim()) return;
    const course = courses.find(c => c.id === form.courseId);
    const mat: Material = {
      ...form,
      id: generateId(),
      courseName: course?.title ?? form.courseId,
      uploadDate: new Date().toISOString().split("T")[0],
      size: form.size || "—",
    };
    persist([mat, ...materials]);
    setModalOpen(false);
    setForm(BLANK);
  };

  const handleDelete = (id: string) => { persist(materials.filter(m => m.id !== id)); setDeleteId(null); };

  const allCourseNames = [...new Set(materials.map(m => m.courseName))];
  const filtered = filterCourse === "all" ? materials : materials.filter(m => m.courseName === filterCourse);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <FileText size={20} className="text-primary-500" /> Materials
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{materials.length} files uploaded</p>
        </div>
        <button onClick={() => { setForm(BLANK); setModalOpen(true); }} className="btn-primary">
          <Upload size={16} /> Upload Material
        </button>
      </div>

      {/* Upload drop zone */}
      <div
        onClick={() => { setForm(BLANK); setModalOpen(true); }}
        className="page-card border-2 border-dashed border-surface-border hover:border-primary-300 hover:bg-primary-50/20 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center py-8 gap-3 group">
        <div className="w-14 h-14 bg-surface-muted rounded-2xl flex items-center justify-center group-hover:bg-primary-50 transition-colors">
          <Upload size={24} className="text-text-muted group-hover:text-primary-500 transition-colors" />
        </div>
        <p className="text-sm font-semibold text-text-muted group-hover:text-primary-500 transition-colors">Click to upload material</p>
        <p className="text-xs text-text-muted">PDF, Video, Image, Documents accepted</p>
      </div>

      {/* Course filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {["all", ...allCourseNames].map(name => (
          <button key={name} onClick={() => setFilter(name)}
            className={clsx("px-3 py-1.5 rounded-xl text-xs font-medium transition-colors", filterCourse === name ? "bg-primary-500 text-white" : "bg-surface-muted text-text-muted hover:bg-primary-50 hover:text-primary-600")}>
            {name === "all" ? "All Courses" : name}
          </button>
        ))}
      </div>

      {/* File list */}
      <div className="page-card !p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-center py-10 text-sm text-text-muted">No materials found.</p>
        ) : (
          <div className="divide-y divide-surface-border">
            {filtered.map(m => (
              <div key={m.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-muted transition-colors">
                <div className="w-10 h-10 bg-surface-muted rounded-xl flex items-center justify-center flex-shrink-0">
                  {FILE_ICONS[m.fileType]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{m.title}</p>
                  <p className="text-xs text-text-muted">{m.fileName} · {m.size} · Uploaded {m.uploadDate}</p>
                </div>
                <span className={clsx("badge border text-xs whitespace-nowrap", FILE_COLORS[m.fileType])}>{m.fileType}</span>
                <span className="text-xs text-text-muted hidden sm:block max-w-[120px] truncate">{m.courseName}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary-500 transition-colors" title="Download">
                    <Download size={14} />
                  </button>
                  {deleteId === m.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(m.id)} className="text-xs px-2 py-1 bg-danger-500 text-white rounded-lg">Del</button>
                      <button onClick={() => setDeleteId(null)} className="text-xs px-2 py-1 bg-surface-muted text-text-muted rounded-lg">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteId(m.id)} className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal isOpen={modalOpen} title="Upload Material" onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Title</label>
            <input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="e.g. Chapter 1 Notes" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">File Name</label>
            <input value={form.fileName} onChange={e => setForm(p => ({...p, fileName: e.target.value}))} placeholder="e.g. chapter1.pdf" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">File Type</label>
              <select value={form.fileType} onChange={e => setForm(p => ({...p, fileType: e.target.value as Material["fileType"]}))} className="input-field">
                {(["PDF","Video","Image","Document"] as const).map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Size</label>
              <input value={form.size} onChange={e => setForm(p => ({...p, size: e.target.value}))} placeholder="e.g. 2.3 MB" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Course</label>
            <select value={form.courseId} onChange={e => setForm(p => ({...p, courseId: e.target.value}))} className="input-field">
              <option value="">Select course…</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border border-surface-border rounded-xl hover:bg-surface-muted">Cancel</button>
            <button onClick={handleSave} disabled={!form.title.trim() || !form.fileName.trim()} className="btn-primary disabled:opacity-50">
              <Upload size={14} /> Upload
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
