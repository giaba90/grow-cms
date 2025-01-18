// app/dashboard/articles/page.tsx
"use client";
import { Suspense } from "react";
import { useArticles } from "../../hooks/useArticle";
import Link from "next/link";
import React from "react";

const ArticlesList = React.memo(({ articles }: ArticlesListProps) => (
  <ul>
    {articles.map((article: Article) => (
      <li key={article.id}>
        <Link href={`/dashboard/articles/${article.id}`}>{article.title}</Link>
      </li>
    ))}
  </ul>
));

ArticlesList.displayName = "ArticlesList";

export default function ArticlesPage() {
  const { articles, loading, error } = useArticles();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Articles</h1>
      <Suspense fallback={<div>Loading articles...</div>}>
        <ArticlesList articles={articles} />
      </Suspense>
    </div>
  );
}
