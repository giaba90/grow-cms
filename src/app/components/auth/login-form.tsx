"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Alert from "@/app/components/ui/alert";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                setError(result.error);
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError("An unexpected error occurred");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <Alert variant="destructive">{error}</Alert>
            )}

            <div>
                <Input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    error={errors.email?.message}
                />
            </div>

            <div>
                <Input
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                    error={errors.password?.message}
                />
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    );
} 