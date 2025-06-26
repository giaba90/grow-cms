"use client";

import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "./table";
import { useState } from "react";
import MyTableRow from "./mytablerow";

interface MyTableProps {
  initialData: Article[] | PageData[];
  type?: "articles" | "pages";
}

export default function MyTable({ initialData, type = "articles" }: MyTableProps) {
  const [rows, setRows] = useState(initialData);

  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((row: any) => row.id !== id));
  };

  if (type === "pages") {
    return (
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-20 font-bold">ID</TableHead>
            <TableHead className="font-bold">Titolo</TableHead>
            <TableHead className="font-bold">URL</TableHead>
            <TableHead className="w-32 font-bold">Stato</TableHead>
            <TableHead className="w-32 font-bold">Operazioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(rows as PageData[]).map((page) => (
            <TableRow key={page.id}>
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
                  <a href={`/dashboard/pages/${page.id}/edit`}>
                    <button className="border rounded px-2 py-1 text-xs hover:bg-gray-100">Modifica</button>
                  </a>
                  <button
                    className="border rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(page.id)}
                  >
                    Elimina
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  // Default: articles
  return (
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="w-20 font-bold">ID</TableHead>
          <TableHead className="font-bold">Titolo</TableHead>
          <TableHead className="font-bold">Creato il</TableHead>
          <TableHead className="w-32 font-bold">Stato</TableHead>
          <TableHead className="w-32 font-bold">Operazioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(rows as Article[]).map((article) => (
          <MyTableRow key={article.id} data={article} onDelete={handleDelete} />
        ))}
      </TableBody>
    </Table>
  );
}
