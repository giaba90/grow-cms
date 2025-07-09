// app/dashboard/pages/edit/[id]/page.tsx
import PageForm from "@/app/components/ui/PageForm";

interface Params {
    params: Promise<{ id: string }>;
}

export default async function EditPage(props: Params) {
    const params = await props.params;
    const { id } = params;

    const data = await getPageData(id);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8"> Modifica Pagina</h1>
            <PageForm initialData={data.page} action="edit" />
        </div>
    );
}

async function getPageData(id: string) {

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/pages/${id}`,
            {
                next: { revalidate: 0 } // Assicura che i dati siano sempre freschi
            }
        );
        if (!res.ok) {
            throw new Error(`Failed to fetch pages: ${res.status} ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch pages:", error);
    }

}
