"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import {
  Rocket,
  LayoutDashboard,
  FileText,
  Files,
  Tag,
  Image as ImageIcon,
  Users,
} from "lucide-react";
import React from "react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Articoli",
    icon: FileText,
    href: "/dashboard/articles",
  },
  {
    title: "Pagine",
    icon: Files,
    href: "/dashboard/pages",
  },
  {
    title: "Tassonomie",
    icon: Tag,
    href: "/dashboard/taxonomy",
  },
  {
    title: "Media",
    icon: ImageIcon,
    href: "/dashboard/media",
  },
  {
    title: "Utenti",
    icon: Users,
    href: "/dashboard/users",
  },
];

export function Sidebar(isOpen: boolean) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform bg-white transition-all duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Rocket className="h-6 w-6 text-primary" />
        <span
          className={cn(
            "ml-2 font-bold transition-opacity duration-300",
            isOpen ? "opacity-100" : "md:opacity-0"
          )}
        >
          GROW CMS
        </span>
      </div>

      <nav className="space-y-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100",
              !isOpen && "md:justify-center"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span
              className={cn(
                "ml-3 transition-opacity duration-300",
                isOpen ? "opacity-100" : "md:hidden"
              )}
            >
              {item.title}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
