"use client";

import { TableCell, TableRow } from "./table";
import { formatDate } from "@/app/utils/utils";
import { EditButton } from "./editbutton";
import { Button } from "./button";
import { Trash2 } from "lucide-react";

interface MyTableRowProps {
  data: Article | PageData | TaxonomyData | UserData;
  onDelete: (id: number) => void;
  type?: "articles" | "pages" | "taxonomy" | "users";
}

export default function MyTableRow({
  data,
  onDelete,
  type,
}: MyTableRowProps) {
  const handleDelete = async () => {
    if (!window.confirm("Sei sicuro di voler eliminare questa voce?")) return;

    try {
      let url = "";
      switch (type) {
        case "pages":
          url = `/api/dashboard/pages/${data.id}`;
          break;
        case "taxonomy":
          url = `/api/dashboard/taxonomy/${data.id}`;
          break;
        case "users":
          url = `/api/dashboard/users/${data.id}`;
          break;
        default:
          url = `/api/dashboard/articles/${data.id}`;
          break;
      }

      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) throw new Error("Errore durante l'eliminazione");
      onDelete(data.id);
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };

  // --- RENDER: Pages ---
  if (type === "pages") {
    const page = data as PageData;
    return (
      <TableRow>
        <TableCell className="font-medium">{page.id}</TableCell>
        <TableCell>{page.title}</TableCell>
        <TableCell>
          <a
            href={`/pages/${page.url}`}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            /pages/{page.url}
          </a>
        </TableCell>
        <TableCell>
          <StatusBadge status={page.status} />
        </TableCell>
        <TableCell>
          <RowActions url={`pages/${page.id}/edit`} onDelete={handleDelete} />
        </TableCell>
      </TableRow>
    );
  }

  // --- RENDER: Taxonomy ---
  if (type === "taxonomy") {
    const taxonomy = data as TaxonomyData;
    return (
      <TableRow>
        <TableCell className="font-medium">{taxonomy.id}</TableCell>
        <TableCell>{taxonomy.name}</TableCell>
        <TableCell>{taxonomy.slug}</TableCell>
        <TableCell>
          <StatusBadge status={taxonomy.type} isTaxonomy />
        </TableCell>
        <TableCell>
          <RowActions url={`taxonomy/${taxonomy.id}/edit`} onDelete={handleDelete} />
        </TableCell>
      </TableRow>
    );
  }

  // --- RENDER: Users ---
  if (type === "users") {
    const user = data as unknown as UserData;
    return (
      <TableRow>
        <TableCell>{user.id}</TableCell>
        <TableCell>{user.name} {user.surname}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell>
          <RowActions url={`users/${user.id}/edit`} onDelete={handleDelete} />
        </TableCell>
      </TableRow>
    );
  }

  // --- RENDER: Articles (default) ---
  const article = data as Article;
  return (
    <TableRow>
      <TableCell className="font-medium">{article.id}</TableCell>
      <TableCell>{article.title}</TableCell>
      <TableCell>{formatDate(article.created_at)}</TableCell>
      <TableCell>
        <StatusBadge status={article.status} />
      </TableCell>
      <TableCell>
        <RowActions url={`articles/${article.id}/edit`} onDelete={handleDelete} />
      </TableCell>
    </TableRow>
  );
}


function RowActions({ url, onDelete }: { url: string; onDelete: () => void }) {
  return (
    <div className="flex space-x-2">
      <EditButton url={url} />
      <Button onClick={onDelete} variant="ghost" size="icon">
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Elimina</span>
      </Button>
    </div>
  );
}

function StatusBadge({
  status,
  isTaxonomy = false,
}: {
  status: string;
  isTaxonomy?: boolean;
}) {
  let classes = "";
  if (isTaxonomy) {
    classes =
      status === "category"
        ? "bg-green-100 text-green-800"
        : "bg-blue-300 text-blue-800";
  } else {
    classes =
      status === "published"
        ? "bg-green-100 text-green-800"
        : status === "draft"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-blue-300 text-blue-800";
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
