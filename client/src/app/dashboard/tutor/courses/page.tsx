import { BookOpen, Plus, Users, Clock, ArrowUpRight } from "lucide-react";

const courses = [
  { id: 1, name: "JEE Mathematics",     batch: "Batch A", students: 28, duration: "6 months", status: "Active",   progress: 65, color: "from-primary-400 to-primary-600" },
  { id: 2, name: "NEET Biology",         batch: "Batch B", students: 22, duration: "8 months", status: "Active",   progress: 40, color: "from-success-500 to-success-600" },
  { id: 3, name: "JEE Physics",          batch: "Batch C", students: 35, duration: "6 months", status: "Active",   progress: 80, color: "from-warning-500 to-warning-600" },
  { id: 4, name: "Board Chemistry",      batch: "Batch B", students: 18, duration: "4 months", status: "Upcoming", progress: 0,  color: "from-primary-300 to-primary-500" },
  { id: 5, name: "Crash Course – Maths", batch: "Batch D", students: 42, duration: "2 months", status: "Active",   progress: 55, color: "from-danger-400 to-danger-600" },
];

const statusColors: Record<string, string> = {
  Active: "bg-success-100 text-success-600",
  Upcoming: "bg-warning-100 text-warning-600",
  Completed: "bg-surface-muted text-text-muted",
};

export default function CoursesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <BookOpen size={22} className="text-primary-500" />
            Courses & Batches
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Manage your course curriculum and batches</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div key={course.id} className="page-card hover:shadow-card-hover transition-shadow duration-200">
            {/* Gradient header */}
            <div className={`h-2 -mx-6 -mt-6 mb-5 bg-gradient-to-r ${course.color} rounded-t-2xl`} />

            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-text-primary">{course.name}</h3>
                <span className="text-xs text-text-muted">{course.batch}</span>
              </div>
              <span className={`badge ${statusColors[course.status]}`}>{course.status}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
              <div className="flex items-center gap-1.5">
                <Users size={13} className="text-text-muted" />
                <span>{course.students} students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-text-muted" />
                <span>{course.duration}</span>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs text-text-muted mb-1.5">
                <span>Progress</span>
                <span className="font-semibold text-text-primary">{course.progress}%</span>
              </div>
              <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-500`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            <button className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs text-primary-500 font-medium hover:text-primary-600 transition-colors pt-3 border-t border-surface-border">
              View Details <ArrowUpRight size={13} />
            </button>
          </div>
        ))}

        {/* Add new card */}
        <button className="page-card border-dashed border-2 border-surface-border hover:border-primary-300 flex flex-col items-center justify-center gap-3 text-text-muted hover:text-primary-500 transition-all duration-200 min-h-[200px]">
          <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center">
            <Plus size={20} />
          </div>
          <p className="text-sm font-medium">Create New Course</p>
        </button>
      </div>
    </div>
  );
}
