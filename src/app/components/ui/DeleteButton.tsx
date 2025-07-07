"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "./button";

interface DeleteButtonProps {
    itemId: string;
    itemType: "articles" | "taxonomy" | "pages" | "users";
    redirectAfterDelete?: string; // es. "/dashboard/taxonomy"
}

export default function DeleteButton({
    itemId,
    itemType,
    redirectAfterDelete,
}: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!window.confirm("Sei sicuro di voler eliminare questa voce?")) return;
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/dashboard/${itemType}/${itemId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Errore durante l'eliminazione");

            toast.success("Elemento eliminato");

            if (redirectAfterDelete) {
                router.push(redirectAfterDelete);
            } else {
                router.refresh(); // ricarica la pagina corrente
            }
        } catch (err) {
            console.error(err);
            toast.error("Errore durante l'eliminazione");
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
            className="inline-flex items-center justify-center"
        >
            {isDeleting ? "Eliminazione..." : <Trash2 className="h-4 w-4" />}
        </Button>
    );
}
