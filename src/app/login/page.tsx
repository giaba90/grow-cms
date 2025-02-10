import LoginForm from "@/app/components/auth/login-form";
import { SignIn } from "../components/sign-in";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        {/*  <LoginForm />*/}
        <SignIn></SignIn>
      </div>
    </div>
  );
}
