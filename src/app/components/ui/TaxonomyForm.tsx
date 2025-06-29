"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

export type TaxonomyFormData = {
    name: string;
    slug: string;
    type: "category" | "tag";
    description: string;
};

interface TaxonomyFormProps {
    initialData?: TaxonomyFormData;
    onSubmit: (data: TaxonomyFormData) => Promise<void>;
    isLoading?: boolean;
}

export default function TaxonomyForm({
    initialData,
    onSubmit,
    isLoading = false,
}: TaxonomyFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<TaxonomyFormData>(
        initialData ?? {
            name: "",
            slug: "",
            type: "category",
            description: "",
        }
    );

    const updateForm = <K extends keyof TaxonomyFormData>(field: K, value: TaxonomyFormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.type) {
            toast.error("Tutti i campi obbligatori devono essere compilati");
            return;
        }

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <div>
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

                <div>
                    <label className="text-sm font-medium">Slug</label>
                    <Input
                        className="bg-white"
                        value={formData.slug}
                        onChange={(e) => updateForm("slug", e.target.value)}
                        placeholder="Slug (es: categoria-news)"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <select
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
                    <label className="text-sm font-medium">Descrizione</label>
                    <textarea
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
