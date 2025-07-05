"use client";
import TaxonomyForm, { TaxonomyFormData } from "@/app/components/ui/TaxonomyForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { headers } from "next/headers";

export default function CreateTaxonomyPage() {
    // Ottieni le intestazioni della richiesta corrente per inoltrare il cookie all'API
    const requestHeaders = headers();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: TaxonomyFormData) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/dashboard/taxonomy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Cookie': (await requestHeaders).get('cookie') || ''
                },
                // Cache settings if needed, e.g., no-store for dynamic data
                cache: 'no-store',
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
