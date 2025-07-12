// lib/getTaxonomies.ts
import { fetchData } from './fetchData';

interface TaxonomiesResponse {
    message: string;
    taxonomies: TaxonomyData[];
}

export async function getTaxonomies(): Promise<TaxonomyData[]> {
    const data = await fetchData<TaxonomiesResponse>('/api/dashboard/taxonomy');
    return data?.taxonomies ?? [];
}
