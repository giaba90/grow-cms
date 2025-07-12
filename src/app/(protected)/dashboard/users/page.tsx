import { Search } from "lucide-react";
import { Input } from "@components/ui/input";
import { NewButton } from "@/app/components/ui/newbutton";
import MyTable from "@/app/components/ui/mytable";
import { getUsers } from "@/app/lib/getUsers";

export default async function UsersPage() {
  const data = await getUsers();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Utenti</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-start">
          <NewButton url="create" type="users" />
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca utenti..." className="pl-8" />
        </div>
      </div>
      <div className="border bg-white">
        <MyTable type="users" initialData={data} />
      </div>
    </div>
  );
}
