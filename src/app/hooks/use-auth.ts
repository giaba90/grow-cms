import { useRouter } from "next/navigation";
import { APP_PATHS } from "@/app/lib/constants/paths";

export function useAuth() {
    const router = useRouter();

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push(APP_PATHS.auth.login);
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return { logout };
} 