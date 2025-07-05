//dashboard/pages/create/page.tsx
"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Tiptap from "@/app/components/ui/Tiptap";
import { toast } from "sonner";
import PostStatusSelect from "@/app/components/ui/PostStatusSelect";
import { headers } from "next/headers";

export default function CreatePage() {
    // Ottieni le intestazioni della richiesta corrente per inoltrare il cookie all'API
    const requestHeaders = headers();
    const router = useRouter();
    const [formData, setFormData] = useState<PageData>({
        id: 0,
        title: "",
        content: "",
        status: "draft",
        url: "",
        description: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const updateForm = (field: keyof PageData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (!formData.title || !formData.content) {
            toast.error("Il titolo e il contenuto sono obbligatori");
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch("/api/dashboard/pages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Cookie': (await requestHeaders).get('cookie') || ''
                },
                // Cache settings if needed, e.g., no-store for dynamic data
                cache: 'no-store',
                body: JSON.stringify({ ...formData }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Errore durante la creazione della pagina");
            }
            toast.success("Pagina creata con successo!");
            router.push("/dashboard/pages");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Errore durante la creazione della pagina");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-6">Nuova pagina</h1>
            <div className="flex w-full flex-row justify-between items-start flex-nowrap">
                {/* colonna sinistra */}
                <div className="w-2/3">
                    <div className="mb-6">
                        <label className="text-sm font-medium">Titolo</label>
                        <Input
                            className="bg-white"
                            placeholder="Inserisci il titolo..."
                            value={formData.title}
                            onChange={(e) => updateForm("title", e.target.value)}
                            required
                            disabled={isLoading}
                        />


                    </div>
                    <div className="mb-6">
                        <label className="text-sm font-medium">Contenuto</label>
                        <Tiptap onChange={(value) => updateForm("content", value)} />
                    </div>
                    <div className="flex justify-between">
                        <Button
                            type="button"
                            className="bg-gray-200 text-black"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Indietro
                        </Button>
                        <Button
                            type="submit"
                            className="bg-black text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Salvataggio..." : "Salva"}
                        </Button>
                    </div>
                </div>
                {/* colonna destra */}
                <div className="w-1/3 ml-4">
                    <div className="mb-8">
                        <PostStatusSelect
                            initialStatus={formData.status}
                            onChange={(value) => updateForm("status", value)}
                        />
                    </div>
                    <div className="mb-8">
                        <label className="text-sm font-medium">Url</label>
                        <Input
                            className="bg-white"
                            placeholder="inserisci url personalizzato..."
                            value={formData.url}
                            onChange={(e) => updateForm("url", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-8">
                        <label className="text-sm font-medium">Descrizione SEO</label>
                        <textarea
                            className="bg-white w-full border p-2 min-h-[80px]"
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