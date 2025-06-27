import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import { NewButton } from "@/app/components/ui/newbutton";
import MyTable from "@/app/components/ui/mytable";


export default async function PageList() {
  // Fetch pages data from the API
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/dashboard/pages`);
  const pages: PageData[] = await res.json();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Pagine</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-start">
          <NewButton url="create" type="pages" />
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca articoli..." className="pl-8" />
        </div>
      </div>
      <div className="border bg-white">
        <MyTable initialData={pages} type="pages" />
      </div>
    </div>
  );
}
