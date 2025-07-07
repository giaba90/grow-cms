import { Search } from "lucide-react";
import { Input } from "@components/ui/input";
import { NewButton } from "@/app/components/ui/newbutton";
import MyTable from "@/app/components/ui/mytable";
import { headers } from "next/headers";

export default async function UsersPage() {
  // Ottieni le intestazioni della richiesta corrente per inoltrare il cookie all'API
  const requestHeaders = headers();
  let data = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/users`, {
      headers: {
        'Cookie': (await requestHeaders).get('cookie') || ''
      },
      // Cache settings if needed, e.g., no-store for dynamic data
      cache: 'no-store'
    });


    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
    }
    data = await res.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

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
        <MyTable type="users" initialData={data.users} />
      </div>
    </div>
  );
}
