import { Suspense } from "react";
import { DashboardClient } from "@/app/components/dashboard/dashboard-client";

// Configure segment
export const dynamic = "force-dynamic";
export const runtime = "edge";
export const preferredRegion = "auto";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense>
            <DashboardClient>{children}</DashboardClient>
        </Suspense>
    );
} 