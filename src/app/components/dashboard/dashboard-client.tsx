"use client";

import { useState } from "react";
import { Header } from "@/app/components/dashboard/header";
import { Sidebar } from "@/app/components/dashboard/sidebar";

export function DashboardClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`flex-1 p-6 transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  );
}
