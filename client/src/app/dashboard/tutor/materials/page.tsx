"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, FileText, Upload, File, Video, Image, Download } from "lucide-react";
import { getAll, deleteOne } from "@/lib/storage";
import { Course } from "@/types";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

interface Material {
  id: number;
  title: string;
  description: string;
  subject: string;
  course: number | null;
  course_title?: string;
  link: string;
  file_type: "PDF" | "Video" | "Image" | "Document";
  file?: string;
  created_at?: string;
}

const FILE_ICONS: Record<Material["file_type"], React.ReactNode> = {
  PDF:      <File  size={18} className="text-danger-500" />,
  Video:    <Video size={18} className="text-primary-500" />,
  Image:    <Image size={18} className="text-success-500" />,
  Document: <FileText size={18} className="text-warning-500" />,
};

const FILE_COLORS: Record<Material["file_type"], string> = {
  PDF:      "bg-danger-50  text-danger-600  border-danger-100",
  Video:    "bg-primary-50 text-primary-600 border-primary-100",
  Image:    "bg-success-50 text-success-600 border-success-100",
  Document: "bg-warning-50 text-warning-600 border-warning-100",
};

const BLANK = { title: "", description: "", subject: "", course: "", link: "", fileType: "PDF" as Material["file_type"] };

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses]     = useState<Course[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState(BLANK);
  const [file, setFile]           = useState<File | null>(null);
  const [deleteId, setDeleteId]   = useState<number | null>(null);
  const [filterCourse, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const [matsData, coursesData] = await Promise.all([
          getAll("materials"),
          getAll("courses"),
        ]);
        setMaterials(matsData);
        setCourses(coursesData);
      } catch {
        alert("Failed to load materials. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("subject", form.subject);
      fd.append("file_type", form.fileType);
      fd.append("link", form.link);
      if (form.course) fd.append("course", form.course);
      if (file) fd.append("file", file);

      const res = await fetch("http://localhost:8000/api/materials/", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const created = await res.json();
      setMaterials(prev => [created, ...prev]);
      setModalOpen(false);
      setForm(BLANK);
      setFile(null);
    } catch {
      alert("Failed to upload material. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOne("materials", id);
      setMaterials(prev => prev.filter(m => m.id !== id));
      setDeleteId(null);
    } catch {
      alert("Failed to delete material. Please try again.");
    }
  };

  const allCourseNames = Array.from(new Set(materials.map(m => m.course_title ?? "").filter(Boolean)));
  const filtered = filterCourse === "all" ? materials : materials.filter(m => m.course_title === filterCourse);

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
        <button onClick={() => { setForm(BLANK); setFile(null); setModalOpen(true); }} className="btn-primary">
          <Upload size={16} /> Upload Material
        </button>
      </div>

      {/* Upload drop zone */}
      <div
        onClick={() => { setForm(BLANK); setFile(null); setModalOpen(true); }}
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
        {loading ? (
          <p className="text-center py-10 text-sm text-text-muted animate-pulse">Loading materials…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-sm text-text-muted">No materials found.</p>
        ) : (
          <div className="divide-y divide-surface-border">
            {filtered.map(m => (
              <div key={m.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-muted transition-colors">
                <div className="w-10 h-10 bg-surface-muted rounded-xl flex items-center justify-center flex-shrink-0">
                  {FILE_ICONS[m.file_type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{m.title}</p>
                  <p className="text-xs text-text-muted">{m.subject} · {m.created_at?.split("T")[0] ?? ""}</p>
                </div>
                <span className={clsx("badge border text-xs whitespace-nowrap", FILE_COLORS[m.file_type])}>{m.file_type}</span>
                <span className="text-xs text-text-muted hidden sm:block max-w-[120px] truncate">{m.course_title ?? ""}</span>
                <div className="flex items-center gap-1">
                  {m.link && (
                    <a href={m.link} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary-500 transition-colors" title="Download">
                      <Download size={14} />
                    </a>
                  )}
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
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="Brief description…" className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Subject</label>
              <input value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} placeholder="e.g. Physics" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">File Type</label>
              <select value={form.fileType} onChange={e => setForm(p => ({...p, fileType: e.target.value as Material["file_type"]}))} className="input-field">
                {(["PDF","Video","Image","Document"] as const).map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Link (optional)</label>
            <input value={form.link} onChange={e => setForm(p => ({...p, link: e.target.value}))} placeholder="https://…" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Course</label>
            <select value={form.course} onChange={e => setForm(p => ({...p, course: e.target.value}))} className="input-field">
              <option value="">Select course…</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">File Upload (optional)</label>
            <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border border-surface-border rounded-xl hover:bg-surface-muted">Cancel</button>
            <button onClick={handleSave} disabled={!form.title.trim() || saving} className="btn-primary disabled:opacity-50">
              <Upload size={14} /> {saving ? "Uploading…" : "Upload"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
