import { Search } from "lucide-react";
import { Input } from "@components/ui/input";
import { NewButton } from "@/app/components/ui/newbutton";
import MyTable from "@/app/components/ui/mytable";

export default async function ArticlesPage() {

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
