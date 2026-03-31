"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar } from "lucide-react";
import { getAll, createOne, deleteOne } from "@/lib/storage";
import { showToast } from "@/components/ui/Toast";
import { Activity } from "@/types";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

const TYPES: Activity["type"][] = ["Holiday", "Event", "Activity", "Test"];

const TYPE_COLORS: Record<Activity["type"], { light: string; border: string; icon: string }> = {
    Holiday: { light: "bg-danger-50", border: "border-danger-200", icon: "bg-danger-100 text-danger-600" },
    Event: { light: "bg-primary-50", border: "border-primary-200", icon: "bg-primary-100 text-primary-600" },
    Activity: { light: "bg-success-50", border: "border-success-200", icon: "bg-success-100 text-success-600" },
    Test: { light: "bg-warning-50", border: "border-warning-200", icon: "bg-warning-100 text-warning-600" },
};

const BLANK: Omit<Activity, "id"> = {
    title: "",
    type: "Event",
    date: new Date().toISOString().split("T")[0],
    description: "",
};

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModal] = useState(false);
    const [form, setForm] = useState<Omit<Activity, "id">>(BLANK);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [saving, setSaving] = useState(false);

    // ── Load activities ─────────────────────────────────────────────
    useEffect(() => {
        getAll("activities")
            .then((data = []) => {
                const sorted = [...data].sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                setActivities(sorted);
            })
            .finally(() => setLoading(false));
    }, []);

    // ── Create ─────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!form.title.trim()) return;

        setSaving(true);
        try {
            const created = await createOne("activities", {
                title: form.title,
                type: form.type,
                date: form.date,
                description: form.description,
            });

            // ✅ FIXED: Use backend response directly
            setActivities((prev) =>
                [...prev, created].sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                )
            );

            setModal(false);
            setForm(BLANK);
        } catch (err) {
            console.error("Create Activity Error:", err); // ✅ FIXED
            showToast("Failed to save activity. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ─────────────────────────────────────────────────────
    const handleDelete = async (id: string | number) => {
        try {
            await deleteOne("activities", id as number);
            setActivities((prev) => prev.filter((a) => a.id !== id));
            setDeleteId(null);
        } catch (err) {
            console.error("Delete Activity Error:", err); // ✅ FIXED
            showToast("Failed to delete activity. Please try again.");
        }
    };

    // ── Group by Month ─────────────────────────────────────────────
    const grouped = activities.reduce((acc, curr) => {
        const d = new Date(curr.date);
        const month = d.toLocaleString("en-US", { month: "long", year: "numeric" });
        if (!acc[month]) acc[month] = [];
        acc[month].push(curr);
        return acc;
    }, {} as Record<string, Activity[]>);

    // ── Render ─────────────────────────────────────────────────────
    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <Calendar size={20} className="text-primary-500" /> Calendar & Activities
                    </h1>
                    <p className="text-sm text-text-muted mt-0.5">Manage holidays, tests, and events</p>
                </div>
                <button onClick={() => { setForm(BLANK); setModal(true); }} className="btn-primary">
                    <Plus size={16} /> Add Event
                </button>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="page-card py-16 text-center">
                    <p className="text-sm text-text-muted animate-pulse">Loading activities…</p>
                </div>
            ) : Object.keys(grouped).length === 0 ? (
                <div className="page-card py-16 text-center flex flex-col items-center gap-3">
                    <Calendar size={48} className="text-surface-border" />
                    <p className="text-sm text-text-primary font-semibold">No planned activities</p>
                    <p className="text-xs text-text-muted max-w-sm mx-auto">
                        Your schedule looks empty. Click above to add some upcoming events or holidays.
                    </p>
                </div>
            ) : (
                <div className="space-y-10">
                    {Object.entries(grouped).map(([month, acts]) => (
                        <div key={month}>
                            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest border-b border-surface-border pb-2 mb-4">
                                {month}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {acts.map((a) => {
                                    const day = new Date(a.date).getDate().toString().padStart(2, "0");
                                    const dName = new Date(a.date).toLocaleString("en-US", { weekday: "short" });
                                    const style = TYPE_COLORS[a.type] ?? TYPE_COLORS["Event"];

                                    return (
                                        <div
                                            key={a.id}
                                            className={clsx(
                                                "relative page-card !p-0 border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-card-hover group",
                                                style.border
                                            )}
                                        >
                                            <div className={clsx("absolute left-0 top-0 bottom-0 w-1.5", style.icon.split(" ")[0])} />

                                            <div className="flex items-start gap-4 p-5">
                                                <div className={clsx("w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-white/50 shadow-sm", style.icon)}>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{dName}</span>
                                                    <span className="text-xl font-black">{day}</span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <span className={clsx("text-[10px] font-bold uppercase tracking-widest mb-1 block", style.icon.split(" ")[1])}>
                                                        {a.type}
                                                    </span>
                                                    <h3 className="text-sm font-bold text-text-primary leading-tight mb-1 truncate">{a.title}</h3>
                                                    <p className="text-xs text-text-muted line-clamp-2">{a.description || "No description provided."}</p>
                                                </div>
                                            </div>

                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {deleteId === a.id ? (
                                                    <div className="flex gap-1 bg-[var(--surface-card)] p-1 rounded-lg shadow-sm border border-surface-border">
                                                        <button onClick={() => handleDelete(a.id)} className="text-xs px-2 bg-danger-500 text-white rounded">Yes</button>
                                                        <button onClick={() => setDeleteId(null)} className="text-xs px-2 bg-surface-muted text-text-muted rounded">No</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteId(a.id)}
                                                        title="Delete activity"
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--surface-card)] shadow-sm border border-surface-border text-text-muted hover:text-danger-500 hover:bg-danger-50 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
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

            {/* Modal */}
            <Modal isOpen={modalOpen} title="Add Event / Holiday" onClose={() => setModal(false)}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Title</label>
                        <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="input-field" placeholder="Enter event title" title="Event title" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Type</label>
                            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Activity["type"] }))} className="input-field" title="Event type">
                                {TYPES.map((t) => <option key={t}>{t}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Date</label>
                            <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="input-field" title="Event date" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input-field" placeholder="Enter event description" title="Event description" />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={() => setModal(false)}>Cancel</button>
                        <button onClick={handleSave} disabled={!form.title.trim() || saving}>
                            {saving ? "Saving…" : "Add to Calendar"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
