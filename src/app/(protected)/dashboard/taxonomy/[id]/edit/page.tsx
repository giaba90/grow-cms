"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TaxonomyForm from "@/app/components/ui/TaxonomyForm";
import { toast } from "sonner";

export default function EditTaxonomyPage() {

    const params = useParams();
    const [formData, setFormData] = useState<TaxonomyData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Aggiunto stato per la gestione errori

    useEffect(() => {
        // Definiamo una funzione asincrona all'interno di useEffect
        const fetchTaxonomy = async () => {
            if (typeof params.id !== "string") {
                setError("ID tassonomia non valido.");
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/dashboard/taxonomy/${params.id}`, {
                    method: "GET", // Specificato il metodo GET per chiarezza
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: 'no-store', // Importante per garantire dati aggiornati
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Errore nel caricamento: ${res.status}`);
                }

                const data = await res.json();
                setFormData({
                    id: data.id ?? 0,
                    title: data.title ?? "",
                    type: data.type ?? "category",
                    description: data.description ?? "",
                });
            } catch (err) {
                console.error("Errore nel caricamento della tassonomia:", err);
                toast.error(err instanceof Error ? err.message : "Errore nel caricamento della tassonomia.");
                setError(err instanceof Error ? err.message : "Errore nel caricamento della tassonomia.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTaxonomy();
    }, []);


    if (isLoading && !formData) {
        return <div className="text-center py-8">Caricamento tassonomia...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">Errore: {error}</div>;
    }

    if (!formData) {
        return <div className="text-center py-8 text-gray-500">Nessun dato tassonomia trovato.</div>;
    }

    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Modifica tassonomia</h1>
            <TaxonomyForm initialData={formData} />
        </>
    );
}
