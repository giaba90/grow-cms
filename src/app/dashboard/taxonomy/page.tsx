// app/dashboard/taxonomy/page.tsx

"use client";
import { NewButton } from "@/app/components/ui/newbutton";
import { useTaxonomy } from "@/hooks/useTaxonomy";
import MyTable from "@/app/components/ui/mytable";

export default function TaxonomyPage() {

  // Usa l'hook useTaxonomy per ottenere tutte le tassonomie (categorie + tag)
  const { categories, tags, catLoading, tagLoading, catError, tagError } = useTaxonomy();

  const allTaxonomies = [
    ...categories.map((c) => ({ ...c, type: "category", description: c.description ?? "" })),
    ...tags.map((t) => ({ ...t, type: "tag", description: t.description ?? "" })),
  ];
  const loading = catLoading || tagLoading;
  const error = catError || tagError;

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
