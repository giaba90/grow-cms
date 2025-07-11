"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Tiptap from "@/app/components/ui/Tiptap";
import PostStatusSelect from "@/app/components/ui/PostStatusSelect";
import CategoryMultiSelect from "@/app/components/ui/CategoryMultiSelect";
import { postSchema } from "@/app/lib/validation";
import { createArticle, updateArticle } from "@/app/lib/actions";

interface ArticleFormProps {
    initialData: ArticleData;
    action: "create" | "edit";
}

export default function ArticleForm({ initialData, action }: ArticleFormProps) {

    const router = useRouter();
    // Usa i valori di default passati come props
    const [selectedCategories, setSelectedCategories] = useState<number[]>(initialData.category ?? []);
    const [selectedTags, setSelectedTags] = useState<number[]>(initialData.tag ?? []);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ArticleData>({
        title: initialData.title,
        content: initialData.content,
        status: initialData.status,
        featured: initialData.featured,
        description: initialData.description,
        url: initialData.url,
        author_id: initialData.author_id,
        // Se initialData ha un ID, lo includiamo nel formData
        ...(initialData.id && { id: initialData.id }),

    });

    /*     const [file, setFile] = useState<File>();
        const [imageUrl, setImageUrl] = useState<string | null>(null); */


    const updateForm = (field: keyof ArticleData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validazione Zod
        const validationResult = postSchema.safeParse(formData);
        if (!validationResult.success) {
            // Se la validazione fallisce, mostra un toast con gli errori
            toast.error("Errore di validazione", {
                description: validationResult.error.errors.map((err) => err.message).join(", "),
            });
            setIsLoading(false);
            return; // Ferma l'esecuzione se la validazione fallisce
        }

        //if action == "create" handleSubmit call createArticle from lib/actions
        // elseif action == "edit" handleSubmit call updateArticle from lib/actions
        try {
            let result;
            if (action === "create") {
                result = await createArticle(formData);
                if (result?.error) {
                    throw new Error(result.error);
                }
                toast.success("Articolo creato con successo!");
                router.push("/dashboard/articles");
                router.refresh();
                return;
            }
            else if (action === "edit") {
                if (!initialData.id) {
                    throw new Error("ID dell'articolo non fornito per l'editing.");
                }
                result = await updateArticle(formData);
                if (result?.error) {
                    throw new Error(result.error);
                }
                toast.success("Articolo aggiornato con successo!");
                router.push("/dashboard/articles");
                router.refresh();
                return;
            }
        } catch (error: any) {
            console.error("Errore durante l'operazione:", error);
            toast.error("Errore durante l'operazione:", error);

        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-6">
                {/* Colonna sinistra */}
                <div className="w-full md:w-2/3 space-y-6">
                    <Input
                        className="bg-white"
                        placeholder="Titolo"
                        value={formData.title}
                        onChange={(e) => updateForm("title", e.target.value)}
                        disabled={isLoading}
                    />
                    <Input
                        className="bg-white"
                        placeholder="URL personalizzato"
                        value={formData.url}
                        onChange={(e) => updateForm("url", e.target.value)}
                    />
                    <Input
                        className="bg-white"
                        placeholder="Descrizione SEO"
                        value={formData.description?.replace(/<[^>]*>/g, "")}
                        onChange={(e) => updateForm("description", e.target.value)}
                    />
                    <Tiptap
                        onChange={(value) => updateForm("content", value)}
                        content={formData.content}
                    />
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

                {/* Colonna destra */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => updateForm("featured", e.target.checked)}
                            className="h-4 w-4"
                        />
                        <label className="text-sm font-medium">Articolo in evidenza</label>
                    </div>

                    <PostStatusSelect
                        initialStatus={formData.status}
                        onChange={(value) => updateForm("status", value)}
                    />

                    <CategoryMultiSelect
                        selected={selectedCategories}
                        onChange={setSelectedCategories}
                        endpoint="/api/dashboard/taxonomy-type/category"
                        label="Categorie"
                        disabled={isLoading}
                    />

                    <CategoryMultiSelect
                        selected={selectedTags}
                        onChange={setSelectedTags}
                        endpoint="/api/dashboard/taxonomy-type/tag"
                        label="Tag"
                        disabled={isLoading}
                    />

                    {/* <div>
                        <label className="text-sm font-medium">Carica immagine</label>
                        <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
                        {file && !imageUrl && (
                            <Button type="button" className="mt-2">
                                Carica immagine
                            </Button>
                        )}
                    </div> */}
                </div>
            </div>
        </form>
    );

}


