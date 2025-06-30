// app/dashboard/taxonomy/page.tsx

"use client";
import { NewButton } from "@/app/components/ui/newbutton";
import { useTaxonomy } from "@/hooks/useTaxonomy";
import MyTable from "@/app/components/ui/mytable";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";

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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-start">
          <NewButton url="create" type="taxonomy" />
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca..." className="pl-8" />
        </div>
      </div>
      <div className="border bg-white">
        <MyTable initialData={allTaxonomies} type="taxonomy" />
      </div>
    </div>
  );
}
