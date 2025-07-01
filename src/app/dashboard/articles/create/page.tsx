import getServerSession from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import ArticleForm from "./ArticleForm";

export default async function CreateArticlePage() {
  const session = await getServerSession(authOptions);

  // Type assertion to include 'user' property
  const userSession = session as (typeof session & { user?: { id?: string } });

  if (!userSession?.user?.id) {
    redirect("/login");
  }

  return (
    <ArticleForm
      userId={userSession.user!.id}
      onSubmit={async (formValues) => {
        "use server";
        await fetch("/api/dashboard/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
      }}
    />
  );
}
