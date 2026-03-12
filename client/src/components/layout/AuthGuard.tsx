"use client";

/**
 * AuthGuard
 * ---------
 * Client component that wraps the tutor dashboard layout.
 * Checks localStorage for "tutorAuth" === "true" on mount.
 * If not authenticated → redirects to /login immediately.
 * If authenticated     → renders children (dashboard content).
 *
 * This is a pure frontend guard — no server-side auth involved.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true); // prevent flash of dashboard content

  useEffect(() => {
    const isAuth = localStorage.getItem("tutorAuth") === "true";

    if (!isAuth) {
      // Not logged in → send to login page
      router.replace("/login");
    } else {
      // Authenticated → show the dashboard
      setChecking(false);
    }
  }, [router]);

  // ── While checking auth (SSR → hydration gap), show a loading screen ──────
  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-[#0F172A] gap-4">
        <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-soft">
          <GraduationCap size={28} className="text-white" />
        </div>
        <p className="text-slate-400 text-sm font-medium">Verifying session…</p>
      </div>
    );
  }

  return <>{children}</>;
}
