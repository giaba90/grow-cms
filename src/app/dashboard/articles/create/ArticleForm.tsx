"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Tiptap from "@/app/components/ui/Tiptap";
import PostStatusSelect from "@/app/components/ui/PostStatusSelect";
import CategoryMultiSelect from "@/app/components/ui/CategoryMultiSelect";
import { useEdgeStore } from "@/app/lib/edgestore";


export default function ArticleForm({
    userId,
    initialValues,
    onSubmit,
    submitLabel = "Salva",
    defaultSelectedCategories = [],
    defaultSelectedTags = [],
}: ArticleFormProps) {
    const router = useRouter();
    const { edgestore } = useEdgeStore();

    // Usa i valori di default passati come props
    const [selectedCategories, setSelectedCategories] = useState<number[]>(defaultSelectedCategories);
    const [selectedTags, setSelectedTags] = useState<number[]>(defaultSelectedTags);

    const [formData, setFormData] = useState<ArticleFormData>({
        title: "",
        content: "",
        status: "draft",
        featured: false,
        description: "",
        url: "",
        ...initialValues,
    });

    const [file, setFile] = useState<File>();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const updateForm = (field: keyof ArticleFormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = async () => {
        if (!file) return;

        try {
            const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (p) => console.log("Upload progress:", p),
            });
            setImageUrl(res.url);
            toast.success("Immagine caricata con successo");
        } catch {
            toast.error("Errore durante il caricamento dell'immagine");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await onSubmit({
                ...formData,
                author_id: Number(userId),
                category: selectedCategories,
                tags: selectedTags,
                image: imageUrl ?? undefined,
            });

            toast.success("Articolo salvato!");
            router.push("/dashboard/articles");
            router.refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Errore durante il salvataggio");
        } finally {
            setIsLoading(false);
        }
    };

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

                    <div>
                        <label className="text-sm font-medium">Carica immagine</label>
                        <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
                        {file && !imageUrl && (
                            <Button type="button" onClick={handleFileUpload} className="mt-2">
                                Carica immagine
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
