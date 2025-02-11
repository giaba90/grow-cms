"use client";

import { signIn } from "next-auth/react";
// Component to render the Sign In form.
export function SignIn() {
  // Function to handle form submission when user clicks the "Sign In" button.
  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };
  return (
    <form action={handleSubmit}>
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}
