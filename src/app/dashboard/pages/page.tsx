"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";

interface PageData {
  id: number;
  title: string;
  url: string;
  status: string;
}

export default function PageList() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch("/api/dashboard/pages");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPages(data);
        setError(null);
      } catch {
        setError("Errore nel caricamento delle pagine");
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questa pagina?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dashboard/pages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setPages((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Errore durante l'eliminazione della pagina");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Pagine</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-start">
          <Link href="/dashboard/pages/create">
            <Button>Nuova pagina</Button>
          </Link>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca pagine..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="border bg-white">
        {loading ? (
          <p className="p-4">Caricamento...</p>
        ) : error ? (
          <p className="p-4 text-red-500">{error}</p>
        ) : filteredPages.length === 0 ? (
          <p className="p-4">Nessuna pagina trovata.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Titolo</th>
                <th className="text-left p-2">Stato</th>
                <th className="text-left p-2">URL</th>
                <th className="text-left p-2">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((page) => (
                <tr key={page.id} className="border-t">
                  <td className="p-2 font-medium">{page.title}</td>
                  <td className="p-2">{page.status}</td>
                  <td className="p-2">
                    <a
                      href={"/pages/" + page.url}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      /pages/{page.url}
                    </a>
                  </td>
                  <td className="p-2 flex gap-2">
                    <Link href={`/dashboard/pages/${page.id}/edit`} passHref>
                      <Button size="sm" variant="outline">
                        Modifica
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(page.id)}
                      disabled={deletingId === page.id}
                    >
                      {deletingId === page.id ? "Eliminazione..." : "Elimina"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
