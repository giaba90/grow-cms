import Link from "next/link";
import { Github, LogIn, Rocket } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-3xl text-center">
        {/* Logo and Title Section */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl flex items-center justify-center gap-4">
            Welcome to GROW CMS <Rocket className="h-16 w-16" />
          </h1>
          <p className="text-lg text-gray-600">
            The custom management system to takeoff
          </p>
        </div>

        {/* Buttons Container */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {/* Login Button */}
          <Link href="/login">
            <Button
              size="lg"
              className="w-full min-w-[200px] gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              <LogIn className="h-5 w-5" />
              Log in to your account
            </Button>
          </Link>

          {/* GitHub Button */}
          <Link
            href="https://github.com/growcms"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-[200px] gap-2 sm:w-auto"
            >
              <Github className="h-5 w-5" />
              Visit our GitHub
            </Button>
          </Link>
        </div>

        {/* Footer Attribution */}
        <div className="mt-16 text-sm text-gray-500">
          Built with ❤️ by Gianluca Barranca
        </div>
      </div>
    </div>
  );
}
