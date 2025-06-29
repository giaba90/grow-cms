"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PenSquare, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function UsersPage() {
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

  const handleDelete = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questo utente?")) return;
    try {
      const res = await fetch(`/api/dashboard/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError("Errore durante l'eliminazione dell'utente");
    }
  };

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
      <div className="overflow-x-auto border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Nome e Cognome</th>
              <th className="p-2">Email</th>
              <th className="p-2">Ruolo</th>
              <th className="p-2">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.name} {user.surname}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  <Link href={`/dashboard/users/${user.id}/edit`} passHref>
                    <Button size="icon" variant="ghost">
                      <PenSquare className="h-4 w-4" />
                      <span className="sr-only">Modifica</span>
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                    <span className="sr-only">Elimina</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
