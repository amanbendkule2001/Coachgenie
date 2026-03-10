import { Users, Search, Plus, Filter, MoreVertical, TrendingUp } from "lucide-react";

const students = [
  { id: 1, name: "Ananya Singh",   batch: "Batch B", fee: "Paid",    score: 88, status: "Active" },
  { id: 2, name: "Rajesh Kumar",   batch: "Batch A", fee: "Overdue", score: 72, status: "Active" },
  { id: 3, name: "Priya Sharma",   batch: "Batch C", fee: "Paid",    score: 91, status: "Active" },
  { id: 4, name: "Suresh Patel",   batch: "Batch A", fee: "Paid",    score: 65, status: "At Risk" },
  { id: 5, name: "Ravi Sharma",    batch: "Batch A", fee: "Paid",    score: 96, status: "Active" },
  { id: 6, name: "Meena Joshi",    batch: "Batch B", fee: "Pending", score: 78, status: "Active" },
  { id: 7, name: "Arjun Verma",    batch: "Batch C", fee: "Paid",    score: 83, status: "Active" },
  { id: 8, name: "Kavya Iyer",     batch: "Batch B", fee: "Paid",    score: 59, status: "At Risk" },
];

const feeColors: Record<string, string> = {
  Paid: "bg-success-100 text-success-600",
  Overdue: "bg-danger-100 text-danger-600",
  Pending: "bg-warning-100 text-warning-600",
};
const statusColors: Record<string, string> = {
  Active: "bg-success-100 text-success-600",
  "At Risk": "bg-danger-100 text-danger-600",
};

export default function StudentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Users size={22} className="text-primary-500" />
            Students
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Manage your student profiles and records</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Search + Filter */}
      <div className="page-card">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 bg-surface-muted border border-surface-border rounded-xl px-3 py-2.5">
            <Search size={15} className="text-text-muted" />
            <input
              type="text"
              placeholder="Search students by name or batch..."
              className="bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none w-full"
            />
          </div>
          <button className="btn-secondary">
            <Filter size={15} /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header text-left rounded-l-lg">#</th>
                <th className="table-header text-left">Name</th>
                <th className="table-header text-left">Batch</th>
                <th className="table-header text-left">Fee Status</th>
                <th className="table-header text-left">Last Score</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-right rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-surface-muted/50 transition-colors duration-150">
                  <td className="table-cell text-text-muted text-xs">{s.id}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{s.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-text-primary">{s.name}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="badge bg-primary-50 text-primary-600">{s.batch}</span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${feeColors[s.fee]}`}>{s.fee}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary">{s.score}%</span>
                      <TrendingUp size={13} className={s.score >= 75 ? "text-success-500" : "text-danger-500"} />
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${statusColors[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="table-cell text-right">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-border transition-colors ml-auto">
                      <MoreVertical size={14} className="text-text-muted" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between text-xs text-text-muted">
          <span>Showing {students.length} of 120 students</span>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-xs py-1.5 px-3">Previous</button>
            <button className="btn-primary text-xs py-1.5 px-3">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
