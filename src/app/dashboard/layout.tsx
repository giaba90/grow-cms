import { DashboardClient } from "@/app/components/dashboard/dashboard-client";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <DashboardClient>{children}</DashboardClient>
      <Toaster position="top-center" />
    </SessionProvider>
  );
}
