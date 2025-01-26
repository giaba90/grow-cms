"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu, LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm font-medium">
                {session.user?.name || session.user?.email}
              </span>
              <Avatar>
                <AvatarImage
                  src={session.user?.image || ""}
                  alt={session.user?.name || "User avatar"}
                />
                <AvatarFallback>
                  {session.user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <LogIn />
          )}
        </div>
      </div>
    </header>
  );
}
