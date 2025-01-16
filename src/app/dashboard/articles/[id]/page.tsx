// app/dashboard/articles/[id]/page.tsx
import { fetchArticle } from "../../../lib/api/articles";

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await fetchArticle(params.id);

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
}
