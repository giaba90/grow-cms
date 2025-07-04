import { useEffect, useState } from "react";
import MyTable from "@/app/components/ui/mytable";
import { NewButton } from "@/app/components/ui/newbutton";
import { auth } from "@/auth/auth";
import { headers } from "next/headers";

export default async function UsersPage() {
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

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/dashboard/users");
      if (!res.ok) throw new Error("Errore nel caricamento degli utenti");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users ?? []);
    } catch (err) {
      setError("Errore nel caricamento degli utenti");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-4">Utenti</h1>
        <div className="p-4 bg-white border">Caricamento...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-4">Utenti</h1>
        <div className="p-4 text-red-500 bg-white border">{error}</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-4">Utenti</h1>
        <div className="p-4 bg-white border">Nessun utente trovato.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Utenti</h1>
      <div className="flex flex-col items-start">
        <NewButton url="create" type="users" />
      </div>
      <div className="overflow-x-auto border bg-white">
        <MyTable
          initialData={users}
          type="users"
        />
      </div>
    </div>
  );
}
function redirect(arg0: string) {
  throw new Error("Function not implemented.");
}

