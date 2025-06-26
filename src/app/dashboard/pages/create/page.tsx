//dashboard/pages/create/page.tsx
"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Tiptap from "@/app/components/ui/Tiptap";
import { toast } from "sonner";

export default function CreatePage() {
    const router = useRouter();
    const [formData, setFormData] = useState<PageData>({
        title: "",
        content: "",
        status: "draft",
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const data = await response.json();
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
                    <div className="mb-6">
                        <label className="text-sm font-medium">Stato</label>
                        <select
                            className="w-full border rounded px-2 py-2"
                            value={formData.status}
                            onChange={(e) => updateForm("status", e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="draft">Bozza</option>
                            <option value="published">Pubblicata</option>
                            <option value="archived">Archiviata</option>
                        </select>
                    </div>
                </div>
            </div>
        </form>
    );
}