// app/dashboard/articles/page.tsx
import { Suspense } from "react";

async function BlogPost() {
  let error: string | null = null;
  let articles: Article[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/dashboard/articles`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch articles");
    }
    articles = await res.json();
  } catch (err) {
    error = (err as Error).message;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ul>
      {articles.map((article: Article) => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
}

export default function ArticlesPage() {
  return (
    <div>
      <h1>Articles</h1>
      <Suspense fallback={<div>Loading articles...</div>}>
        <BlogPost />
      </Suspense>
    </div>
  );
}
