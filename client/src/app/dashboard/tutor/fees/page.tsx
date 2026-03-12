"use client";

import { useState, useEffect } from "react";
import { Plus, CreditCard, Trash2, CheckCircle, AlertCircle, Clock, Pencil } from "lucide-react";
import { loadFromStorage, saveToStorage, generateId } from "@/lib/storage";
import { Payment } from "@/types";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";

const SEED: Payment[] = [
  { id:"p1", studentId:"s1", studentName:"Aarav Mehta",   course:"JEE Mains 2026",   batch:"Batch A", totalAmount:36000, paidAmount:36000, status:"Paid",    dueDate:"2026-01-10", lastPaidDate:"2026-01-08" },
  { id:"p2", studentId:"s2", studentName:"Priya Sharma",  course:"NEET Prep 2026",   batch:"Batch B", totalAmount:42000, paidAmount:0,     status:"Overdue",  dueDate:"2026-02-01", lastPaidDate:"—" },
  { id:"p3", studentId:"s3", studentName:"Ravi Kumar",    course:"JEE Advanced 2026",batch:"Batch A", totalAmount:50000, paidAmount:50000, status:"Paid",    dueDate:"2026-02-01", lastPaidDate:"2026-01-28" },
  { id:"p4", studentId:"s4", studentName:"Sneha Patel",   course:"NEET Prep 2026",   batch:"Batch C", totalAmount:42000, paidAmount:21000, status:"Partial",  dueDate:"2026-03-01", lastPaidDate:"2026-02-10" },
  { id:"p5", studentId:"s5", studentName:"Dev Kapoor",    course:"JEE Mains 2026",   batch:"Batch B", totalAmount:36000, paidAmount:0,     status:"Pending",  dueDate:"2026-03-15", lastPaidDate:"—" },
];

const BLANK: Omit<Payment,"id"> = {
  studentId:"", studentName:"", course:"", batch:"", totalAmount:0, paidAmount:0, status:"Pending", dueDate:new Date().toISOString().split("T")[0], lastPaidDate:"—"
};

const STATUS_CFG: Record<Payment["status"], { color: string; icon: React.ReactNode }> = {
  Paid:    { color:"bg-success-50 text-success-600 border-success-200", icon:<CheckCircle size={12}/> },
  Unpaid:  { color:"bg-surface-muted text-text-muted border-surface-border", icon:<Clock size={12}/> },
  Pending: { color:"bg-warning-50 text-warning-600 border-warning-200",  icon:<Clock size={12}/> },
  Overdue: { color:"bg-danger-50 text-danger-600 border-danger-200",     icon:<AlertCircle size={12}/> },
  Partial: { color:"bg-primary-50 text-primary-600 border-primary-200",  icon:<Clock size={12}/> },
};

export default function FeesPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [modalOpen, setModal]   = useState(false);
  const [editing, setEditing]   = useState<Payment|null>(null);
  const [form, setForm]         = useState<Omit<Payment,"id">>(BLANK);
  const [deleteId, setDeleteId] = useState<string|null>(null);

  useEffect(() => {
    const stored = loadFromStorage<Payment[]>("payments", []);
    setPayments(stored.length ? stored : SEED);
    if (!stored.length) saveToStorage("payments", SEED);
  }, []);

  const persist = (data: Payment[]) => { setPayments(data); saveToStorage("payments", data); };

  const openAdd  = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (p: Payment) => { setEditing(p); const {id:_,...rest}=p; setForm(rest); setModal(true); };

  const handleSave = () => {
    if (!form.studentName.trim() || !form.course.trim()) return;
    if (editing) {
      persist(payments.map(p => p.id === editing.id ? {...form, id:editing.id} : p));
    } else {
      persist([...payments, {...form, id:generateId()}]);
    }
    setModal(false);
  };

  const totals = {
    collected: payments.filter(p=>p.status==="Paid").reduce((a,p)=>a+p.paidAmount,0),
    pending:   payments.filter(p=>["Pending","Overdue","Partial"].includes(p.status)).reduce((a,p)=>a+(p.totalAmount-p.paidAmount),0),
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
              <tr>{["Student","Course / Batch","Total Fee","Paid","Balance","Due Date","Status",""].map(h=>(
                <th key={h} className="table-header first:pl-6 last:pr-6 whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-surface-muted transition-colors">
                  <td className="table-cell pl-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{p.studentName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</span>
                      </div>
                      <p className="text-sm font-semibold text-text-primary whitespace-nowrap">{p.studentName}</p>
                    </div>
                  </td>
                  <td className="table-cell"><p className="text-sm text-text-primary">{p.course}</p><p className="text-xs text-text-muted">{p.batch}</p></td>
                  <td className="table-cell"><span className="text-sm font-semibold text-text-primary">{fmt(p.totalAmount)}</span></td>
                  <td className="table-cell"><span className="text-sm text-success-600 font-medium">{fmt(p.paidAmount)}</span></td>
                  <td className="table-cell">
                    <span className={clsx("text-sm font-semibold", p.totalAmount-p.paidAmount>0?"text-danger-600":"text-success-600")}>
                      {fmt(p.totalAmount-p.paidAmount)}
                    </span>
                  </td>
                  <td className="table-cell"><span className="text-sm text-text-muted whitespace-nowrap">{p.dueDate}</span></td>
                  <td className="table-cell">
                    <span className={clsx("badge border flex items-center gap-1", STATUS_CFG[p.status].color)}>
                      {STATUS_CFG[p.status].icon}{p.status}
                    </span>
                  </td>
                  <td className="table-cell pr-6">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary-500"><Pencil size={13}/></button>
                      {deleteId===p.id ? (
                        <div className="flex gap-1">
                          <button onClick={()=>{persist(payments.filter(x=>x.id!==p.id));setDeleteId(null);}} className="text-xs px-1.5 py-0.5 bg-danger-500 text-white rounded">Yes</button>
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

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} title={editing?"Edit Payment":"Record Payment"} onClose={()=>setModal(false)} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Student Name</label>
              <input value={form.studentName} onChange={e=>setForm(p=>({...p,studentName:e.target.value}))} placeholder="e.g. Aarav Mehta" className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Course</label>
              <input value={form.course} onChange={e=>setForm(p=>({...p,course:e.target.value}))} placeholder="e.g. JEE Mains" className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Batch</label>
              <input value={form.batch} onChange={e=>setForm(p=>({...p,batch:e.target.value}))} placeholder="e.g. Batch A" className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Total Amount (₹)</label>
              <input type="number" min={0} value={form.totalAmount} onChange={e=>setForm(p=>({...p,totalAmount:Number(e.target.value)}))} className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Amount Paid (₹)</label>
              <input type="number" min={0} max={form.totalAmount} value={form.paidAmount} onChange={e=>setForm(p=>({...p,paidAmount:Number(e.target.value)}))} className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Status</label>
              <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value as Payment["status"]}))} className="input-field">
                {(["Paid","Unpaid","Pending","Overdue","Partial"] as const).map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))} className="input-field"/>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={()=>setModal(false)} className="px-4 py-2 text-sm border border-surface-border rounded-xl hover:bg-surface-muted">Cancel</button>
            <button onClick={handleSave} disabled={!form.studentName.trim()} className="btn-primary disabled:opacity-50">{editing?"Save Changes":"Record"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
