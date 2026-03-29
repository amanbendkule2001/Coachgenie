"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, X, Users } from "lucide-react";
import { getAll, createOne, updateOne, deleteOne } from "@/lib/storage";
import { showToast } from "@/components/ui/Toast";
import { Student } from "@/types";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

const BLANK: Omit<Student, "id"> = {
  name: "", email: "", phone: "", course: "", batch: "",
  feeStatus: "Pending", status: "Active", score: 0, joinDate: new Date().toISOString().split("T")[0],
};

const FEE_COLORS: Record<Student["feeStatus"], string> = {
  Paid:    "bg-success-50 text-success-600 border-success-200",
  Pending: "bg-warning-50 text-warning-600 border-warning-200",
  Overdue: "bg-danger-50  text-danger-600  border-danger-200",
  Partial: "bg-primary-50 text-primary-600 border-primary-200",
};
const STATUS_COLORS: Record<Student["status"], string> = {
  Active:   "bg-success-50 text-success-600",
  "At Risk":"bg-danger-50  text-danger-600",
  Inactive: "bg-surface-muted text-text-muted",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]   = useState<Student | null>(null);
  const [form, setForm]         = useState<Omit<Student, "id">>(BLANK);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAll("students");
        setStudents(data);
      } catch {
        showToast("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() =>
    students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    ), [students, search]);

  const openAdd = () => { setEditing(null); setForm(BLANK); setModalOpen(true); };

  const openEdit = (s: Student) => {
    setEditing(s);
    const { id: _id, ...rest } = s;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.course.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateOne("students", Number(editing.id), form);
        setStudents(prev => prev.map(s => s.id === editing.id ? updated : s));
      } else {
        const created = await createOne("students", form);
        setStudents(prev => [...prev, created]);
      }
      setModalOpen(false);
    } catch {
      showToast("Failed to save student. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOne("students", Number(id));
      setStudents(prev => prev.filter(s => s.id !== id));
      setDeleteId(null);
    } catch {
      showToast("Failed to delete student. Please try again.");
    }
  };

  const f = (field: keyof typeof form, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Users size={20} className="text-primary-500" /> Students
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{students.length} enrolled students</p>
        </div>
        <button id="add-student-btn" onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Search */}
      <div className="page-card !p-3 flex items-center gap-2">
        <Search size={16} className="text-text-muted ml-1" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, course or email…"
          className="flex-1 bg-transparent text-sm text-text-primary focus:outline-none placeholder:text-text-muted"
        />
        {search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={14} className="text-text-muted hover:text-text-primary" /></button>}
      </div>

      {/* Table */}
      <div className="page-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["Student", "Contact", "Course / Batch", "Fee Status", "Score", "Status", "Actions"].map(h => (
                  <th key={h} className="table-header first:pl-6 last:pr-6 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-text-muted animate-pulse">Loading students…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-text-muted">No students found.</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className="hover:bg-surface-muted transition-colors">
                  <td className="table-cell pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{s.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{s.name}</p>
                        <p className="text-xs text-text-muted">Joined {s.joinDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <p className="text-sm text-text-primary">{s.email}</p>
                    <p className="text-xs text-text-muted">{s.phone}</p>
                  </td>
                  <td className="table-cell">
                    <p className="text-sm text-text-primary font-medium">{s.course}</p>
                    <p className="text-xs text-text-muted">{s.batch}</p>
                  </td>
                  <td className="table-cell">
                    <span className={clsx("badge border", FEE_COLORS[s.feeStatus])}>{s.feeStatus}</span>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm font-semibold text-text-primary">{s.score}%</span>
                  </td>
                  <td className="table-cell">
                    <span className={clsx("badge", STATUS_COLORS[s.status])}>{s.status}</span>
                  </td>
                  <td className="table-cell pr-6">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(s)} title="Edit student" className="p-1.5 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary-500 transition-colors">
                        <Pencil size={14} />
                      </button>
                      {deleteId === s.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(s.id)} className="text-xs px-2 py-1 bg-danger-500 text-white rounded-lg">Yes</button>
                          <button onClick={() => setDeleteId(null)} className="text-xs px-2 py-1 bg-surface-muted text-text-muted rounded-lg">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteId(s.id)} title="Delete student" className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} title={editing ? "Edit Student" : "Add New Student"} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          {([["Full Name", "name", "text"], ["Email", "email", "email"], ["Phone", "phone", "tel"]] as const).map(([label, key, type]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">{label}</label>
              <input type={type} value={form[key as keyof typeof form] as string}
                onChange={e => f(key, e.target.value)}
                placeholder={label}
                className="input-field" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Course</label>
              <input value={form.course} onChange={e => f("course", e.target.value)} placeholder="e.g. JEE Mains" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Batch</label>
              <input value={form.batch} onChange={e => f("batch", e.target.value)} placeholder="e.g. Batch A" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Fee Status</label>
              <select value={form.feeStatus} onChange={e => f("feeStatus", e.target.value)} aria-label="Fee Status" className="input-field">
                {(["Paid","Pending","Overdue","Partial"] as const).map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Status</label>
              <select value={form.status} onChange={e => f("status", e.target.value)} aria-label="Student Status" className="input-field">
                {(["Active","At Risk","Inactive"] as const).map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Score (%)</label>
              <input type="number" min={0} max={100} value={form.score}
                onChange={e => f("score", Number(e.target.value))} placeholder="0-100" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Join Date</label>
              <input type="date" value={form.joinDate} onChange={e => f("joinDate", e.target.value)} title="Join Date" className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-text-secondary border border-surface-border rounded-xl hover:bg-surface-muted transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!form.name.trim() || !form.course.trim() || saving} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Student"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
