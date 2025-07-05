import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config"; // Assicurati che questo percorso sia corretto
import { redirect } from "next/navigation";
import ArticleForm from "./ArticleForm";

export default async function CreateArticlePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <ArticleForm
      userId={session.user.id}
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
