import { Menu, Rocket } from "lucide-react";
import { cn } from "../../utils/utils";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
          onError: (error: any) => {
            console.error("Sign out failed:", error);
            alert("Logout failed. Please try again.");
          },
        },
      });
    } catch (error) {
      console.error("Error during sign out:", error);
      alert("An unexpected error occurred during logout.");
    }
  };

  return (
    <header className="w-full bg-white shadow-sm">
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
            onClick={handleSignOut}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}