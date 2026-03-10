import { CreditCard, Plus, IndianRupee, CheckCircle, AlertTriangle, Clock } from "lucide-react";

const payments = [
  { id: 1, student: "Ananya Singh",   batch: "Batch B", amount: 8000,  paid: 8000,  date: "Mar 01", status: "Paid" },
  { id: 2, student: "Rajesh Kumar",   batch: "Batch A", amount: 8000,  paid: 3000,  date: "Feb 10", status: "Overdue" },
  { id: 3, student: "Priya Sharma",   batch: "Batch C", amount: 10000, paid: 10000, date: "Mar 05", status: "Paid" },
  { id: 4, student: "Suresh Patel",   batch: "Batch A", amount: 8000,  paid: 5000,  date: "Mar 03", status: "Partial" },
  { id: 5, student: "Ravi Sharma",    batch: "Batch A", amount: 8000,  paid: 8000,  date: "Feb 28", status: "Paid" },
  { id: 6, student: "Meena Joshi",    batch: "Batch B", amount: 8000,  paid: 0,     date: "—",      status: "Pending" },
  { id: 7, student: "Arjun Verma",    batch: "Batch C", amount: 10000, paid: 10000, date: "Mar 02", status: "Paid" },
];

const statusMap: Record<string, { label: string; cls: string; icon: typeof CheckCircle }> = {
  Paid:     { label: "Paid",     cls: "bg-success-100 text-success-600", icon: CheckCircle },
  Overdue:  { label: "Overdue",  cls: "bg-danger-100 text-danger-600",   icon: AlertTriangle },
  Partial:  { label: "Partial",  cls: "bg-warning-100 text-warning-600", icon: Clock },
  Pending:  { label: "Pending",  cls: "bg-surface-muted text-text-muted", icon: Clock },
};

const totalCollected = payments.reduce((s, p) => s + p.paid, 0);
const totalPending   = payments.reduce((s, p) => s + (p.amount - p.paid), 0);

export default function FeesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <CreditCard size={22} className="text-primary-500" />
            Fees & Payments
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Track fee collection and payment status</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Record Payment
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="page-card flex items-center gap-4 border-l-4 border-l-success-500">
          <div className="w-11 h-11 bg-success-100 rounded-xl flex items-center justify-center">
            <IndianRupee size={20} className="text-success-600" />
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wide">Collected</p>
            <p className="text-xl font-bold text-success-600">₹{totalCollected.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <div className="page-card flex items-center gap-4 border-l-4 border-l-danger-500">
          <div className="w-11 h-11 bg-danger-100 rounded-xl flex items-center justify-center">
            <AlertTriangle size={20} className="text-danger-500" />
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wide">Pending</p>
            <p className="text-xl font-bold text-danger-600">₹{totalPending.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <div className="page-card flex items-center gap-4 border-l-4 border-l-primary-500">
          <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center">
            <CheckCircle size={20} className="text-primary-500" />
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wide">Paid Students</p>
            <p className="text-xl font-bold text-primary-600">{payments.filter(p => p.status === "Paid").length} / {payments.length}</p>
          </div>
        </div>
      </div>

      {/* Payment table */}
      <div className="page-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header text-left rounded-l-lg">Student</th>
              <th className="table-header text-left">Batch</th>
              <th className="table-header text-right">Total Fee</th>
              <th className="table-header text-right">Paid</th>
              <th className="table-header text-right">Balance</th>
              <th className="table-header text-left">Date</th>
              <th className="table-header text-left rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const s = statusMap[p.status];
              const Icon = s.icon;
              return (
                <tr key={p.id} className="hover:bg-surface-muted/50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{p.student.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-text-primary">{p.student}</span>
                    </div>
                  </td>
                  <td className="table-cell"><span className="badge bg-primary-50 text-primary-600">{p.batch}</span></td>
                  <td className="table-cell text-right font-medium">₹{p.amount.toLocaleString("en-IN")}</td>
                  <td className="table-cell text-right text-success-600 font-semibold">₹{p.paid.toLocaleString("en-IN")}</td>
                  <td className="table-cell text-right text-danger-600 font-semibold">₹{(p.amount - p.paid).toLocaleString("en-IN")}</td>
                  <td className="table-cell text-text-muted text-xs">{p.date}</td>
                  <td className="table-cell">
                    <span className={`badge flex items-center gap-1 ${s.cls}`}>
                      <Icon size={11} /> {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
