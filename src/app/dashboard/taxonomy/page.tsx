
import { NewButton } from "@/app/components/ui/newbutton";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import MyTable from "@/app/components/ui/mytable";
import { headers } from "next/headers";
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";


export default async function TaxonomyPage() {
  // Ottieni l'oggetto ReadonlyHeaders da next/headers
  const requestHeaders = headers();

  // Crea un nuovo oggetto Headers standard popolandolo direttamente con le intestazioni da requestHeaders.
  // Questo è il modo più robusto e garantisce la compatibilità con il tipo Headers atteso da better-auth.
  const compatibleHeaders = new Headers(requestHeaders as unknown as HeadersInit);

  // Passa l'oggetto Headers compatibile a getSession
  const session = await auth.api.getSession({
    headers: compatibleHeaders,
  });

  if (!session) {
    redirect('/login');
  }
  // Fetch Taxonomy data from the API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/taxonomy`);
  const data = await res.json();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Tassonomie</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-start">
          <NewButton url="create" type="taxonomy" />
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca tassonomia..." className="pl-8" />
        </div>
      </div>
      <div className="border bg-white">
        <MyTable initialData={data.taxonomies} type="taxonomy" />
      </div>
    </div>
  );
}
