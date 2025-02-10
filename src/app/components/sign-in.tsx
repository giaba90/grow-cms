import { signIn } from "next-auth/react";

export function SignIn() {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        const data: Record<string, string> = Object.fromEntries(
          Array.from(formData.entries()).map(([key, value]) => [
            key,
            value.toString(),
          ])
        );

        signIn("credentials", { ...data, redirect: false });
      }}
    >
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
