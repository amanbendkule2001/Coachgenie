/**
 * types/index.ts
 * ──────────────
 * All shared TypeScript interfaces for SmartEdu Tutor Dashboard.
 * Used across all CRUD pages and localStorage modules.
 */

// ── Student ──────────────────────────────────────────────────────────────────
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  batch: string;
  feeStatus: "Paid" | "Pending" | "Overdue" | "Partial";
  status: "Active" | "At Risk" | "Inactive";
  score: number;
  joinDate: string;
}

// ── Course ────────────────────────────────────────────────────────────────────
export interface Course {
  id: string;
  title: string;
  subject: string;
  description: string;
  batch: string;
  duration: string;
  totalStudents: number;
  materialsCount: number;
  progress: number;
  status: "Active" | "Upcoming" | "Completed";
  startDate: string;
}

// ── Material ─────────────────────────────────────────────────────────────────
export interface Material {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  fileName: string;
  fileType: "PDF" | "Video" | "Image" | "Document";
  uploadDate: string;
  size: string;
}

// ── Test ─────────────────────────────────────────────────────────────────────
export interface StudentMark {
  studentId: string;
  studentName: string;
  marks: number | null;
}

export interface Test {
  id: string;
  testName: string;
  course: string;
  batch: string;
  date: string;
  maxMarks: number;
  status: "Upcoming" | "Completed";
  studentMarks: StudentMark[];
}

// ── Payment ───────────────────────────────────────────────────────────────────
export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  batch: string;
  totalAmount: number;
  paidAmount: number;
  status: "Paid" | "Unpaid" | "Pending" | "Overdue" | "Partial";
  dueDate: string;
  lastPaidDate: string;
}

// ── Enquiry ───────────────────────────────────────────────────────────────────
export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  interestedCourse: string;
  stage: "New" | "Contacted" | "Interested" | "Converted" | "Rejected";
  source: string;
  notes: string;
  date: string;
}

// ── Todo ─────────────────────────────────────────────────────────────────────
export interface Todo {
  id: string;
  task: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
  createdAt: string;
}

// ── Activity ─────────────────────────────────────────────────────────────────
export interface Activity {
  id: string;
  title: string;
  type: "Holiday" | "Event" | "Activity" | "Test";
  date: string;
  description: string;
}
