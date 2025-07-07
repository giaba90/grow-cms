import PageForm from "@/app/components/ui/PageForm";
import { updatePage } from "@/app/lib/actions";
import { notFound } from "next/navigation";

async function getPageData(id: string): Promise<PageData | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/pages/${id}`, {
            next: { revalidate: 0 }, // forza fetch fresco se serve
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Errore fetch pagina:", error);
        return null;
    }
}

interface EditPageProps {
    params: { id: string };
}

export default async function EditPage({ params }: EditPageProps) {
    const initialPageData = await getPageData(params.id);

    if (!initialPageData) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                Modifica Pagina: {initialPageData.title}
            </h1>

            <PageForm initialData={initialPageData} onSubmit={updatePage} />
        </div>
    );
}
