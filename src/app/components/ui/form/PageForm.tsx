"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Tiptap from "@/app/components/ui/Tiptap";
import PostStatusSelect from "@/app/components/ui/PostStatusSelect";
import { pageDataSchema } from "@/app/lib/validation";
import { createPage, updatePage } from "@/app/lib/actions";

interface PageFormProps {
    initialData: PageData;
    action: "create" | "edit";
}

export default function PageForm({ initialData, action }: PageFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<PageData>(
        {
            title: initialData.title,
            content: initialData.content,
            status: initialData.status,
            url: initialData.url,
            description: initialData.description,
            // Se initialData ha un ID, lo includiamo nel formData
            ...(initialData.id && { id: initialData.id }),
        }
    );
    const [isLoading, setIsLoading] = useState(false);

    const updateForm = <K extends keyof PageData>(field: K, value: PageData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };


    //if action == "create" handleSubmit call createPage from lib/actions
    // elseif action == "edit" handleSubmit call updatepage from lib/actions
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validazione Zod
        const validationResult = pageDataSchema.safeParse(formData);
        if (!validationResult.success) {
            // Se la validazione fallisce, mostra un toast con gli errori
            toast.error("Errore di validazione", {
                description: validationResult.error.errors.map((err) => err.message).join(", "),
            });
            setIsLoading(false);
            return; // Ferma l'esecuzione se la validazione fallisce
        }

        try {
            let result;
            if (action === "create") {
                // Chiamata alla funzione createPage per la creazione
                result = await createPage(formData);
                if (result?.error) {
                    throw new Error(result.error);
                }
                toast.success("Pagina creata con successo!");
            } else if (action === "edit") {
                // Assicurati che initialData.id sia definito per l'editing
                if (!initialData.id) {
                    throw new Error("ID della pagina non fornito per l'editing.");
                }
                // Chiamata alla funzione updatePage per l'aggiornamento
                result = await updatePage(formData);
                if (result?.error) {
                    throw new Error(result.error);
                }
                toast.success("Pagina aggiornata con successo!");
            }

            // Reindirizza dopo il successo
            router.push("/dashboard/pages");
            router.refresh(); // Per revalidare la cache e mostrare i dati aggiornati
        } catch (error: any) {
            console.error("Errore durante l'operazione:", error);
            toast.error("Errore durante il salvataggio", {
                description: error.message || "Si è verificato un errore inatteso.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex w-full flex-row justify-between items-start">
                {/* Colonna sinistra */}
                <div className="w-2/3 pr-4">
                    <div className="mb-8">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Titolo
                        </label>
                        <Input
                            className="bg-white"
                            id="title"
                            name="title"
                            placeholder="Inserisci il titolo..."
                            value={formData.title}
                            onChange={(e) => updateForm("title", e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Contenuto
                        </label>
                        <Tiptap
                            key={formData.id ?? "new"} // evita reset indesiderati
                            content={formData.content}
                            onChange={(value) => updateForm("content", value)}
                        />
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button
                            type="button"
                            className="bg-gray-200 text-black"
                            onClick={() => router.push("/dashboard/pages")}
                            disabled={isLoading}
                        >
                            Indietro
                        </Button>
                        <Button type="submit" className="bg-black text-white" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Salvataggio...
                                </>
                            ) : (
                                "Salva"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Colonna destra */}
                <div className="w-1/3 ml-4">
                    <div className="mb-8">
                        <PostStatusSelect
                            initialStatus={formData.status}
                            onChange={(value) => updateForm("status", value)}
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                            Url personalizzato
                        </label>
                        <Input
                            className="bg-white"
                            id="url"
                            name="url"
                            placeholder="inserisci url personalizzato..."
                            value={formData.url}
                            onChange={(e) => updateForm("url", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Descrizione SEO
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="w-full border block sm:text-sm p-2 min-h-[80px] bg-white"
                            placeholder="Scrivi una descrizione SEO..."
                            value={formData.description}
                            onChange={(e) => updateForm("description", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
