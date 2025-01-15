"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email("Email non valida").trim().nonempty("Email è obbligatoria"),
  password: z.string().min(6, "Password deve essere almeno 6 caratteri").nonempty("Password è obbligatoria"),
});

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const user = await prisma.users.findUnique({
        where: { email: data.email.trim() },
      });

      if (!user?.password || !(await bcrypt.compare(data.password, user.password))) {
        setError("Credenziali non valide");
        return;
      }

      setIsSuccess(true);
      setError(null);
      router.push("/dashboard");
    } catch (err) {
      console.error("Errore login:", err);
      setError("Si è verificato un errore. Riprova più tardi.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register("email")}
          placeholder="m@example.com"
          type="email"
          aria-invalid={!!errors.email}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-red-500" role="alert">
            {errors.email.message?.toString()}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-sm underline hover:text-primary"
            href="/reset-password"
          >
            Password dimenticata?
          </Link>
        </div>
        <Input
          id="password"
          {...register("password")}
          type="password"
          placeholder="Password"
          aria-invalid={!!errors.password}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-sm text-red-500" role="alert">
            {errors.password.message?.toString()}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
      {isSuccess && (
        <p className="text-sm text-green-500" role="status">
          Login effettuato con successo!
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Accesso in corso..." : "Accedi"}
      </Button>
    </form>
  );
}
