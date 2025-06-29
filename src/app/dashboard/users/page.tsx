"use client";

import { useEffect, useState } from "react";



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
              <th className="p-2">Nome</th>
              <th className="p-2">Cognome</th>
              <th className="p-2">Email</th>
              <th className="p-2">Ruolo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{user.name}</td>
                <td className="p-2">{user.surname}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
