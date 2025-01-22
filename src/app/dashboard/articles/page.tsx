// app/dashboard/articles/page.tsx
import { Suspense } from "react";
import Link from "next/link";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function BlogPost() {
  let loading: boolean = true;
  let error: string | null = null;
  let articles: Article[] = [];

  try {
    const res = await fetch(`${API_BASE_URL}/articles`);
    if (!res.ok) {
      throw new Error("Failed to fetch articles");
    }
    const data = await res.json();
    articles = data;
  } catch (err) {
    error = (err as Error).message;
  } finally {
    loading = false;
  }

  if (loading) {
    return <div>Loading...</div>;
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
        {/*     <ArticlesList articles={articles} />*/}
        <BlogPost />
      </Suspense>
    </div>
  );
}
