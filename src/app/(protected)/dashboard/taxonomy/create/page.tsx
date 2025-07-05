"use client";
import TaxonomyForm, { TaxonomyFormData } from "@/app/components/ui/TaxonomyForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function CreateTaxonomyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: TaxonomyFormData) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/dashboard/taxonomy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            toast.success("Tassonomia creata!");
            router.push("/dashboard/taxonomy");
            router.refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Errore durante la creazione");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Nuova tassonomia</h1>
            <TaxonomyForm onSubmit={handleCreate} isLoading={isLoading} />
        </>
    );
}
