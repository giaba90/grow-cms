// app/dashboard/articles/page.tsx
import { Suspense } from "react";
import Link from "next/link";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function BlogPost() {
  let error: string | null = null;
  let articles: Article[] = [];

  try {
    const res = await fetch(`${API_BASE_URL}/articles`);
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
        <li key={article.id}>
          <Link href={`/dashboard/articles/${article.id}`}>
            {article.title}
          </Link>
        </li>
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
