"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";
import clsx from "clsx";

export type ToastType = "error" | "success" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

// Global singleton store
let _toastId = 0;
let _listeners: ((toasts: ToastItem[]) => void)[] = [];
let _toasts: ToastItem[] = [];

function notifyListeners() {
  _listeners.forEach(fn => fn([..._toasts]));
}

export function showToast(message: string, type: ToastType = "error") {
  const id = ++_toastId;
  _toasts = [..._toasts, { id, message, type }];
  notifyListeners();
  setTimeout(() => {
    _toasts = _toasts.filter(t => t.id !== id);
    notifyListeners();
  }, 4500);
}

const ICONS: Record<ToastType, React.ReactNode> = {
  error:   <AlertCircle size={16} className="flex-shrink-0" />,
  success: <CheckCircle size={16} className="flex-shrink-0" />,
  info:    <Info        size={16} className="flex-shrink-0" />,
};

const COLORS: Record<ToastType, string> = {
  error:   "bg-danger-600  border-danger-500  text-white",
  success: "bg-success-600 border-success-500 text-white",
  info:    "bg-primary-600 border-primary-500 text-white",
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (t: ToastItem[]) => setToasts(t);
    _listeners.push(listener);
    return () => { _listeners = _listeners.filter(l => l !== listener); };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={clsx(
            "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl",
            "animate-fade-in max-w-sm text-sm font-medium",
            COLORS[toast.type]
          )}
        >
          {ICONS[toast.type]}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => { _toasts = _toasts.filter(t => t.id !== toast.id); notifyListeners(); }}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
