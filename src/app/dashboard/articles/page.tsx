import { Search, Trash2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { formatDate } from "@/app/utils/utils";
import { NewButton } from "@/app/components/ui/newbutton";
import { EditButton } from "@/app/components/ui/editbutton";

export default async function ArticlesPage() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/dashboard/articles`);
  const articles: Article[] = await res.json();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Articoli</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-start">
          <NewButton url="create" />
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca articoli..." className="pl-8" />
        </div>
      </div>

      <div className="border bg-white">
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
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.id}</TableCell>
                <TableCell>{article.title}</TableCell>
                <TableCell>{formatDate(article.created_at)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      article.status === "published"
                        ? "bg-green-100 text-green-800"
                        : article.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-300 text-blue-800"
                    }`}
                  >
                    {article.status.charAt(0).toUpperCase() +
                      article.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <EditButton url={`articles/edit/${article.id}`} />
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Elimina</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
