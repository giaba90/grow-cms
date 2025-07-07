import { Table, TableBody, TableHeader, TableRow, TableHead } from "./table";
import MyTableRow, { TableData } from "./mytablerow"; // Importa i tipi e MyTableRow

interface MyTableProps {
  initialData: TableData[];
  type?: "articles" | "pages" | "taxonomy" | "users";
}

export default function MyTable({ initialData, type }: MyTableProps) {


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
          <TableHead className="font-bold">Titolo</TableHead>
          <TableHead className="font-bold">Tipo</TableHead>
          <TableHead className="w-32 font-bold">Operazioni</TableHead>
        </TableRow>
      );
    }

    if (type === "users") {
      return (
        <TableRow>
          <TableHead className="w-20 font-bold">ID</TableHead>
          <TableHead className="font-bold">Nome</TableHead>
          <TableHead className="font-bold">Email</TableHead>
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
    <Table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
      <TableHeader className="bg-gray-100">
        {renderTableHeader()}
      </TableHeader>
      <TableBody className="bg-white divide-y divide-gray-200">
        {initialData.map((row) => (
          <MyTableRow
            key={row.id}
            data={row}
            type={type}
          />
        ))}
      </TableBody>
    </Table>
  );
}
