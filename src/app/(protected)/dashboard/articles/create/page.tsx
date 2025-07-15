import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ArticleForm from "../../../../components/ui/form/ArticleForm";
import { auth } from "@/auth/auth";

export default async function CreateArticlePage() {
  const requestHeaders = await headers();
  const compatibleHeaders = new Headers(requestHeaders);
  const session = await auth.api.getSession({
    headers: compatibleHeaders,
  });

  if (!session) {
    redirect("/login");
  }

  const data: ArticleData = {
    title: "",
    content: "",
    status: "draft",
    url: "",
    description: "",
    featured: false,
    author_id: session.user.id,
    created_at: new Date().toISOString(),
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Crea un nuovo articolo</h1>
      <ArticleForm initialData={data} action="create" />
    </div>
  );
}
