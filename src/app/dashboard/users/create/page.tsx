"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

const initialForm = {
    name: "",
    surname: "",
    email: "",
    role: "user", // valore predefinito
    password: ""
};

type UserForm = typeof initialForm;

export default function UserCreatePage() {
    const [form, setForm] = useState<UserForm>(initialForm);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await fetch("/api/dashboard/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                const msg = data?.errors ? JSON.stringify(data.errors) : "Errore nella creazione dell'utente";
                setError(msg);
                toast.error(msg);
                return;
            }

            setSuccess(true);
            toast.success("Utente creato con successo!");
            setTimeout(() => router.push("/dashboard/users"), 1000);
        } catch {
            setError("Errore nella creazione dell'utente");
            toast.error("Errore nella creazione dell'utente");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <h1 className="text-2xl font-bold mb-6">Nuovo utente</h1>

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
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleInputChange}
                            required
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
                    {success && <p className="text-sm text-green-600" style={{ display: 'none' }}>Utente creato con successo!</p>}

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
