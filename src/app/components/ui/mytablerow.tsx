"use client";

import { TableCell, TableRow } from "./table";
import { formatDate } from "@/app/utils/utils";
import { EditButton } from "./editbutton";
import { Button } from "./button";
import { Trash2 } from "lucide-react";

interface MyTableRowProps {
  data: Article | PageData;
  onDelete: (id: number) => void;
  type?: "articles" | "pages";
}

export default function MyTableRow({
  data,
  onDelete,
  type = "articles",
}: MyTableRowProps) {
  const handleDelete = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questa voce?")) {
      try {
        let url = "";
        if (type === "pages") {
          url = `/api/dashboard/pages/${data.id}`;
        } else {
          url = `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/articles/${data.id}`;
        }
        const response = await fetch(url, { method: "DELETE" });
        if (response.ok) {
          onDelete(data.id);
        } else {
          console.error("Errore durante l'eliminazione");
        }
      } catch (error) {
        console.error("Errore di rete:", error);
      }
    }
  };

  if (type === "pages") {
    const page = data as PageData;
    return (
      <TableRow>
        <TableCell className="font-medium">{page.id}</TableCell>
        <TableCell>{page.title}</TableCell>
        <TableCell>
          <a
            href={"/pages/" + page.url}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            /pages/{page.url}
          </a>
        </TableCell>
        <TableCell>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${page.status === "published"
              ? "bg-green-100 text-green-800"
              : page.status === "draft"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-300 text-blue-800"
              }`}
          >
            {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <EditButton url={`pages/${page.id}/edit`} />
            <Button onClick={handleDelete} variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Elimina</span>
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  // Default: articles
  const article = data as Article;
  return (
    <TableRow>
      <TableCell className="font-medium">{article.id}</TableCell>
      <TableCell>{article.title}</TableCell>
      <TableCell>{formatDate(article.created_at)}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${article.status === "published"
            ? "bg-green-100 text-green-800"
            : article.status === "draft"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-300 text-blue-800"
            }`}
        >
          {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <EditButton url={`articles/${article.id}/edit/`} />
          <Button onClick={handleDelete} variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Elimina</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
