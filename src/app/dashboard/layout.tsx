import { DashboardClient } from "@/app/components/dashboard/dashboard-client";
import { EdgeStoreProvider } from "../lib/edgestore";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EdgeStoreProvider>
      <DashboardClient>{children}</DashboardClient>
    </EdgeStoreProvider>
  );
}
