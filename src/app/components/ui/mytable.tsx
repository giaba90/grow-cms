"use client";

import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "./table";
import { useState } from "react";
import MyTableRow from "./mytablerow";

// Tipi supportati in una sola unione coerente
type TableData = Article | PageData | TaxonomyData;

interface MyTableProps {
  initialData: TableData[];
  type?: "articles" | "pages" | "taxonomy";
}

export default function MyTable({ initialData, type = "articles" }: MyTableProps) {
  const [rows, setRows] = useState<TableData[]>(initialData);

  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const renderTableHeader = () => {
    if (type === "pages") {
      return (
        <TableRow>
          <TableHead className="w-20 font-bold">ID</TableHead>
          <TableHead className="font-bold">Titolo</TableHead>
          <TableHead className="font-bold">URL</TableHead>
          <TableHead className="w-32 font-bold">Stato</TableHead>
          <TableHead className="w-32 font-bold">Operazioni</TableHead>
        </TableRow>
      );
    }

    if (type === "taxonomy") {
      return (
        <TableRow>
          <TableHead className="w-20 font-bold">ID</TableHead>
          <TableHead className="font-bold">Nome</TableHead>
          <TableHead className="font-bold">Slug</TableHead>
          <TableHead className="w-32 font-bold">Tipo</TableHead>
          <TableHead className="w-32 font-bold">Operazioni</TableHead>
        </TableRow>
      );
    }

    // Default: articles
    return (
      <TableRow>
        <TableHead className="w-20 font-bold">ID</TableHead>
        <TableHead className="font-bold">Titolo</TableHead>
        <TableHead className="font-bold">Creato il</TableHead>
        <TableHead className="w-32 font-bold">Stato</TableHead>
        <TableHead className="w-32 font-bold">Operazioni</TableHead>
      </TableRow>
    );
  };

  return (
    <Table>
      <TableHeader className="bg-gray-50">
        {renderTableHeader()}
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <MyTableRow
            key={row.id}
            data={row}
            onDelete={handleDelete}
            type={type}
          />
        ))}
      </TableBody>
    </Table>
  );
}
