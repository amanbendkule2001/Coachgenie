"use client";

import { useState, useEffect } from "react";
import { Plus, CreditCard, Trash2, CheckCircle, AlertCircle, Clock, Pencil } from "lucide-react";
import { getAll, createOne, updateOne, deleteOne } from "@/lib/storage";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

interface Fee {
  id: number;
  student: number;
  student_name?: string;
  course: number | null;
  course_title?: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue" | "Partial";
  due_date: string;
  paid_date: string | null;
  method: string;
  description: string;
  receipt_no: string;
}

interface Student {
  id: number;
  name: string;
  course?: string;
}

const STATUS_CFG: Record<Fee["status"], { color: string; icon: React.ReactNode }> = {
  Paid:    { color:"bg-success-50 text-success-600 border-success-200", icon:<CheckCircle size={12}/> },
  Pending: { color:"bg-warning-50 text-warning-600 border-warning-200",  icon:<Clock size={12}/> },
  Overdue: { color:"bg-danger-50 text-danger-600 border-danger-200",     icon:<AlertCircle size={12}/> },
  Partial: { color:"bg-primary-50 text-primary-600 border-primary-200",  icon:<Clock size={12}/> },
};

const BLANK_ADD = {
  student: "",
  amount: 0,
  due_date: new Date().toISOString().split("T")[0],
  status: "Pending" as Fee["status"],
  method: "",
  description: "",
};

const BLANK_EDIT = {
  status: "Paid" as Fee["status"],
  paid_date: new Date().toISOString().split("T")[0],
  method: "",
};

export default function FeesPage() {
  const [payments, setPayments]   = useState<Fee[]>([]);
  const [students, setStudents]   = useState<Student[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [modalOpen, setModal]     = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editing, setEditing]     = useState<Fee | null>(null);
  const [addForm, setAddForm]     = useState(BLANK_ADD);
  const [editForm, setEditForm]   = useState(BLANK_EDIT);
  const [deleteId, setDeleteId]   = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [feesData, studentsData] = await Promise.all([
          getAll("fees"),
          getAll("students"),
        ]);
        setPayments(feesData);
        setStudents(studentsData);
      } catch {
        alert("Failed to load fees. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openAdd  = () => { setAddForm(BLANK_ADD); setModal(true); };
  const openEdit = (p: Fee) => { setEditing(p); setEditForm({ status: p.status, paid_date: p.paid_date ?? new Date().toISOString().split("T")[0], method: p.method ?? "" }); setEditModal(true); };

  const handleAdd = async () => {
    if (!addForm.student || !addForm.amount) return;
    setSaving(true);
    try {
      const created = await createOne("fees", {
        student: Number(addForm.student),
        amount: addForm.amount,
        due_date: addForm.due_date,
        status: addForm.status,
        method: addForm.method,
        description: addForm.description,
      });
      setPayments(prev => [...prev, created]);
      setModal(false);
    } catch {
      alert("Failed to record payment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const updated = await updateOne("fees", editing.id, editForm);
      setPayments(prev => prev.map(p => p.id === editing.id ? updated : p));
      setEditModal(false);
      setEditing(null);
    } catch {
      alert("Failed to update payment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOne("fees", id);
      setPayments(prev => prev.filter(p => p.id !== id));
      setDeleteId(null);
    } catch {
      alert("Failed to delete payment record. Please try again.");
    }
  };

  const totals = {
    collected: payments.filter(p=>p.status==="Paid").reduce((a,p)=>a+p.amount,0),
    pending:   payments.filter(p=>["Pending","Overdue","Partial"].includes(p.status)).reduce((a,p)=>a+p.amount,0),
    students:  payments.filter(p=>p.status==="Paid").length,
  };

  const fmt = (n:number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2"><CreditCard size={20} className="text-primary-500"/>Fees & Payments</h1>
          <p className="text-sm text-text-muted mt-0.5">{payments.length} payment records</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus size={16}/>Record Payment</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label:"Total Collected", value:fmt(totals.collected), color:"border-l-success-500", badge:"bg-success-50 text-success-600" },
          { label:"Total Pending",   value:fmt(totals.pending),   color:"border-l-danger-500",  badge:"bg-danger-50 text-danger-600" },
          { label:"Fully Paid",      value:`${totals.students} Students`, color:"border-l-primary-500", badge:"bg-primary-50 text-primary-600" },
        ].map(c => (
          <div key={c.label} className={clsx("stat-card border-l-4", c.color)}>
            <div className={clsx("stat-icon-box", c.badge)}><CreditCard size={20}/></div>
            <div><p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">{c.label}</p>
              <p className="text-xl font-bold text-text-primary">{c.value}</p></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="page-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>{["Student","Course","Amount","Due Date","Paid Date","Status",""].map(h=>(
                <th key={h} className="table-header first:pl-6 last:pr-6 whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-text-muted animate-pulse">Loading payments…</td></tr>
              ) : payments.map(p => (
                <tr key={p.id} className="hover:bg-surface-muted transition-colors">
                  <td className="table-cell pl-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{(p.student_name ?? "?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</span>
                      </div>
                      <p className="text-sm font-semibold text-text-primary whitespace-nowrap">{p.student_name ?? `Student #${p.student}`}</p>
                    </div>
                  </td>
                  <td className="table-cell"><p className="text-sm text-text-primary">{p.course_title ?? "—"}</p></td>
                  <td className="table-cell"><span className="text-sm font-semibold text-text-primary">{fmt(p.amount)}</span></td>
                  <td className="table-cell"><span className="text-sm text-text-muted whitespace-nowrap">{p.due_date}</span></td>
                  <td className="table-cell"><span className="text-sm text-text-muted whitespace-nowrap">{p.paid_date ?? "—"}</span></td>
                  <td className="table-cell">
                    <span className={clsx("badge border flex items-center gap-1", STATUS_CFG[p.status]?.color ?? "")}>
                      {STATUS_CFG[p.status]?.icon}{p.status}
                    </span>
                  </td>
                  <td className="table-cell pr-6">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary-500"><Pencil size={13}/></button>
                      {deleteId===p.id ? (
                        <div className="flex gap-1">
                          <button onClick={()=>handleDelete(p.id)} className="text-xs px-1.5 py-0.5 bg-danger-500 text-white rounded">Yes</button>
                          <button onClick={()=>setDeleteId(null)} className="text-xs px-1.5 py-0.5 bg-surface-muted text-text-muted rounded">No</button>
                        </div>
                      ) : (
                        <button onClick={()=>setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-500"><Trash2 size={13}/></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      <Modal isOpen={modalOpen} title="Record Payment" onClose={()=>setModal(false)} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Student</label>
            <select value={addForm.student} onChange={e=>setAddForm(p=>({...p,student:e.target.value}))} className="input-field">
              <option value="">Select student…</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Amount (₹)</label>
              <input type="number" min={0} value={addForm.amount} onChange={e=>setAddForm(p=>({...p,amount:Number(e.target.value)}))} className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Status</label>
              <select value={addForm.status} onChange={e=>setAddForm(p=>({...p,status:e.target.value as Fee["status"]}))} className="input-field">
                {(["Paid","Pending","Overdue","Partial"] as const).map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Due Date</label>
              <input type="date" value={addForm.due_date} onChange={e=>setAddForm(p=>({...p,due_date:e.target.value}))} className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Method</label>
              <input value={addForm.method} onChange={e=>setAddForm(p=>({...p,method:e.target.value}))} placeholder="e.g. UPI, Cash" className="input-field"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Description</label>
            <input value={addForm.description} onChange={e=>setAddForm(p=>({...p,description:e.target.value}))} placeholder="Optional note…" className="input-field"/>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={()=>setModal(false)} className="px-4 py-2 text-sm border border-surface-border rounded-xl hover:bg-surface-muted">Cancel</button>
            <button onClick={handleAdd} disabled={!addForm.student || saving} className="btn-primary disabled:opacity-50">{saving ? "Saving…" : "Record"}</button>
          </div>
        </div>
      </Modal>

      {/* Edit (Mark as Paid) Modal */}
      <Modal isOpen={editModal} title="Update Payment Status" onClose={()=>setEditModal(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Status</label>
            <select value={editForm.status} onChange={e=>setEditForm(p=>({...p,status:e.target.value as Fee["status"]}))} className="input-field">
              {(["Paid","Pending","Overdue","Partial"] as const).map(v=><option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Paid Date</label>
            <input type="date" value={editForm.paid_date} onChange={e=>setEditForm(p=>({...p,paid_date:e.target.value}))} className="input-field"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Method</label>
            <input value={editForm.method} onChange={e=>setEditForm(p=>({...p,method:e.target.value}))} placeholder="e.g. UPI, Cash" className="input-field"/>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={()=>setEditModal(false)} className="px-4 py-2 text-sm border border-surface-border rounded-xl hover:bg-surface-muted">Cancel</button>
            <button onClick={handleEdit} disabled={saving} className="btn-primary disabled:opacity-50">{saving ? "Saving…" : "Save Changes"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
