"use client";

import { useState, useEffect } from "react";
import { Plus, ClipboardList, Trash2, CheckCircle, Clock } from "lucide-react";
import { loadFromStorage, saveToStorage, generateId } from "@/lib/storage";
import { Test, Student } from "@/types";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

const SEED: Test[] = [
  { id: "t1", testName: "Physics Unit Test 1", course: "JEE Mains 2026",   batch: "Batch A", date: "2026-02-20", maxMarks: 100, status: "Completed",
    studentMarks: [
      { studentId:"s1", studentName:"Aarav Mehta",  marks: 87 },
      { studentId:"s3", studentName:"Ravi Kumar",   marks: 92 },
    ]},
  { id: "t2", testName: "Biology Mock Test",   course: "NEET Prep 2026",   batch: "Batch B", date: "2026-03-15", maxMarks: 180, status: "Upcoming",
    studentMarks: [
      { studentId:"s2", studentName:"Priya Sharma", marks: null },
      { studentId:"s4", studentName:"Sneha Patel",  marks: null },
    ]},
];

const BLANK = { testName:"", course:"", batch:"", date: new Date().toISOString().split("T")[0], maxMarks: 100, status: "Upcoming" as Test["status"], studentMarks:[] };

export default function TestsPage() {
  const [tests, setTests]       = useState<Test[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTest, setActive] = useState<Test | null>(null);
  const [modalOpen, setModal]   = useState(false);
  const [form, setForm]         = useState(BLANK);
  const [deleteId, setDeleteId] = useState<string|null>(null);

  useEffect(() => {
    const t = loadFromStorage<Test[]>("tests", []);
    const s = loadFromStorage<Student[]>("students", []);
    setTests(t.length ? t : SEED);
    setStudents(s);
    if (!t.length) saveToStorage("tests", SEED);
  }, []);

  const persist = (data: Test[]) => { setTests(data); saveToStorage("tests", data); };

  const handleCreate = () => {
    if (!form.testName.trim()) return;
    // Auto-populate students from the course/batch if available
    const relevant = students.filter(s => s.batch === form.batch || s.course === form.course);
    const marks = relevant.length
      ? relevant.map(s => ({ studentId: s.id, studentName: s.name, marks: null }))
      : [];
    persist([{ ...form, id: generateId(), studentMarks: marks }, ...tests]);
    setModal(false);
    setForm(BLANK);
  };

  const updateMark = (testId: string, studentId: string, val: string) => {
    const updated = tests.map(t =>
      t.id === testId
        ? { ...t, studentMarks: t.studentMarks.map(sm =>
            sm.studentId === studentId ? { ...sm, marks: val === "" ? null : Number(val) } : sm
          )}
        : t
    );
    persist(updated);
    setActive(updated.find(t => t.id === testId) ?? null);
  };

  const addStudentToTest = (test: Test) => {
    const name = prompt("Enter student name:");
    if (!name?.trim()) return;
    const sm = [...test.studentMarks, { studentId: generateId(), studentName: name.trim(), marks: null }];
    const updated = tests.map(t => t.id === test.id ? { ...t, studentMarks: sm } : t);
    persist(updated);
    setActive(updated.find(t => t.id === test.id) ?? null);
  };

  const avg = (t: Test) => {
    const scored = t.studentMarks.filter(sm => sm.marks !== null);
    if (!scored.length) return null;
    return Math.round(scored.reduce((a, sm) => a + (sm.marks ?? 0), 0) / scored.length);
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Test list */}
        <div className="lg:col-span-2 space-y-3">
          {tests.map(t => {
            const average = avg(t);
            return (
              <div key={t.id}
                onClick={() => setActive(active?.id === t.id ? null : t)}
                className={clsx("page-card cursor-pointer transition-all duration-200 hover:shadow-card-hover",
                  activeTest?.id === t.id ? "ring-2 ring-primary-400 shadow-card-hover" : "")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary truncate">{t.testName}</p>
                    <p className="text-xs text-text-muted mt-0.5">{t.course} · {t.batch}</p>
                    <p className="text-xs text-text-muted">{t.date} · Max: {t.maxMarks}</p>
                  </div>
                  <span className={clsx("badge flex-shrink-0", t.status === "Completed" ? "bg-success-50 text-success-600" : "bg-warning-50 text-warning-600")}>
                    {t.status === "Completed" ? <CheckCircle size={10} className="inline mr-1"/> : <Clock size={10} className="inline mr-1"/>}{t.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-border">
                  <span className="text-xs text-text-muted">{t.studentMarks.length} students</span>
                  <span className="text-xs font-semibold text-text-primary">
                    Avg: {average !== null ? `${average}/${t.maxMarks}` : "—"}
                  </span>
                </div>
                {deleteId === t.id ? (
                  <div className="flex gap-2 mt-2" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { persist(tests.filter(x => x.id !== t.id)); setDeleteId(null); setActive(null); }}
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
                  <h2 className="text-base font-bold text-text-primary">{activeTest.testName}</h2>
                  <p className="text-xs text-text-muted">Max Marks: {activeTest.maxMarks}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => addStudentToTest(activeTest)} className="text-xs px-3 py-1.5 border border-primary-200 text-primary-600 rounded-xl hover:bg-primary-50">+ Student</button>
                  <button onClick={() => {
                    const updated = tests.map(t => t.id === activeTest.id ? { ...t, status: "Completed" as Test["status"] } : t);
                    persist(updated); setActive(updated.find(t => t.id === activeTest.id) ?? null);
                  }} className="text-xs px-3 py-1.5 bg-success-50 border border-success-200 text-success-600 rounded-xl hover:bg-success-100">Mark Complete</button>
                </div>
              </div>
              {activeTest.studentMarks.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-8">No students added. Click "+ Student" to add.</p>
              ) : (
                <div className="space-y-2">
                  {activeTest.studentMarks.map(sm => (
                    <div key={sm.studentId} className="flex items-center gap-3 p-3 bg-surface-muted rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{sm.studentName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</span>
                      </div>
                      <span className="flex-1 text-sm font-medium text-text-primary">{sm.studentName}</span>
                      <input
                        type="number" min={0} max={activeTest.maxMarks}
                        value={sm.marks ?? ""}
                        onChange={e => updateMark(activeTest.id, sm.studentId, e.target.value)}
                        placeholder="—"
                        className="w-20 text-center input-field !py-1.5 !text-sm"
                      />
                      <span className="text-xs text-text-muted">/{activeTest.maxMarks}</span>
                      {sm.marks !== null && (
                        <span className={clsx("text-xs font-semibold w-10 text-right",
                          sm.marks/activeTest.maxMarks >= 0.7 ? "text-success-600" : sm.marks/activeTest.maxMarks >= 0.4 ? "text-warning-600" : "text-danger-600")}>
                          {Math.round(sm.marks/activeTest.maxMarks*100)}%
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

      {/* Create Test Modal */}
      <Modal isOpen={modalOpen} title="Create New Test" onClose={() => setModal(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Test Name</label>
            <input value={form.testName} onChange={e => setForm(p=>({...p, testName:e.target.value}))} placeholder="e.g. Physics Unit Test 1" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Course</label>
              <input value={form.course} onChange={e => setForm(p=>({...p, course:e.target.value}))} placeholder="e.g. JEE Mains" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Batch</label>
              <input value={form.batch} onChange={e => setForm(p=>({...p, batch:e.target.value}))} placeholder="e.g. Batch A" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(p=>({...p, date:e.target.value}))} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Max Marks</label>
              <input type="number" min={1} value={form.maxMarks} onChange={e => setForm(p=>({...p, maxMarks:Number(e.target.value)}))} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm border border-surface-border rounded-xl hover:bg-surface-muted">Cancel</button>
            <button onClick={handleCreate} disabled={!form.testName.trim()} className="btn-primary disabled:opacity-50">Create Test</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
