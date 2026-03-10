import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TutorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
