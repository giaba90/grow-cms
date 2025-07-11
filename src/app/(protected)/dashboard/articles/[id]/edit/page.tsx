// File: src/app/dashboard/articles/[id]/edit/page.tsx
import ArticleForm from "../../../../../components/ui/ArticleForm";
interface Params {
    params: Promise<{ id: string }>;
}

export default async function EditArticlePage(props: Params) {
    const params = await props.params;
    const { id } = params;

    const data = await getArticleData(id);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8"> Modifica Articolo</h1>
            <ArticleForm initialData={data.articles} action="edit" />
        </div>
    );
}


async function getArticleData(id: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/articles/${id}`,
            {
                next: { revalidate: 0 } // Assicura che i dati siano sempre freschi
            }
        );
        if (!res.ok) {
            throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch articles:", error);
    };
}

