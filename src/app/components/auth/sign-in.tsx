"use client";

import React, { useState } from "react";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/app/components/ui/button";
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient();

export function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await authClient.signIn.email({ email, password });
      console.log(response);
      if (response?.error) {
        setError(response.error.message || "Errore durante l'autenticazione");
        return;
      }

      // Autenticazione riuscita, redirect
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      setError("Errore imprevisto durante il login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="email" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
          Email
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
          <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
            required
            minLength={6}
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
          <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      <Button disabled={loading} className="mt-4 w-full text-white bg-black">
        {loading ? "Loading..." : (
          <>
            Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </>
        )}
      </Button>
    </form>
  );
}
