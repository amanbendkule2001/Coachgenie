import { Award, Plus, Download, CheckCircle } from "lucide-react";

const certs = [
  { id: 1, student: "Ananya Singh",  course: "JEE Mathematics",   date: "Mar 05", grade: "A+", status: "Issued" },
  { id: 2, student: "Ravi Sharma",   course: "JEE Mathematics",   date: "Mar 05", grade: "A+", status: "Issued" },
  { id: 3, student: "Priya Sharma",  course: "NEET Biology",      date: "Feb 28", grade: "A",  status: "Issued" },
  { id: 4, student: "Arjun Verma",   course: "JEE Physics",       date: "Feb 25", grade: "B+", status: "Issued" },
  { id: 5, student: "Meena Joshi",   course: "Board Chemistry",   date: "—",      grade: "—",  status: "Pending" },
  { id: 6, student: "Suresh Patel",  course: "Crash Course",      date: "—",      grade: "—",  status: "Pending" },
];

export default function CertificatesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Award size={22} className="text-primary-500" />
            Certificates
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Issue completion certificates to students</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Issue Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certs.map((c) => (
          <div key={c.id} className="page-card hover:shadow-card-hover transition-shadow duration-200">
            {/* Gold accent bar */}
            <div className={`h-1.5 -mx-6 -mt-6 mb-5 rounded-t-2xl ${c.status === "Issued" ? "bg-gradient-to-r from-yellow-400 to-amber-500" : "bg-surface-border"}`} />

            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${c.status === "Issued" ? "bg-yellow-50" : "bg-surface-muted"}`}>
                <Award size={20} className={c.status === "Issued" ? "text-yellow-500" : "text-text-muted"} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{c.student}</p>
                <p className="text-xs text-text-muted mt-0.5">{c.course}</p>
                <div className="flex items-center gap-2 mt-2">
                  {c.status === "Issued" ? (
                    <>
                      <span className="badge bg-success-100 text-success-600 flex items-center gap-1">
                        <CheckCircle size={10} /> Issued
                      </span>
                      <span className="badge bg-yellow-100 text-yellow-700">Grade: {c.grade}</span>
                      <span className="text-xs text-text-muted">{c.date}</span>
                    </>
                  ) : (
                    <span className="badge bg-surface-muted text-text-muted">Pending</span>
                  )}
                </div>
              </div>
              {c.status === "Issued" && (
                <button className="w-8 h-8 bg-surface-muted rounded-xl flex items-center justify-center hover:bg-primary-50 hover:text-primary-500 transition-colors flex-shrink-0">
                  <Download size={14} className="text-text-muted" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
