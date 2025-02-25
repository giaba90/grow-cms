"use client";

import { TableCell, TableRow } from "./table";
import { formatDate } from "@/app/utils/utils";
import { EditButton } from "./editbutton";
import { Button } from "./button";
import { Trash2 } from "lucide-react";

export default function MyTableRow({
  data,
  onDelete,
}: {
  data: Article;
  onDelete: (id: number) => void;
}) {
  const handleDelete = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questo articolo?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/articles/${data.id}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          onDelete(data.id); // Aggiorna lo stato della tabella
        } else {
          console.error("Errore durante l'eliminazione");
        }
      } catch (error) {
        console.error("Errore di rete:", error);
      }
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{data.id}</TableCell>
      <TableCell>{data.title}</TableCell>
      <TableCell>{formatDate(data.created_at)}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            data.status === "published"
              ? "bg-green-100 text-green-800"
              : data.status === "draft"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-300 text-blue-800"
          }`}
        >
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <EditButton url={`articles/edit/${data.id}`} />
          <Button onClick={handleDelete} variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Elimina</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
