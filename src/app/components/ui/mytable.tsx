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
            <MyTableRow key={page.id} data={page} onDelete={handleDelete} type="pages" />
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
