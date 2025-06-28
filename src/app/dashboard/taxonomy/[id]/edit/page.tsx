"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";

export default function EditTaxonomyPage() {
    const router = useRouter();
    const params = useParams();
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        type: "category",
        description: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (typeof params.id !== "string") return;
        const fetchTaxonomy = async () => {
            try {
                const res = await fetch(`/api/dashboard/taxonomy/${params.id}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                setFormData({
                    name: data.name ?? "",
                    slug: data.slug ?? "",
                    type: data.type ?? "category",
                    description: data.description ?? "",
                });
            } catch {
                toast.error("Impossibile caricare la tassonomia");
            }
        };
        fetchTaxonomy();
    }, [params.id]);

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
            const response = await fetch(`/api/dashboard/taxonomy/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Errore durante la modifica della tassonomia");
            }
            toast.success("Tassonomia aggiornata con successo!");
            router.push("/dashboard/taxonomy");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Errore durante la modifica");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-4">Modifica tassonomia</h1>
            <div className="flex w-full flex-row justify-between items-start flex-nowrap">
                <div className="w-1/3 ml-4">
                    <div className="mb-6">
                        <label className="text-sm font-medium">Nome</label>
                        <Input
                            className="bg-white"
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
                            className="bg-white"
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
                            className="w-full border px-2 py-2 bg-white"
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
                            className="w-full border p-2 min-h-[80px] bg-white"
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
        </form>
    );
}
