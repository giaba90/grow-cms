import { redirect } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { login } from "@/app/lib/auth/login";

export default function LoginForm() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await login(formData);
        redirect("/dashboard");
      }}
      className="space-y-6"
    >
      <div>
        <Input type="email" name="email" placeholder="Email" />
      </div>
      <div>
        <Input type="password" name="password" placeholder="Password" />
      </div>

      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
}
