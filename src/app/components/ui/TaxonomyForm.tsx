"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

// Importa la Server Action che gestirà la logica di creazione/aggiornamento
import { createTaxonomy } from "@/app/lib/actions";

// Le props del componente TaxonomyForm non avranno più onSubmit o isLoading
// Se vuoi supportare l'editing, potresti ancora passare initialData
interface TaxonomyFormProps {
    initialData?: TaxonomyData;
}

export default function TaxonomyForm({ initialData }: TaxonomyFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<TaxonomyData>(
        initialData ?? {
            id: 0,
            title: "",
            type: "category",
            description: "",
        }
    );
    const [isLoading, setIsLoading] = useState(false); // Gestisci isLoading internamente

    const updateForm = <K extends keyof TaxonomyData>(field: K, value: TaxonomyData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Inizia il caricamento

        try {
            // Invocazione della Server Action
            // Se stai creando, userai createTaxonomy. Se stai modificando, potresti avere un updateTaxonomy
            // Per semplicità, qui usiamo solo createTaxonomy come esempio.
            const result = await createTaxonomy(formData);

            if (result.error) {
                // Se la Server Action restituisce un errore, mostralo
                throw new Error(result.error);
            }

            toast.success("Tassonomia salvata con successo!");
            router.push("/dashboard/taxonomy"); // Reindirizza dopo il successo
            router.refresh(); // Riconvalida i dati della pagina di destinazione
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Errore durante il salvataggio della tassonomia.");
        } finally {
            setIsLoading(false); // Ferma il caricamento alla fine, sia in caso di successo che di errore
        }
    };

    return (
        <form onSubmit={handleSubmit} >
            <div className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                    <Input
                        id="title"
                        name="title"
                        className="bg-white" value={formData.title}
                        onChange={(e) => updateForm("title", e.target.value)}
                        placeholder="Nome tassonomia"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                        id="type"
                        name="type"
                        className="w-full border px-2 py-2 bg-white"
                        value={formData.type}
                        onChange={(e) => updateForm("type", e.target.value as "category" | "tag")}
                        required
                        disabled={isLoading}
                    >
                        <option value="category">Categoria</option>
                        <option value="tag">Tag</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                    <textarea
                        id="description"
                        name="description"
                        className="w-full border p-2 min-h-[80px] bg-white"
                        value={formData.description}
                        onChange={(e) => updateForm("description", e.target.value)}
                        placeholder="Descrizione della tassonomia"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        className="bg-gray-200 text-black"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Indietro
                    </Button>
                    <Button type="submit" className="bg-black text-white" disabled={isLoading}>
                        {isLoading ? "Salvataggio..." : "Salva"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
