// app/dashboard/articles/[id]/page.tsx
"use client";
import { Suspense, use } from "react";
import { useArticle } from "@/app/hooks/useArticle";
import React from "react";

const ArticleContent = React.memo(({ article }: { article: Article }) => (
  <div>
    <h1>{article?.title}</h1>
    <p>{article?.content}</p>
  </div>
));
ArticleContent.displayName = "ArticleContent";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { article, loading, error } = useArticle(id);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Suspense fallback={<div>Loading article...</div>}>
      {article ? (
        <ArticleContent article={article} />
      ) : (
        <div>No article found</div>
      )}
    </Suspense>
  );
}
