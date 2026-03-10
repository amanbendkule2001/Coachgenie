import { ClipboardList, Plus, TrendingUp } from "lucide-react";

const tests = [
  { id: 1, name: "Math Quiz – Ch.5",    batch: "Batch A", date: "Mar 11", maxMarks: 50,  avg: 38, status: "Completed" },
  { id: 2, name: "Physics Unit Test",   batch: "Batch C", date: "Mar 13", maxMarks: 100, avg: 71, status: "Completed" },
  { id: 3, name: "Biology MCQ Set",     batch: "Batch B", date: "Mar 15", maxMarks: 50,  avg: null, status: "Upcoming" },
  { id: 4, name: "Chemistry Practical", batch: "Batch B", date: "Mar 18", maxMarks: 30,  avg: null, status: "Upcoming" },
  { id: 5, name: "Full Syllabus Test",  batch: "All",     date: "Mar 14", maxMarks: 200, avg: 142, status: "Completed" },
];

const students = [
  { name: "Ravi Sharma",  score: 48 },
  { name: "Ananya Singh", score: 42 },
  { name: "Priya Sharma", score: 45 },
  { name: "Suresh Patel", score: 28 },
  { name: "Rajesh Kumar", score: 35 },
];

export default function TestsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <ClipboardList size={22} className="text-primary-500" />
            Tests & Marks
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Create tests and record student marks</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Create Test
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tests list */}
        <div className="page-card">
          <h2 className="text-base font-semibold text-text-primary mb-4">All Tests</h2>
          <div className="space-y-3">
            {tests.map((test) => (
              <div key={test.id} className="flex items-center gap-4 p-3.5 bg-surface-muted rounded-xl hover:bg-surface-border/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{test.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{test.batch} · {test.date} · Max: {test.maxMarks}</p>
                </div>
                {test.avg !== null ? (
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-success-500" />
                    <span className="text-sm font-bold text-success-600">{test.avg}</span>
                  </div>
                ) : (
                  <span className="badge bg-warning-100 text-warning-600">Upcoming</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mark entry */}
        <div className="page-card">
          <h2 className="text-base font-semibold text-text-primary mb-1">Enter Marks</h2>
          <p className="text-xs text-text-muted mb-4">Math Quiz – Ch.5 · Batch A · Max 50</p>
          <div className="space-y-2.5">
            {students.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{s.name.charAt(0)}</span>
                </div>
                <span className="text-sm text-text-primary flex-1">{s.name}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={s.score}
                    max={50}
                    className="w-16 text-center input-field py-1.5 text-sm"
                  />
                  <span className="text-xs text-text-muted">/ 50</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary w-full justify-center mt-5">Save Marks</button>
        </div>
      </div>
    </div>
  );
}
