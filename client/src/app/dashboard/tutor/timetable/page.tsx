"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Pencil } from "lucide-react";
import { getAll, createOne, updateOne, deleteOne } from "@/lib/storage";
import { showToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

interface TimetableSlot {
  id: number;
  day: string;
  subject: string;
  start_time: string;
  end_time: string;
  class_type: string;
  location: string;
  course?: number | null;
  student?: number | null;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_SLOTS = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const SLOT_COLORS = [
  "bg-primary-500/20 border-primary-500/30 text-primary-400",
  "bg-success-500/20 border-success-500/30 text-success-400",
  "bg-warning-500/20 border-warning-500/30 text-warning-500",
  "bg-danger-500/20 border-danger-500/30 text-danger-400",
  "bg-purple-500/20 border-purple-500/30 text-purple-400",
  "bg-cyan-500/20 border-cyan-500/30 text-cyan-400",
];

const BLANK = {
  day: "Monday",
  subject: "",
  start_time: "",
  end_time: "",
  class_type: "Lecture",
  location: "",
};

function to12Hour(time: string) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function TimetablePage() {
  const [slots, setSlots]       = useState<TimetableSlot[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [modalOpen, setModal]   = useState(false);
  const [editing, setEditing]   = useState<TimetableSlot | null>(null);
  const [form, setForm]         = useState(BLANK);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAll("timetable");
        setSlots(data);
      } catch {
        showToast("Failed to load timetable. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openAdd = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (slot: TimetableSlot) => {
    setEditing(slot);
    setForm({
      day: slot.day,
      subject: slot.subject,
      start_time: slot.start_time,
      end_time: slot.end_time || "",
      class_type: slot.class_type,
      location: slot.location || "",
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.subject.trim() || !form.start_time) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateOne("timetable", editing.id, form);
        setSlots(prev => prev.map(s => s.id === editing.id ? updated : s));
      } else {
        const created = await createOne("timetable", form);
        setSlots(prev => [...prev, created]);
      }
      setModal(false);
    } catch {
      showToast("Failed to save timetable slot. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOne("timetable", id);
      setSlots(prev => prev.filter(s => s.id !== id));
      setDeleteId(null);
    } catch {
      showToast("Failed to delete slot. Please try again.");
    }
  };

  // Build a lookup: day -> start_time -> slot
  const slotsByDayTime: Record<string, Record<string, TimetableSlot>> = {};
  slots.forEach((s, idx) => {
    const timeLabel = to12Hour(s.start_time);
    if (!slotsByDayTime[s.day]) slotsByDayTime[s.day] = {};
    slotsByDayTime[s.day][timeLabel] = s;
  });

  const getColor = (id: number) => SLOT_COLORS[id % SLOT_COLORS.length];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Calendar size={22} className="text-primary-500" />
            Weekly Timetable
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{slots.length} classes scheduled</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Class
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-sm text-text-muted animate-pulse">Loading timetable…</div>
      ) : (
        <div className="page-card overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="table-header text-left rounded-l-lg w-24">Time</th>
                {DAYS.map((d) => (
                  <th key={d} className="table-header text-center">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot) => (
                <tr key={slot} className="border-b border-surface-border/50 hover:bg-surface-muted/30 transition-colors">
                  <td className="px-4 py-3 text-xs font-semibold text-text-muted whitespace-nowrap">{slot}</td>
                  {DAYS.map((day) => {
                    const cls = slotsByDayTime[day]?.[slot];
                    return (
                      <td key={day} className="px-2 py-2 text-center">
                        {cls ? (
                          <div className={clsx("rounded-xl border px-2 py-2 text-left group relative", getColor(cls.id))}>
                            <p className="text-xs font-semibold leading-tight">{cls.subject}</p>
                            <p className="text-xs opacity-70 mt-0.5">{cls.class_type}</p>
                            <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
                              <button onClick={() => openEdit(cls)} className="p-0.5 rounded hover:bg-white/20">
                                <Pencil size={10} />
                              </button>
                              {deleteId === cls.id ? (
                                <>
                                  <button onClick={() => handleDelete(cls.id)} className="p-0.5 rounded bg-danger-500 text-white text-[10px] px-1">Y</button>
                                  <button onClick={() => setDeleteId(null)} className="p-0.5 rounded hover:bg-white/20 text-[10px]">N</button>
                                </>
                              ) : (
                                <button onClick={() => setDeleteId(cls.id)} className="p-0.5 rounded hover:bg-white/20">
                                  <Trash2 size={10} />
                                </button>
                              )}
                            </div>
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
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} title={editing ? "Edit Class" : "Add New Class"} onClose={() => setModal(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Day</label>
              <select value={form.day} onChange={e => setForm(p => ({ ...p, day: e.target.value }))} className="input-field">
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Class Type</label>
              <select value={form.class_type} onChange={e => setForm(p => ({ ...p, class_type: e.target.value }))} className="input-field">
                {["Lecture", "Tutorial", "Lab", "Test", "Revision"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Subject</label>
              <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. JEE Mathematics" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Start Time</label>
              <input type="time" value={form.start_time} onChange={e => setForm(p => ({ ...p, start_time: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">End Time</label>
              <input type="time" value={form.end_time} onChange={e => setForm(p => ({ ...p, end_time: e.target.value }))} className="input-field" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Location</label>
              <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Room 101" className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm border border-surface-border rounded-xl hover:bg-surface-muted">Cancel</button>
            <button onClick={handleSave} disabled={!form.subject.trim() || !form.start_time || saving} className="btn-primary disabled:opacity-50">
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Class"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
