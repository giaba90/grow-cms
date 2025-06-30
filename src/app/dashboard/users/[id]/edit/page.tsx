"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

type UserData = {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: string;
    password: string;
};

// Initial form state
const initialForm: UserData = {
    id: 0, // 
    name: "",
    surname: "",
    email: "",
    role: "user",
    password: "",
};


export default function UserEditPage() {
    const [form, setForm] = useState<UserData>(initialForm);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const params = useParams();


    useEffect(() => {
        if (typeof params.id !== "string") return;

        const fetchUser = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/dashboard/users/${params.id}`);
                if (!res.ok) throw new Error();

                const data = await res.json();
                setForm({
                    id: data.users.id ?? 0,
                    name: data.users.name || "",
                    surname: data.users.surname || "",
                    email: data.users.email || "",
                    role: data.users.role || "user",
                    password: "" // non viene mai pre-popolata
                });
            } catch {
                setError("Errore nel caricamento dell'utente");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!params.id) return;

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await fetch(`/api/dashboard/users/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                const msg = data?.errors ? JSON.stringify(data.errors) : "Errore nella modifica dell'utente";
                setError(msg);
                toast.error(msg);
                return;
            }
            setSuccess(true);
            toast.success("Utente modificato con successo!");
            setTimeout(() => router.push("/dashboard/users"), 1000);
        } catch {
            setError("Errore nella modifica dell'utente");
            toast.error("Errore nella modifica dell'utente");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} aria-busy={isLoading}>
            <h1 className="text-2xl font-bold mb-6">Modifica utente</h1>
            <div className="flex w-full flex-row justify-between items-start flex-nowrap">
                <div className="w-2/3 space-y-4">
                    <div>
                        <label className="text-sm font-medium">Nome</label>
                        <Input
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            required
                            disabled={isLoading}
                            className="bg-white"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Cognome</label>
                        <Input
                            name="surname"
                            value={form.surname}
                            onChange={handleInputChange}
                            required
                            disabled={isLoading}
                            className="bg-white"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleInputChange}
                            required
                            disabled={isLoading}
                            className="bg-white"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Password (opzionale)</label>
                        <Input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleInputChange}
                            minLength={6}
                            disabled={isLoading}
                            className="bg-white"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Ruolo</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className="w-full border px-2 py-2 bg-white"
                            required
                        >
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    {error && <p className="text-sm text-red-500" style={{ display: 'none' }}>{error}</p>}
                    {success && <p className="text-sm text-green-600" style={{ display: 'none' }}>Utente modificato con successo!</p>}

                    <div className="flex justify-between pt-6">
                        <Button
                            type="button"
                            className="bg-gray-200 text-black"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Indietro
                        </Button>
                        <Button
                            type="submit"
                            className="bg-black text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Salvataggio..." : "Salva"}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
