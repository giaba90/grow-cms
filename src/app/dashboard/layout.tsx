import { DashboardClient } from "@/app/components/dashboard/dashboard-client";
import { EdgeStoreProvider } from "../lib/edgestore";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <EdgeStoreProvider>
        <DashboardClient>{children}</DashboardClient>
        <Toaster position="top-center" />
      </EdgeStoreProvider>
    </SessionProvider>
  );
}
