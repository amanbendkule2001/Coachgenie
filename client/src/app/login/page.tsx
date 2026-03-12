"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

// =============================================================================
// DEMO CREDENTIALS — frontend-only, no backend required
// =============================================================================
const DEMO_EMAIL    = "tutor@smartedu.com";
const DEMO_PASSWORD = "tutor123";

export default function TutorLoginPage() {
  const router = useRouter();

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);

  // ── If already authenticated, skip login page ──────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("tutorAuth") === "true") {
      router.replace("/dashboard/tutor");
    }
  }, [router]);

  // ── Handle login submission ────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    // Simulate network delay for realism
    await new Promise((res) => setTimeout(res, 900));

    // Credential check
    if (email.trim() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      // Store auth state in localStorage
      localStorage.setItem("tutorAuth",  "true");
      localStorage.setItem("tutorName",  "Mr. Sharma");
      localStorage.setItem("tutorEmail", email.trim());
      router.push("/dashboard/tutor");
    } else {
      setLoading(false);
      setError("Invalid email or password. Use the demo credentials below.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#0F172A] to-[#1E293B] px-4 py-12">

      {/* Background glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* ── Card ─────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Card header gradient */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-8 pt-10 pb-8 text-center">
            {/* Logo */}
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg backdrop-blur-sm">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SmartEdu</h1>
            <p className="text-primary-100 text-sm mt-1 font-medium">Tutor Login Portal</p>
          </div>

          {/* ── Form ──────────────────────────────────────────────────────── */}
          <div className="px-8 py-8">
            <p className="text-center text-sm text-text-muted mb-6">
              Sign in to access your tutor dashboard
            </p>

            <form onSubmit={handleLogin} className="space-y-5" noValidate>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="tutor@smartedu.com"
                    className="w-full pl-10 pr-4 py-3 bg-surface-muted border border-surface-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    id="login-password"
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-surface-muted border border-surface-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 bg-danger-50 border border-danger-200 rounded-xl px-4 py-3 animate-fade-in">
                  <AlertCircle size={15} className="text-danger-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-danger-600">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-xl">
              <p className="text-xs font-semibold text-primary-700 mb-2">🔑 Demo Credentials</p>
              <div className="space-y-1">
                <p className="text-xs text-primary-600">
                  <span className="font-medium">Email:</span> tutor@smartedu.com
                </p>
                <p className="text-xs text-primary-600">
                  <span className="font-medium">Password:</span> tutor123
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 SmartEdu · For demo purposes only
        </p>
      </div>
    </div>
  );
}
