"use client";

import { useState } from "react";
import { Button } from "./button"; // Assicurati che il percorso sia corretto
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteTaxonomy } from "@/app/lib/actions"; // Importa la Server Action
import { Trash2 } from 'lucide-react'; // Importa l'icona del cestino da lucide-react

interface DeleteButtonProps {
    itemId: string | number;
    itemType: "articles" | "pages" | "taxonomy" | "users";
}

export default function DeleteButton({ itemId, itemType }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        // Use a custom modal instead of `confirm()` for better UX
        // For simplicity, I will still use `confirm()` here, but in a real application you would replace it.
        if (!window.confirm("Sei sicuro di voler eliminare questo elemento?")) {
            return;
        }

        setIsDeleting(true);
        try {
            let result;
            // Based on the type, call the appropriate Server Action
            // For now, we only handle taxonomy as an example.
            // You will need to create similar Server Actions for articles, pages, users.
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
            // Revalidate the current page to reflect the deletion
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
            onClick={handleDelete}
            disabled={isDeleting}
            // Added inline-flex and items-center to properly align the icon and text (if any)
            className=" inline-flex items-center justify-center"
        >
            {isDeleting ? (
                // You can add a spinner here if you want
                "Eliminazione..."
            ) : (
                <Trash2 className="h-4 w-4" /> // The trash icon
            )}
        </Button>
    );
}
