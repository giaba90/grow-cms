import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuClick }: HeaderProps) {
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
          <button onClick={() => signOut()}>Logout</button>
        </div>
      </div>
    </header>
  );
}
