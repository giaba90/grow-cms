import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { Rocket } from "lucide-react";
import { cn } from "../../utils/utils";
interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className=" w-full bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex h-16 items-center px-4">
          <Rocket className="h-6 w-6 text-primary" />
          <span
            className={cn("ml-2 font-bold transition-opacity duration-300")}
          >
            GROW CMS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="border p-2 cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
