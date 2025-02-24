import { Search, PenSquare, Trash2, Plus } from "lucide-react";
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
import Link from "next/link";
import { formatDate } from "@/app/utils/utils";

export default async function ArticlesPage() {
  const res = await fetch("http://localhost:3000/api/dashboard/articles");
  const articles: Article[] = await res.json();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Articles</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-start">
          {" "}
          <Link href="/dashboard/articles/create">
            <Button
              className="cursor-pointer mt-2 bg-black text-white"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>{" "}
          </Link>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search articles..." className="pl-8" />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-32">Operations</TableHead>
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
                    <Button variant="ghost" size="icon">
                      <PenSquare className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
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
