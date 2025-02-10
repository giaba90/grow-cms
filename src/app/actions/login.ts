//"use server";
/*
import { createSession } from "../lib/session";
import { loginSchema } from "@/app/lib/validation";

export async function login(prevState: any, formData: FormData) {
  if (!process.env.NEXT_PUBLIC_API_LOGIN_URL) {
    throw new Error("NEXT_PUBLIC_API_LOGIN_URL is not defined");
  }

  const user = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!user.success) {
    return {
      error: user.error.flatten().fieldErrors,
    };
  }

  const data = {
    email: user.data.email,
    password: user.data.password,
  };

  const response = await fetch(process.env.NEXT_PUBLIC_API_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  try {
    const result = await response.json();
    await createSession(result.id);
    return Response.redirect(
      new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL).toString()
    );
  } catch (error) {
    console.log("Error occurred:", error);
  }
}
*/

import { AuthError } from "next-auth";
import { signIn } from "next-auth/react";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const signInData = Object.fromEntries(formData.entries());
    await signIn("credentials", { ...signInData });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
