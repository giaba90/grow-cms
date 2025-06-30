
import { NewButton } from "@/app/components/ui/newbutton";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import TaxonomyTable from "./taxonomy-table";

// Funzione asincrona eseguita lato server
async function getTaxonomies() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/taxonomy`, {
    cache: "no-store", // oppure "force-cache" se vuoi caching
  });

  if (!res.ok) {
    throw new Error("Failed to fetch taxonomies");
  }

  const data = await res.json();
  return data.taxonomies;
}

export default async function TaxonomyPage() {
  const taxonomies = await getTaxonomies();

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

      <TaxonomyTable initialData={taxonomies} />
    </div>
  );
}
