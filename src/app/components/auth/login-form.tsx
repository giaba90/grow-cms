"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { login } from "@/app/actions/login";
import { useActionState } from "react";
//import { useFormStatus } from "react-dom";

export default function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);
  return (
    <form action={loginAction} className="space-y-6">
      <div>
        <Input type="email" name="email" placeholder="Email" />
      </div>
      {state?.error?.email && (
        <p className="text-red-500">{state.error.email}</p>
      )}
      <div>
        <Input type="password" name="password" placeholder="Password" />
      </div>
      {state?.error?.password && (
        <p className="text-red-500">{state.error.password}</p>
      )}
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
}
