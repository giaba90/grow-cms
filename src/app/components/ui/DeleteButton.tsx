"use client";

import { useState } from "react";
import { Button } from "./button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteTaxonomy } from "@/app/lib/actions"; // Importa la Server Action

interface DeleteButtonProps {
    itemId: string | number;
    itemType: "articles" | "pages" | "taxonomy" | "users";
}

export default function DeleteButton({ itemId, itemType }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        // Utilizza un modal personalizzato invece di `confirm()` per una migliore UX
        // Per semplicità, qui userò ancora `confirm()` ma in un'applicazione reale lo sostituiresti.
        if (!window.confirm("Sei sicuro di voler eliminare questo elemento?")) {
            return;
        }

        setIsDeleting(true);
        try {
            let result;
            // In base al tipo, chiama la Server Action appropriata
            // Per ora, gestiamo solo la tassonomia come esempio.
            // Dovrai creare Server Actions simili per articoli, pagine, utenti.
            if (itemType === "taxonomy") {
                result = await deleteTaxonomy(itemId);
            } else {
                toast.error(`Operazione di eliminazione non supportata per il tipo: ${itemType}.`);
                setIsDeleting(false);
                return;
            }

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success("Elemento eliminato con successo!");
            // Riconvalida la pagina corrente per riflettere l'eliminazione
            router.refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Errore durante l'eliminazione.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete} // La funzione handleDelete è qui
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
        >
            {isDeleting ? "Eliminazione..." : "Elimina"}
        </Button>
    );
}
