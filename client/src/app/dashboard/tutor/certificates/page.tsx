"use client";

import { useState, useEffect } from "react";
import { Plus, Award, Trash2, Download, Search, CheckCircle, Clock } from "lucide-react";
import { loadFromStorage, saveToStorage, generateId } from "@/lib/storage";
import { Student } from "@/types";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  grade: string;
  issueDate: string;
  status: "Issued" | "Pending";
}

const SEED: Certificate[] = [
  { id: "cert1", studentId: "s1", studentName: "Aarav Mehta",  course: "JEE Mains 2026", grade: "A+", issueDate: "2026-01-10", status: "Issued" },
  { id: "cert2", studentId: "s3", studentName: "Ravi Kumar",   course: "JEE Advanced",   grade: "A",  issueDate: "2026-02-01", status: "Issued" },
  { id: "cert3", studentId: "s2", studentName: "Priya Sharma", course: "NEET Prep 2026", grade: "B+", issueDate: "—",        status: "Pending" },
];

const BLANK: Omit<Certificate, "id"> = {
  studentId: "", studentName: "", course: "", grade: "A", issueDate: new Date().toISOString().split("T")[0], status: "Issued",
};

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [modalOpen, setModal] = useState(false);
  const [form, setForm] = useState<Omit<Certificate, "id">>(BLANK);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const c = loadFromStorage<Certificate[]>("certificates", []);
    const s = loadFromStorage<Student[]>("students", []);
    setCerts(c.length ? c : SEED);
    setStudents(s);
    if (!c.length) saveToStorage("certificates", SEED);
  }, []);

  const persist = (data: Certificate[]) => {
    setCerts(data);
    saveToStorage("certificates", data);
  };

  const handleCreate = () => {
    if (!form.studentName.trim() || !form.course.trim()) return;
    persist([{ ...form, id: generateId() }, ...certs]);
    setModal(false);
    setForm(BLANK);
  };

  // When selecting a student from dropdown, auto-fill course
  const handleStudentSelect = (id: string) => {
    const s = students.find((x) => x.id === id);
    if (s) {
      setForm((prev) => ({ ...prev, studentId: s.id, studentName: s.name, course: s.course }));
    }
  };

  // Mark pending as issued
  const markIssued = (id: string) => {
    persist(
      certs.map((c) =>
        c.id === id ? { ...c, status: "Issued", issueDate: new Date().toISOString().split("T")[0] } : c
      )
    );
  };

  const stats = {
    total: certs.length,
    issued: certs.filter((c) => c.status === "Issued").length,
    pending: certs.filter((c) => c.status === "Pending").length,
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Award size={20} className="text-primary-500" /> Certificates
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            {stats.issued} issued • {stats.pending} pending
          </p>
        </div>
        <button onClick={() => { setForm(BLANK); setModal(true); }} className="btn-primary">
          <Plus size={16} /> Issue Certificate
        </button>
      </div>

      {certs.length === 0 ? (
        <div className="page-card text-center py-16">
          <Award size={40} className="mx-auto text-surface-border mb-3" />
          <p className="text-sm font-semibold text-text-muted">No certificates exist yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((c) => (
            <div
              key={c.id}
              className={clsx(
                "relative page-card !p-0 overflow-hidden group border",
                c.status === "Issued" ? "border-surface-border" : "border-warning-500/30 bg-warning-500/10"
              )}
            >
              {/* Decorative side bar */}
              <div
                className={clsx(
                  "absolute left-0 top-0 bottom-0 w-1",
                  c.status === "Issued" ? "bg-primary-500" : "bg-warning-500"
                )}
              />

              <div className="p-5 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-bold text-text-primary">{c.studentName}</h3>
                    <p className="text-xs text-text-muted font-medium mt-0.5">{c.course}</p>
                  </div>
                  <span
                    className={clsx(
                      "badge border flex items-center gap-1",
                      c.status === "Issued"
                        ? "bg-success-500/20 text-success-400 border-success-500/30"
                        : "bg-warning-500/20 text-warning-500 border-warning-500/30"
                    )}
                  >
                    {c.status === "Issued" ? <CheckCircle size={10} /> : <Clock size={10} />}
                    {c.status}
                  </span>
                </div>

                <div className="flex items-center gap-6 mt-4 pb-4 border-b border-surface-border">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider mb-1">
                      Grade
                    </p>
                    <p className="text-xl font-black text-text-primary">{c.grade}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider mb-1">
                      Issue Date
                    </p>
                    <p className="text-sm font-semibold text-text-primary mt-1.5">{c.issueDate}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3">
                  {c.status === "Issued" ? (
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                      <Download size={14} /> Download PDF
                    </button>
                  ) : (
                    <button
                      onClick={() => markIssued(c.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-success-600 hover:text-success-700 transition-colors bg-success-50 px-2 py-1 rounded-lg"
                    >
                      <CheckCircle size={14} /> Mark as Issued
                    </button>
                  )}

                  {deleteId === c.id ? (
                    <div className="flex items-center gap-1 bg-[var(--surface-card)] p-1 rounded-lg border border-surface-border">
                      <button
                        onClick={() => { persist(certs.filter((x) => x.id !== c.id)); setDeleteId(null); }}
                        className="text-[10px] font-bold px-2 py-1 bg-danger-500 text-white rounded"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="text-[10px] font-bold px-2 py-1 bg-surface-muted text-text-primary rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:bg-danger-50 hover:text-danger-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={modalOpen} title="Issue Certificate" onClose={() => setModal(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
              Select Student
            </label>
            <select
              onChange={(e) => handleStudentSelect(e.target.value)}
              className="input-field"
              defaultValue=""
            >
              <option value="" disabled>
                -- Choose a student --
              </option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.course})
                </option>
              ))}
            </select>
          </div>

          {!form.studentId && (
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                Or Type Name Manually
              </label>
              <input
                value={form.studentName}
                onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))}
                placeholder="e.g. Maya Gupta"
                className="input-field"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                Course String
              </label>
              <input
                value={form.course}
                onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))}
                placeholder="e.g. JEE Full Drop"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                Grade Achieved
              </label>
              <input
                value={form.grade}
                onChange={(e) => setForm((p) => ({ ...p, grade: e.target.value }))}
                placeholder="e.g. A+"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Certificate["status"] }))}
                className="input-field"
              >
                <option>Issued</option>
                <option>Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                Date
              </label>
              <input
                type="date"
                value={form.issueDate}
                onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))}
                className="input-field"
                disabled={form.status === "Pending"}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setModal(false)}
              className="px-4 py-2 text-sm border border-surface-border rounded-xl hover:bg-surface-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!form.studentName.trim() || !form.course.trim()}
              className="btn-primary disabled:opacity-50"
            >
              Create Record
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
