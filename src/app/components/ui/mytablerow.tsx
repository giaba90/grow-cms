"use client";

import { useState } from "react";
import { TableCell, TableRow } from "./table";
import { Button } from "./button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteTaxonomy } from "@/app/lib/actions"; // Importa la Server Action

export type TableData = ArticleData | PageData | TaxonomyData | UserData;

interface MyTableRowProps {
  data: TableData;
  type?: "articles" | "pages" | "taxonomy" | "users";
}

export default function MyTableRow({ data, type }: MyTableRowProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Sei sicuro di voler eliminare questo elemento?")) {
      return;
    }

    setIsDeleting(true);
    try {
      let result;
      if (type === "taxonomy") {
        result = await deleteTaxonomy(data.id as any);
      } else {
        // Gestisci altri tipi o mostra un errore se la cancellazione non è implementata
        toast.error("Operazione di eliminazione non supportata per questo tipo.");
        setIsDeleting(false);
        return;
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Elemento eliminato con successo!");
      // Non è più necessario aggiornare lo stato locale di `rows` in MyTable.
      // router.refresh() farà sì che MyTable (se è un Server Component) rifetchi i dati.
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante l'eliminazione.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderRowContent = () => {
    if (type === "pages") {
      const page = data as PageData;
      return (
        <>
          <TableCell className="font-medium">{page.id}</TableCell>
          <TableCell>{page.title}</TableCell>
          <TableCell>{page.url}</TableCell>
          <TableCell>{page.status}</TableCell>
        </>
      );
    }

    if (type === "taxonomy") {
      const taxonomy = data as TaxonomyData;
      return (
        <>
          <TableCell className="font-medium">{taxonomy.id}</TableCell>
          <TableCell>{taxonomy.title}</TableCell>
          <TableCell>{taxonomy.type === "category" ? "Categoria" : "Tag"}</TableCell>
        </>
      );
    }

    if (type === "users") {
      const user = data as UserData;
      return (
        <>
          <TableCell className="font-medium">{user.id}</TableCell>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
        </>
      );
    }

    // Default: articles
    const article = data as ArticleData;
    return (
      <>
        <TableCell className="font-medium">{article.id}</TableCell>
        <TableCell>{article.title}</TableCell>
        <TableCell>{new Date(article.created_at).toLocaleDateString()}</TableCell>
        <TableCell>{article.status}</TableCell>
      </>
    );
  };

  return (
    <TableRow>
      {renderRowContent()}
      <TableCell className="text-right">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
        >
          {isDeleting ? "Eliminazione..." : "Elimina"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
