// lib/getPages.ts
import { fetchData } from './fetchData';

interface PagesResponse {
    message: string;
    pages: PageData[];
}

export async function getPages(): Promise<PageData[]> {
    const data = await fetchData<PagesResponse>('/api/dashboard/pages');
    return data?.pages ?? [];
}
