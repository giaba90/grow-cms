"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TaxonomyForm, { TaxonomyFormData } from "@/app/components/ui/TaxonomyForm";
import { toast } from "sonner";

export default function EditTaxonomyPage() {
    const params = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState<TaxonomyFormData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (typeof params.id !== "string") return;
        fetch(`/api/dashboard/taxonomy/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData({
                    name: data.name ?? "",
                    slug: data.slug ?? "",
                    type: data.type ?? "category",
                    description: data.description ?? "",
                });
            })
            .catch(() => toast.error("Errore nel caricamento"));
    }, [params.id]);

    const handleUpdate = async (data: TaxonomyFormData) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/dashboard/taxonomy/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            toast.success("Tassonomia aggiornata!");
            router.push("/dashboard/taxonomy");
            router.refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Errore durante l'aggiornamento");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Modifica tassonomia</h1>
            {formData && <TaxonomyForm initialData={formData} onSubmit={handleUpdate} isLoading={isLoading} />}
        </>
    );
}
