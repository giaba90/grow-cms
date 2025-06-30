//dashboard/pages/[id]/edit/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import PostStatusSelect from "@/app/components/ui/PostStatusSelect";
import Tiptap from "@/app/components/ui/Tiptap";
import { toast } from "sonner";

export default function EditPagePage() {
    const router = useRouter();
    const params = useParams();

    useSession();

    const [formData, setFormData] = useState<PageData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const hasFetchedPage = useRef(false);

    const updateForm = useCallback(<K extends keyof PageData>(field: K, value: PageData[K]) => {
        setFormData((prev) => prev ? { ...prev, [field]: value } : prev);
    }, []);

    const createInitialFormData = (data: any): PageData => ({
        id: data.id ?? 0,
        title: data.title ?? "",
        content: data.content ?? "",
        status: data.status ?? "draft",
        url: data.url ?? "",
        description: data.description ?? "",
    });

    useEffect(() => {
        if (
            typeof params.id !== "string" ||
            hasFetchedPage.current
        ) return;

        const fetchPage = async () => {
            try {
                const res = await fetch(`/api/dashboard/pages/${params.id}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                setFormData(createInitialFormData(data.page));
                hasFetchedPage.current = true;
            } catch {
                toast.error("Impossibile caricare la pagina");
            }
        };

        fetchPage();
    }, [params.id]);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData?.title || !formData?.content) {
            toast.error("Titolo e contenuto sono obbligatori");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/dashboard/pages/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Errore durante l'aggiornamento");
            }

            toast.success("Pagina aggiornata con successo!");
            router.push("/dashboard/pages");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Errore durante l'aggiornamento");
        } finally {
            setIsLoading(false);
        }
    };

    if (!formData) return <p>Caricamento dati pagina...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-6">Modifica pagina</h1>
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
                            <label className="text-sm font-medium">URL</label>
                            <Input
                                className="bg-white"
                                placeholder="inserisci url..."
                                value={formData.url}
                                onChange={(e) => updateForm("url", e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="mb-8">
                            <label className="text-sm font-medium">Descrizione SEO</label>
                            <textarea
                                className="bg-white w-full border rounded p-2 min-h-[80px]"
                                placeholder="Scrivi una descrizione SEO..."
                                value={(formData.description ?? "").replace(/<[^>]+>/g, "")}
                                onChange={(e) => updateForm("description", e.target.value.replace(/<[^>]+>/g, ""))}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
