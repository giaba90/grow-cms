import { Rocket } from "lucide-react";
import { SignIn } from "../components/auth/sign-in";
import { cn } from "../lib/utils";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <div className="flex h-16 items-center justify-center px-4">
            <Rocket className="h-6 w-6 text-primary" />
            <span
              className={cn("ml-2 font-bold transition-opacity duration-300")}
            >
              GROW CMS
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
