// app/dashboard/taxonomy/page.tsx

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { NewButton } from "@/app/components/ui/newbutton";
import { useTaxonomy } from "@/hooks/useTaxonomy";
import MyTable from "@/app/components/ui/mytable";

export default function TaxonomyPage() {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Usa l'hook useTaxonomy per ottenere tutte le tassonomie (categorie + tag)
  const { categories, tags, catLoading, tagLoading, catError, tagError } = useTaxonomy();
  const [refreshKey, setRefreshKey] = useState(0);

  const allTaxonomies = [
    ...categories.map((c) => ({ ...c, type: "category", description: c.description ?? "" })),
    ...tags.map((t) => ({ ...t, type: "tag", description: t.description ?? "" })),
  ];
  const loading = catLoading || tagLoading;
  const error = catError || tagError;

  const handleDelete = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questa tassonomia?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dashboard/taxonomy/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setRefreshKey((k) => k + 1); // forza il refetch dell'hook
    } catch {
      alert("Errore durante l'eliminazione della tassonomia");
    } finally {
      setDeletingId(null);
    }
  };

  // Forza il refetch dopo una cancellazione
  useEffect(() => {
    // non fa nulla, serve solo per triggerare l'hook
  }, [refreshKey]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Tassonomie</h1>
      <div className="flex flex-col items-start">
        <NewButton url="create" type="taxonomy" />
      </div>
      <div className="border bg-white">
        {loading ? (
          <p className="p-4">Caricamento...</p>
        ) : error ? (
          <p className="p-4 text-red-500">{error}</p>
        ) : allTaxonomies.length === 0 ? (
          <p className="p-4">Nessuna tassonomia trovata.</p>
        ) : (
          <MyTable initialData={allTaxonomies} type="taxonomy" />
        )}
      </div>
    </div>
  );
}
