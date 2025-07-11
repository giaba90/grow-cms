// File: src/app/dashboard/articles/[id]/edit/page.tsx
import { getArticleData } from "@/app/utils/utils";
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



