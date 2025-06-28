"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import PostStatusSelect from "@/app/components/ui/PostStatusSelect";
import CategorySelect from "@/app/components/ui/CategorySelect";
import TagSelect from "@/app/components/ui/TagSelect";
import Tiptap from "@/app/components/ui/Tiptap";
import { useEdgeStore } from "src/app/lib/edgestore";
import { toast } from "sonner";

export default function EditArticlePage() {
    const router = useRouter();
    const params = useParams();
    const { edgestore } = useEdgeStore();
    const { data: session } = useSession();

    const [file, setFile] = useState<File>();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<PostData | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [catLoading, setCatLoading] = useState(true);
    const [tagLoading, setTagLoading] = useState(true);
    const [catError, setCatError] = useState<string | null>(null);
    const [tagError, setTagError] = useState<string | null>(null);

    const hasFetchedArticle = useRef(false);

    const updateForm = useCallback(<K extends keyof PostData>(field: K, value: PostData[K]) => {
        setFormData((prev) => prev ? { ...prev, [field]: value } : prev);
    }, []);

    const createInitialFormData = (data: any, userId: number): PostData => ({
        title: data.title ?? "",
        content: data.content ?? "",
        status: data.status ?? "draft",
        featured: data.featured ?? false,
        author_id: data.author_id ?? userId,
        category: data.content_taxonomy[0]?.taxonomy.name ?? "",
        tag: data.tag ?? "",
        url: data.url ?? "",
        description: data.description ?? "",
    });

    useEffect(() => {
        if (
            typeof params.id !== "string" ||
            !session?.user?.id ||
            hasFetchedArticle.current
        ) return;

        const numericUserId = Number(session.user.id);
        if (isNaN(numericUserId)) return;

        const fetchArticle = async () => {
            try {
                const res = await fetch(`/api/dashboard/articles/${params.id}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                setFormData(createInitialFormData(data, numericUserId));
                hasFetchedArticle.current = true;
            } catch {
                toast.error("Impossibile caricare l'articolo");
            }
        };

        fetchArticle();
    }, [params.id, session?.user?.id]);


    useEffect(() => {
        const fetchTaxonomies = async () => {
            try {
                const [catRes, tagRes] = await Promise.all([
                    fetch("/api/dashboard/taxonomy-type/category"),
                    fetch("/api/dashboard/taxonomy-type/tag"),
                ]);

                if (!catRes.ok || !tagRes.ok) throw new Error();
                setCategories(await catRes.json());
                setTags(await tagRes.json());
                setCatError(null);
                setTagError(null);
            } catch {
                setCategories([]);
                setTags([]);
                setCatError("Errore nel caricamento delle categorie");
                setTagError("Errore nel caricamento dei tag");
            } finally {
                setCatLoading(false);
                setTagLoading(false);
            }
        };

        fetchTaxonomies();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const numericAuthorId = Number(session?.user?.id);
        if (!formData?.title || !formData?.content || isNaN(numericAuthorId)) {
            toast.error("Titolo, contenuto e autore sono obbligatori");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/dashboard/articles/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Errore durante l'aggiornamento");
            }

            toast.success("Articolo aggiornato con successo!");
            router.push("/dashboard/articles");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Errore durante l'aggiornamento");
        } finally {
            setIsLoading(false);
        }
    };

    if (!formData) return <p>Caricamento dati articolo...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-6">Modifica articolo</h1>
            <div className="flex w-full direction-row justify-between items-start flex-nowrap">
                <div className="w-2/3">
                    <div className="mb-6">
                        <label className="text-sm font-medium">Titolo</label>
                        <Input
                            className="bg-white"
                            placeholder="Inserisci il titolo..."
                            value={formData.title}
                            onChange={(e) => updateForm("title", e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contenuto</label>
                        <Tiptap content={formData.content} onChange={(val) => updateForm("content", val)} />
                    </div>

                    <div className="flex justify-between pt-6">
                        <Button
                            type="button"
                            className="cursor-pointer mt-2 bg-gray-200 text-black"
                            onClick={() => router.back()}
                        >
                            Indietro
                        </Button>
                        <Button
                            type="submit"
                            className="cursor-pointer mt-2 bg-black text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Salvataggio..." : "Salva"}
                        </Button>
                    </div>
                </div>
                <div className="w-1/3 ml-4">
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <PostStatusSelect
                                initialStatus={formData.status}
                                onChange={(val) => updateForm("status", val)}
                            />
                        </div>
                        <div className="mb-8">
                            <CategorySelect
                                initialValue={formData.category}
                                onValueChange={(val) => updateForm("category", val)}
                                categories={categories}
                                loading={catLoading}
                                error={catError}
                            />
                        </div>
                        <div className="mb-8">
                            <TagSelect
                                initialValue={formData.tag}
                                onValueChange={(val) => updateForm("tag", val)}
                                tags={tags}
                                loading={tagLoading}
                                error={tagError}
                            />
                        </div>
                        <div className="mb-8">
                            <label className="text-sm font-medium">Carica immagine</label>
                            <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
                            {file && (
                                <Button type="button" onClick={async () => {
                                    const res = await edgestore.publicFiles.upload({
                                        file,
                                        onProgressChange: (progress) => console.log(progress),
                                    });
                                    console.log(res);
                                    toast.success("Immagine caricata con successo!");
                                }}>
                                    Carica
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
