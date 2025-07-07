//dashboard/pages/create/page.tsx
import PageForm from "@/app/components/ui/PageForm"; // Importa il componente PageForm
import { createPage } from "@/app/lib/actions"; // Importa la Server Action per la creazione

export default function CreatePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Crea Nuova Pagina</h1>
            <PageForm onSubmit={createPage} />
        </div>
    );
}
