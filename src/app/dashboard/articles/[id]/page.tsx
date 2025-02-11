// app/dashboard/articles/[id]/page.tsx
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchArticle(id: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch article");
    }
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const article = await fetchArticle(id);

  if (!article) {
    <div>
      Errore: Impossibile recuperare l&apos;articolo o articolo non trovato
    </div>;
  }

  return (
    <div>
      <h1>{article?.title}</h1>
      <p>{article?.content}</p>
    </div>
  );
}
