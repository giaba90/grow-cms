"use client";

import { useEffect, useState } from "react";
import { NewButton } from "@/app/components/ui/newbutton";
import MyTable from "@/app/components/ui/mytable";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";

export default function TaxonomyPage() {
  const [allTaxonomies, setAllTaxonomies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaxonomies = async () => {
    try {
      const res = await fetch("/api/dashboard/taxonomy");

      if (!res.ok) {
        throw new Error(`Failed to fetch taxonomies: ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data.taxonomies)) {
        throw new Error("API response does not contain an array");
      }
      setAllTaxonomies(data.taxonomies);
    } catch (err: any) {
      setError(err.message || "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxonomies();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Tassonomie</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-start">
          <NewButton url="create" type="taxonomy" />
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca..." className="pl-8" />
        </div>
      </div>

      {loading && (
        <div className="text-gray-500 p-4 bg-white border">Caricamento...</div>
      )}

      {error && (
        <div className="text-red-600 p-4 bg-white border">Errore: {error}</div>
      )}

      {!loading && !error && (
        <>

          <div className="border bg-white">
            <MyTable initialData={allTaxonomies} type="taxonomy" />
          </div>
        </>
      )}
    </div>
  );
}
