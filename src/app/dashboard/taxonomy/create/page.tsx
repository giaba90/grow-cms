"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";

export default function CreateTaxonomyPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        type: "category",
        description: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const updateForm = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (!formData.name || !formData.slug || !formData.type) {
            toast.error("Tutti i campi sono obbligatori");
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch("/api/dashboard/taxonomy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Errore durante la creazione della tassonomia");
            }
            toast.success("Tassonomia creata con successo!");
            router.push("/dashboard/taxonomy");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Errore durante la creazione");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-6">Nuova tassonomia</h1>
            <div className="flex w-full flex-row justify-between items-start flex-nowrap">
                <div className="w-1/3 ml-4">
                    <div className="mb-6">
                        <label className="text-sm font-medium">Nome</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => updateForm("name", e.target.value)}
                            placeholder="Nome tassonomia"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="text-sm font-medium">Slug</label>
                        <Input
                            value={formData.slug}
                            onChange={(e) => updateForm("slug", e.target.value)}
                            placeholder="Slug (es: categoria-news)"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="text-sm font-medium">Tipo</label>
                        <select
                            className="w-full border px-2 py-2"
                            value={formData.type}
                            onChange={(e) => updateForm("type", e.target.value)}
                            required
                            disabled={isLoading}
                        >
                            <option value="category">Categoria</option>
                            <option value="tag">Tag</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="text-sm font-medium">Descrizione</label>
                        <textarea
                            className="w-full border p-2 min-h-[80px]"
                            value={formData.description}
                            onChange={(e) => updateForm("description", e.target.value)}
                            placeholder="Descrizione della tassonomia"
                            disabled={isLoading}
                        />
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
                        <Button type="submit" className="bg-black text-white" disabled={isLoading}>
                            {isLoading ? "Salvataggio..." : "Salva"}
                        </Button>
                    </div>
                </div>
                <div className="w-2/3"></div>
            </div>
        </form >
    );
}