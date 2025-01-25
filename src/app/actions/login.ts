"use server";
import { redirect } from "next/navigation";
import { createSession } from "../lib/session";
import { loginSchema } from "@/app/lib/validation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    redirect("/dashboard");
  } catch (error) {
    console.log("Error occurred:", error);
  }
}
