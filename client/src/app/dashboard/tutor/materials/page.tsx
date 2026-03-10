import { FileText, Plus, Upload, Download, Trash2, Eye } from "lucide-react";

const materials = [
  { id: 1, name: "Physics Notes – Ch.7 Gravitation",   type: "PDF",   size: "2.4 MB",  batch: "Batch C", uploaded: "Mar 09", icon: "📄" },
  { id: 2, name: "Math Formula Sheet – Trigonometry", type: "PDF",   size: "1.1 MB",  batch: "Batch A", uploaded: "Mar 07", icon: "📄" },
  { id: 3, name: "Biology Diagrams – Cell Structure",  type: "PDF",   size: "4.8 MB",  batch: "Batch B", uploaded: "Mar 05", icon: "📄" },
  { id: 4, name: "Chemistry Periodic Table Chart",    type: "Image", size: "890 KB",  batch: "All",     uploaded: "Mar 01", icon: "🖼️" },
  { id: 5, name: "JEE 2025 Mock Test Paper",          type: "PDF",   size: "3.2 MB",  batch: "Batch A", uploaded: "Feb 28", icon: "📄" },
  { id: 6, name: "Physics Video Lecture – Optics",    type: "Video", size: "128 MB",  batch: "Batch C", uploaded: "Feb 25", icon: "🎥" },
];

const typeColors: Record<string, string> = {
  PDF: "bg-danger-50 text-danger-600",
  Image: "bg-primary-50 text-primary-600",
  Video: "bg-warning-50 text-warning-600",
};

export default function MaterialsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <FileText size={22} className="text-primary-500" />
            Study Materials
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Upload and share notes, PDFs and videos</p>
        </div>
        <button className="btn-primary">
          <Upload size={16} /> Upload Material
        </button>
      </div>

      {/* Upload zone */}
      <div className="page-card border-dashed border-2 border-primary-200 bg-primary-50/30 flex flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center">
          <Upload size={24} className="text-primary-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">Drag & drop files here</p>
          <p className="text-xs text-text-muted mt-1">Supports PDF, images, MP4 videos · Max 200MB</p>
        </div>
        <button className="btn-primary mt-1">Browse Files</button>
      </div>

      {/* Files list */}
      <div className="page-card">
        <h2 className="text-base font-semibold text-text-primary mb-4">Uploaded Materials ({materials.length})</h2>
        <div className="space-y-2">
          {materials.map((m) => (
            <div key={m.id} className="flex items-center gap-4 p-3 bg-surface-muted rounded-xl hover:bg-surface-border/50 transition-colors">
              <span className="text-2xl flex-shrink-0">{m.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{m.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{m.batch} · {m.size} · {m.uploaded}</p>
              </div>
              <span className={`badge flex-shrink-0 ${typeColors[m.type]}`}>{m.type}</span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-border transition-colors">
                  <Eye size={13} className="text-text-muted" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-border transition-colors">
                  <Download size={13} className="text-text-muted" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-danger-50 transition-colors">
                  <Trash2 size={13} className="text-danger-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
