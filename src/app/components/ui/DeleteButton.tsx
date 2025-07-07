"use client";

import { useState } from "react";
import { Button } from "./button"; // Assicurati che il percorso sia corretto
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteTaxonomy } from "@/app/lib/actions"; // Importa la Server Action
import { Trash2 } from 'lucide-react'; // Importa l'icona del cestino da lucide-react

interface DeleteButtonProps {
    itemId: string | number;
    itemType: string;
}

export default function DeleteButton({ itemId, itemType }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!window.confirm("Sei sicuro di voler eliminare questa voce?")) return;

        try {
            let url = "";
            switch (itemType) {
                case "pages":
                    url = `/api/dashboard/pages/${itemId}`;
                    break;
                case "taxonomy":
                    url = `/api/dashboard/taxonomy/${itemId}`;
                    break;
                case "users":
                    url = `/api/dashboard/users/${itemId}`;
                    break;
                default:
                    url = `/api/dashboard/articles/${itemId}`;
                    break;
            }

            const response = await fetch(url, { method: "DELETE" });
            if (!response.ok) throw new Error("Errore durante l'eliminazione");
            onDelete(itemId);
        } catch (error) {
            console.error("Errore di rete:", error);
        }
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className=" inline-flex items-center justify-center"
        >
            {isDeleting ? (

                "Eliminazione..."
            ) : (
                <Trash2 className="h-4 w-4" /> // The trash icon
            )}
        </Button>
    );
}
