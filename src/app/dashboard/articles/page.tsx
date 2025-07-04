import { Search } from "lucide-react";
import { Input } from "@components/ui/input";
import { NewButton } from "@/app/components/ui/newbutton";
import MyTable from "@/app/components/ui/mytable";
import { auth } from "@/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ArticlesPage() {
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


  let data = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/articles`);
    data = await res.json();
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Articoli</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-start">
          <NewButton url="create" type="articles" />
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca articoli..." className="pl-8" />
        </div>
      </div>
      <div className="border bg-white">
        <MyTable initialData={data.articles} />
      </div>
    </div>
  );
}
