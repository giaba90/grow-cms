import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ArticleForm from "./ArticleForm";

export default async function CreateArticlePage() {
  const session = await getServerSession();
  const userId = session?.user?.email || "";
  if (!session || !userId) {
    redirect('/login');
  }
  const data: ArticleData = {
    title: "",
    content: "",
    status: "draft",
    url: "",
    description: "",
    featured: false,
    author_id: userId,
    created_at: new Date().toISOString(),
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Crea un nuovo articolo</h1>
      <ArticleForm initialData={data} action="create" />
    </div>
  );
}
