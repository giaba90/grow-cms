import { Search } from "lucide-react";
import { Input } from "@components/ui/input";
import { NewButton } from "@/app/components/ui/newbutton";
import MyTable from "@/app/components/ui/MyTable";
import { getArticles } from "@/app/lib/getArticles";

export default async function ArticlesPage() {

  const data = await getArticles();

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
        <MyTable initialData={data} type="articles" />
      </div>
    </div>
  );
}
