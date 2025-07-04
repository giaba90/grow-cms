import { Menu, Rocket } from "lucide-react";
// Removed 'signOut' from 'next-auth/react' as you're using 'authClient'
import { cn } from "../../utils/utils";
import { authClient } from "@/app/lib/auth-client";
// Use useRouter hook for client-side navigation
import { useRouter } from "next/navigation"; // For App Router
// If you are in the Pages Router, use: import { useRouter } from "next/router";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean; // This prop is not used in the provided JSX, but kept for interface consistency
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter(); // Initialize the router hook

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login"); // redirect to login page
          },
          onError: (error: any) => { // Added onError for better error handling
            console.error("Sign out failed:", error);
            // Optionally, handle error, e.g., show a toast message
            alert("Logout failed. Please try again.");
          },
        },
      });
    } catch (error) {
      console.error("Error during sign out:", error);
      // Fallback for any unhandled errors during the await call
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
            onClick={handleSignOut} // Call the async function
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}