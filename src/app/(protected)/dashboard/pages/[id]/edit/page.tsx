// app/dashboard/pages/edit/[id]/page.tsx
// Questo è un Server Component

import PageForm from "@/app/components/ui/PageForm";
import { updatePage } from "@/app/lib/actions"; // Importa la Server Action per l'aggiornamento e il tipo PageData
import { notFound } from 'next/navigation'; // Importa notFound per gestire il caso di pagina non trovata

interface Params {
    params: { id: string };
}

export default async function EditPage({ params }: Params) {
    // Destruttura l'ID da params all'inizio per risolvere il problema "params should be awaited"
    const { id } = params;

    // Usa l'ID destrutturato per recuperare i dati della pagina
    const page = await getPageData(id);

    if (!page) {
        notFound(); // Usa la funzione notFound di Next.js per mostrare la pagina 404
    }

    // Crea una funzione di onSubmit specifica per l'aggiornamento
    const handleUpdate = async (data: PageData) => {
        "use server";
        // Assicurati che l'ID sia presente per l'aggiornamento
        if (typeof data.id === 'undefined') {
            return { success: false, error: "ID della pagina mancante per l'aggiornamento." };
        }
        return await updatePage(data);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                Modifica Pagina
            </h1>
            {/* Passa i dati iniziali e la Server Action updatePage al componente PageForm */}
            <PageForm initialData={page} onSubmit={handleUpdate} />
        </div>
    );
}

// Funzione per recuperare i dati della pagina
async function getPageData(id: string): Promise<PageData | null> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/pages/${id}`,
            {
                next: { revalidate: 0 } // Assicura che i dati siano sempre freschi
            }
        );
        if (!res.ok) {
            // Se la risposta non è OK (es. 404), restituisci null
            return null;
        }
        return await res.json();
    } catch (err) {
        console.error("Errore fetch pagina:", err);
        return null;
    }
}
