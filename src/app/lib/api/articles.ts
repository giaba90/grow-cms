// lib/api/articles.ts
import { API_BASE_URL } from "./configs";
// Fetch tutti gli articoli
export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(`${API_BASE_URL}/articles`);
  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }
  return res.json();
}
// Fetch singolo articolo
export async function fetchArticle(id: string): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch article");
  }
  return res.json();
}
