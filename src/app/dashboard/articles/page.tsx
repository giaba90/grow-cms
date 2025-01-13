// app/dashboard/articles/page.tsx
import { fetchArticles } from "@/lib/api/articles";

export default async function ArticlesPage() {
  const articles = await fetchArticles();

  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <a href={`/dashboard/articles/${article.id}`}>{article.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
