async function fetchArticle(id: string): Promise<PostData> {
  const res = await fetch(`${process.env.BASE_URL_API}/articles/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch article");
  }
  return res.json();
}

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
