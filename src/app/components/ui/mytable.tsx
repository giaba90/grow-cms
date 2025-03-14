"use client";

import { useState } from "react";
import { Table, TableBody, TableHeader, TableRow, TableHead } from "./table";
import MyTableRow from "./mytablerow";

export default function MyTable({ initialData }: { initialData: Article[] }) {
  // Stato locale per gestire i dati della tabella
  const [articles, setArticles] = useState<Article[]>(initialData);

  const handleDelete = (id: number) => {
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article.id !== id)
    );
  };

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
        {articles.map((article) => (
          <MyTableRow key={article.id} data={article} onDelete={handleDelete} />
        ))}
      </TableBody>
    </Table>
  );
}
