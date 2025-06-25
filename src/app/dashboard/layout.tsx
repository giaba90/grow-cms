import { DashboardClient } from "@/app/components/dashboard/dashboard-client";
import { EdgeStoreProvider } from "../lib/edgestore";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EdgeStoreProvider>
      <DashboardClient>{children}</DashboardClient>
      <Toaster position="top-center" />
    </EdgeStoreProvider>
  );
}
