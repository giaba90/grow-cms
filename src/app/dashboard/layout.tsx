"use client";
import { SessionProvider } from "next-auth/react";
import { DashboardClient } from "@/app/components/dashboard/dashboard-client";

export default function DashboardLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      {" "}
      <DashboardClient>{children}</DashboardClient>;
    </SessionProvider>
  );
}
