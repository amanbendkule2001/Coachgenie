"use client";

import { useState, useEffect } from "react";
import { Plus, MessageSquare, Trash2, Pencil, Phone, Mail, ChevronDown } from "lucide-react";
import { getAll, createOne, updateOne, deleteOne } from "@/lib/storage";
import { Enquiry } from "@/types";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

const STAGES: Enquiry["stage"][] = ["New","Contacted","Interested","Converted","Rejected"];

const STAGE_COLORS: Record<Enquiry["stage"], string> = {
  New:        "bg-primary-500/20 text-primary-400 border-primary-500/30",
  Contacted:  "bg-warning-500/20 text-warning-500 border-warning-500/30",
  Interested: "bg-success-500/20 text-success-400 border-success-500/30",
  Converted:  "bg-success-500/30 text-success-300 border-success-500/40",
  Rejected:   "bg-surface-muted text-text-muted border-surface-border",
};

const BLANK: Omit<Enquiry,"id"> = {
  name:"", phone:"", email:"", interestedCourse:"", stage:"New", source:"", notes:"", date: new Date().toISOString().split("T")[0]
};

const stageCounts = (list: Enquiry[]) =>
  STAGES.map(s => ({ stage: s, count: list.filter(e => e.stage === s).length }));

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [modalOpen, setModal]     = useState(false);
  const [editing, setEditing]     = useState<Enquiry|null>(null);
  const [form, setForm]           = useState<Omit<Enquiry,"id">>(BLANK);
  const [deleteId, setDeleteId]   = useState<string|null>(null);
  const [filterStage, setFilter]  = useState<Enquiry["stage"]|"all">("all");

  useEffect(() => {
    (async () => {
      try {
        const data = await getAll("enquiries");
        setEnquiries(data);
      } catch {
        alert("Failed to load enquiries. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openAdd  = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (e: Enquiry) => { setEditing(e); const {id:_,...rest}=e; setForm(rest); setModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      // Map frontend field names to Django field names
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        subject: form.interestedCourse,
        stage: form.stage,
        source: form.source,
        notes: form.notes,
        follow_up: form.date,
      };
      if (editing) {
        const updated = await updateOne("enquiries", Number(editing.id), payload);
        setEnquiries(prev => prev.map(e => e.id === editing.id ? { ...e, ...updated } : e));
      } else {
        const created = await createOne("enquiries", payload);
        setEnquiries(prev => [created, ...prev]);
      }
      setModal(false);
    } catch {
      alert("Failed to save enquiry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateStage = async (id: string, stage: Enquiry["stage"]) => {
    try {
      const updated = await updateOne("enquiries", Number(id), { stage });
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
    } catch {
      alert("Failed to update stage. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOne("enquiries", Number(id));
      setEnquiries(prev => prev.filter(e => e.id !== id));
      setDeleteId(null);
    } catch {
      alert("Failed to delete enquiry. Please try again.");
    }
  };

  const filtered = filterStage==="all" ? enquiries : enquiries.filter(e=>e.stage===filterStage);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2"><MessageSquare size={20} className="text-primary-500"/>Enquiries</h1>
          <p className="text-sm text-text-muted">{enquiries.length} leads in pipeline</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus size={16}/>Add Enquiry</button>
      </div>

      {/* Stage summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stageCounts(enquiries).map(({stage,count}) => (
          <button key={stage} onClick={() => setFilter(filterStage===stage ? "all" : stage)}
            className={clsx("stat-card !p-4 flex-col items-center text-center cursor-pointer transition-all",
              filterStage===stage ? "ring-2 ring-primary-400 shadow-card-hover" : "")}>
            <p className={clsx("text-2xl font-bold", STAGE_COLORS[stage].split(" ")[1])}>{count}</p>
            <span className={clsx("badge border mt-1 text-xs", STAGE_COLORS[stage])}>{stage}</span>
          </button>
        ))}
      </div>

      {/* Enquiry cards */}
      <div className="space-y-3">
        {loading && <p className="text-center py-10 text-sm text-text-muted animate-pulse">Loading enquiries…</p>}
        {!loading && filtered.length===0 && <p className="text-center py-10 text-sm text-text-muted">No enquiries in this stage.</p>}
        {filtered.map(e => (
          <div key={e.id} className="page-card">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{e.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-primary">{e.name}</p>
                  <p className="text-xs text-text-muted truncate">{e.phone} · {e.email}</p>
                  <p className="text-xs text-text-secondary mt-0.5">Interested in: <span className="font-medium">{e.interestedCourse}</span></p>
                </div>
              </div>

              {/* Stage dropdown */}
              <div className="relative">
                <select value={e.stage} onChange={ev => updateStage(e.id, ev.target.value as Enquiry["stage"])}
                  className={clsx("badge border pr-6 appearance-none cursor-pointer bg-[var(--surface-card)]", STAGE_COLORS[e.stage])}>
                  {STAGES.map(s=><option key={s} className="bg-[var(--surface-card)] text-[var(--text-primary)]">{s}</option>)}
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"/>
              </div>

              <div className="flex items-center gap-1.5">
                <a href={`tel:${e.phone}`} className="p-2 rounded-xl bg-success-50 text-success-600 hover:bg-success-100 transition-colors"><Phone size={14}/></a>
                <a href={`mailto:${e.email}`} className="p-2 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"><Mail size={14}/></a>
                <button onClick={()=>openEdit(e)} className="p-2 rounded-xl hover:bg-surface-muted text-text-muted hover:text-text-primary transition-colors"><Pencil size={14}/></button>
                {deleteId===e.id ? (
                  <>
                    <button onClick={()=>handleDelete(e.id)} className="text-xs px-2 py-1 bg-danger-500 text-white rounded-lg">Yes</button>
                    <button onClick={()=>setDeleteId(null)} className="text-xs px-2 py-1 bg-surface-muted text-text-muted rounded-lg">No</button>
                  </>
                ) : (
                  <button onClick={()=>setDeleteId(e.id)} className="p-2 rounded-xl hover:bg-danger-50 text-text-muted hover:text-danger-500 transition-colors"><Trash2 size={14}/></button>
                )}
              </div>
            </div>
            {e.notes && <p className="text-xs text-text-muted mt-3 pt-3 border-t border-surface-border">📝 {e.notes} · {e.source} · {e.date}</p>}
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} title={editing?"Edit Enquiry":"New Enquiry"} onClose={()=>setModal(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Full Name</label>
            <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Arjun Singh" className="input-field"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Phone</label>
              <input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="10-digit number" className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="email@example.com" className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Interested Course</label>
              <input value={form.interestedCourse} onChange={e=>setForm(p=>({...p,interestedCourse:e.target.value}))} placeholder="e.g. JEE Mains" className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Source</label>
              <input value={form.source} onChange={e=>setForm(p=>({...p,source:e.target.value}))} placeholder="e.g. Instagram" className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Stage</label>
              <select value={form.stage} onChange={e=>setForm(p=>({...p,stage:e.target.value as Enquiry["stage"]}))} className="input-field">
                {STAGES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Date</label>
              <input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} className="input-field"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Notes</label>
            <textarea rows={2} value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Any notes…" className="input-field resize-none"/>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={()=>setModal(false)} className="px-4 py-2 text-sm border border-surface-border rounded-xl hover:bg-surface-muted">Cancel</button>
            <button onClick={handleSave} disabled={!form.name.trim() || saving} className="btn-primary disabled:opacity-50">{saving ? "Saving…" : editing?"Save":"Add Enquiry"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
