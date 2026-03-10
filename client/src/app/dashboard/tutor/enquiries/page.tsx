import { MessageSquare, Plus, Phone, Mail, User } from "lucide-react";

const enquiries = [
  { id: 1, name: "Arjun Patel",  contact: "+91 98765 43210", course: "JEE Mathematics", date: "Mar 09", status: "Follow-Up",  note: "Interested, needs demo class" },
  { id: 2, name: "Sneha Rao",    contact: "+91 87654 32109", course: "NEET Biology",    date: "Mar 08", status: "New",         note: "Called once, no answer" },
  { id: 3, name: "Vikram Singh", contact: "+91 76543 21098", course: "JEE Physics",     date: "Mar 06", status: "Enrolled",    note: "Joined Batch C" },
  { id: 4, name: "Divya Mehta",  contact: "+91 65432 10987", course: "Board Chemistry", date: "Mar 05", status: "Cold",        note: "Not responding" },
  { id: 5, name: "Karan Gupta",  contact: "+91 54321 09876", course: "JEE Mathematics", date: "Mar 04", status: "Follow-Up",  note: "Wants fee discount details" },
];

const statusMap: Record<string, string> = {
  "Follow-Up": "bg-warning-100 text-warning-600",
  "New": "bg-primary-100 text-primary-600",
  "Enrolled": "bg-success-100 text-success-600",
  "Cold": "bg-surface-muted text-text-muted",
};

export default function EnquiriesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <MessageSquare size={22} className="text-primary-500" />
            Enquiries & Follow-Ups
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Manage leads and track student enquiries</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Add Enquiry
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {["New","Follow-Up","Enrolled","Cold"].map((s) => (
          <div key={s} className="page-card text-center">
            <p className={`badge mx-auto mb-2 ${statusMap[s]}`}>{s}</p>
            <p className="text-2xl font-bold text-text-primary">
              {enquiries.filter(e => e.status === s).length}
            </p>
          </div>
        ))}
      </div>

      <div className="page-card space-y-3">
        <h2 className="text-base font-semibold text-text-primary mb-4">All Enquiries</h2>
        {enquiries.map((e) => (
          <div key={e.id} className="flex items-start gap-4 p-4 bg-surface-muted rounded-xl hover:bg-surface-border/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-text-primary">{e.name}</p>
                <span className={`badge ${statusMap[e.status]}`}>{e.status}</span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">{e.course} · {e.date}</p>
              <p className="text-xs text-text-secondary mt-1">{e.note}</p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <a href={`tel:${e.contact}`} className="w-8 h-8 bg-success-100 rounded-xl flex items-center justify-center hover:bg-success-200 transition-colors">
                <Phone size={13} className="text-success-600" />
              </a>
              <button className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center hover:bg-primary-200 transition-colors">
                <Mail size={13} className="text-primary-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
