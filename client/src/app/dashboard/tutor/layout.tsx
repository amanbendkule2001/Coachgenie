import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthGuard from "@/components/layout/AuthGuard";

/**
 * Tutor Dashboard Layout
 * ─────────────────────
 * Wraps all /dashboard/tutor/* pages with:
 *  1. AuthGuard  → redirects to /login if not authenticated
 *  2. DashboardLayout → renders sidebar + header shell
 */
export default function TutorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
