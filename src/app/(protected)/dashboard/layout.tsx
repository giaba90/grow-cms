// app/dashboard/layout.tsx 
import { DashboardClient } from "@/app/components/dashboard/dashboard-client";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardClient>{children}</DashboardClient>
      <Toaster position="top-center" />
    </>
  );
}
