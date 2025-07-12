// lib/getArticles.ts
import { fetchData } from './fetchData';

interface ArticlesResponse {
    message: string;
    articles: ArticleData[];
}

export async function getArticles(): Promise<ArticleData[]> {
    const data = await fetchData<ArticlesResponse>('/api/dashboard/articles');
    return data?.articles ?? [];
}
