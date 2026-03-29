"use client";

import { useState, useEffect } from "react";
import { Plus, ClipboardList, Trash2, CheckCircle, Clock } from "lucide-react";
import { getAll, createOne, updateOne, deleteOne } from "@/lib/storage";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

interface Mark {
  id: number;
  student: number;
  student_name: string;
  marks: number | null;
  remarks: string;
}

interface Test {
  id: number;
  title: string;
  subject: string;
  date: string;
  total_marks: number;
  status: "Upcoming" | "Completed";
  notes: string;
  marks?: Mark[];
}

const BLANK = {
  title: "",
  subject: "",
  date: new Date().toISOString().split("T")[0],
  total_marks: 100,
  status: "Upcoming" as Test["status"],
  notes: "",
};

export default function TestsPage() {
  const [tests, setTests]       = useState<Test[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [activeTest, setActive] = useState<Test | null>(null);
  const [modalOpen, setModal]   = useState(false);
  const [form, setForm]         = useState(BLANK);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [savingMark, setSavingMark] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAll("tests");
        setTests(data);
      } catch {
        alert("Failed to load tests. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const created = await createOne("tests", form);
      setTests(prev => [created, ...prev]);
      setModal(false);
      setForm(BLANK);
    } catch {
      alert("Failed to create test. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOne("tests", id);
      setTests(prev => prev.filter(t => t.id !== id));
      setDeleteId(null);
      if (activeTest?.id === id) setActive(null);
    } catch {
      alert("Failed to delete test. Please try again.");
    }
  };

  const handleMarkComplete = async (test: Test) => {
    try {
      const updated = await updateOne("tests", test.id, { status: "Completed" });
      setTests(prev => prev.map(t => t.id === test.id ? { ...t, ...updated } : t));
      setActive(prev => prev?.id === test.id ? { ...prev, ...updated } : prev);
    } catch {
      alert("Failed to update test status. Please try again.");
    }
  };

  const updateMark = async (mark: Mark, val: string) => {
    const numVal = val === "" ? null : Number(val);
    setSavingMark(true);
    try {
      const updated = await updateOne("tests/marks", mark.id, { marks: numVal });
      // Update marks in local state
      setTests(prev => prev.map(t => {
        if (!t.marks) return t;
        return { ...t, marks: t.marks.map(m => m.id === mark.id ? { ...m, marks: numVal } : m) };
      }));
      setActive(prev => {
        if (!prev?.marks) return prev;
        return { ...prev, marks: prev.marks.map(m => m.id === mark.id ? { ...m, marks: numVal } : m) };
      });
    } catch {
      alert("Failed to save mark. Please try again.");
    } finally {
      setSavingMark(false);
    }
  };

  const avg = (t: Test) => {
    const scored = (t.marks ?? []).filter(m => m.marks !== null);
    if (!scored.length) return null;
    return Math.round(scored.reduce((a, m) => a + (m.marks ?? 0), 0) / scored.length);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2"><ClipboardList size={20} className="text-primary-500" /> Tests & Marks</h1>
          <p className="text-sm text-text-muted mt-0.5">{tests.length} tests created</p>
        </div>
        <button onClick={() => { setForm(BLANK); setModal(true); }} className="btn-primary"><Plus size={16} /> New Test</button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-sm text-text-muted animate-pulse">Loading tests…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Test list */}
          <div className="lg:col-span-2 space-y-3">
            {tests.map(t => {
              const average = avg(t);
              return (
                <div key={t.id}
                  onClick={() => setActive(activeTest?.id === t.id ? null : t)}
                  className={clsx("page-card cursor-pointer transition-all duration-200 hover:shadow-card-hover",
                    activeTest?.id === t.id ? "ring-2 ring-primary-400 shadow-card-hover" : "")}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">{t.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">{t.subject}</p>
                      <p className="text-xs text-text-muted">{t.date} · Max: {t.total_marks}</p>
                    </div>
                    <span className={clsx("badge flex-shrink-0", t.status === "Completed" ? "bg-success-50 text-success-600" : "bg-warning-50 text-warning-600")}>
                      {t.status === "Completed" ? <CheckCircle size={10} className="inline mr-1"/> : <Clock size={10} className="inline mr-1"/>}{t.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-border">
                    <span className="text-xs text-text-muted">{(t.marks ?? []).length} students</span>
                    <span className="text-xs font-semibold text-text-primary">
                      Avg: {average !== null ? `${average}/${t.total_marks}` : "—"}
                    </span>
                  </div>
                  {deleteId === t.id ? (
                    <div className="flex gap-2 mt-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleDelete(t.id)}
                        className="flex-1 py-1 text-xs bg-danger-500 text-white rounded-lg">Delete</button>
                      <button onClick={() => setDeleteId(null)} className="flex-1 py-1 text-xs bg-surface-muted text-text-muted rounded-lg">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={e => { e.stopPropagation(); setDeleteId(t.id); }}
                      className="w-full mt-2 flex items-center justify-center gap-1 py-1 text-xs text-danger-500 hover:bg-danger-50 rounded-lg transition-colors">
                      <Trash2 size={11} /> Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Marks entry panel */}
          <div className="lg:col-span-3">
            {activeTest ? (
              <div className="page-card space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-text-primary">{activeTest.title}</h2>
                    <p className="text-xs text-text-muted">Max Marks: {activeTest.total_marks}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleMarkComplete(activeTest)} className="text-xs px-3 py-1.5 bg-success-50 border border-success-200 text-success-600 rounded-xl hover:bg-success-100">Mark Complete</button>
                  </div>
                </div>
                {!activeTest.marks || activeTest.marks.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-8">No student marks available.</p>
                ) : (
                  <div className="space-y-2">
                    {activeTest.marks.map(sm => (
                      <div key={sm.id} className="flex items-center gap-3 p-3 bg-surface-muted rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{sm.student_name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</span>
                        </div>
                        <span className="flex-1 text-sm font-medium text-text-primary">{sm.student_name}</span>
                        <input
                          type="number" min={0} max={activeTest.total_marks}
                          value={sm.marks ?? ""}
                          onChange={e => updateMark(sm, e.target.value)}
                          disabled={savingMark}
                          placeholder="—"
                          className="w-20 text-center input-field !py-1.5 !text-sm"
                        />
                        <span className="text-xs text-text-muted">/{activeTest.total_marks}</span>
                        {sm.marks !== null && (
                          <span className={clsx("text-xs font-semibold w-10 text-right",
                            sm.marks/activeTest.total_marks >= 0.7 ? "text-success-600" : sm.marks/activeTest.total_marks >= 0.4 ? "text-warning-600" : "text-danger-600")}>
                            {Math.round(sm.marks/activeTest.total_marks*100)}%
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="page-card flex flex-col items-center justify-center text-center py-16 gap-3">
                <ClipboardList size={36} className="text-surface-border" />
                <p className="text-sm font-semibold text-text-muted">Select a test to enter marks</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Test Modal */}
      <Modal isOpen={modalOpen} title="Create New Test" onClose={() => setModal(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Test Title</label>
            <input value={form.title} onChange={e => setForm(p=>({...p, title:e.target.value}))} placeholder="e.g. Physics Unit Test 1" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Subject</label>
              <input value={form.subject} onChange={e => setForm(p=>({...p, subject:e.target.value}))} placeholder="e.g. Physics" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(p=>({...p, date:e.target.value}))} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Total Marks</label>
              <input type="number" min={1} value={form.total_marks} onChange={e => setForm(p=>({...p, total_marks:Number(e.target.value)}))} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Status</label>
              <select value={form.status} onChange={e => setForm(p=>({...p, status:e.target.value as Test["status"]}))} className="input-field">
                <option>Upcoming</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm(p=>({...p, notes:e.target.value}))} placeholder="Any notes…" className="input-field resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm border border-surface-border rounded-xl hover:bg-surface-muted">Cancel</button>
            <button onClick={handleCreate} disabled={!form.title.trim() || saving} className="btn-primary disabled:opacity-50">{saving ? "Saving…" : "Create Test"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
