"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { authClient } from "@/app/lib/auth-client";

interface SignUpFormProps {
    // Puoi aggiungere props qui se necessario, ad esempio per i valori iniziali del form
}

export function SignUpForm({ }: SignUpFormProps) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Usa authClient.signUp.email invece di fetch diretto
            const { data, error: authError } = await authClient.signUp.email(
                {
                    email: form.email,
                    password: form.password,
                    name: form.name,
                },
                {
                    // onSuccess e onError sono passati direttamente come opzioni al metodo signUp.email
                    onSuccess: (context) => {
                        // better-auth gestisce l'impostazione dei cookie di sessione automaticamente qui
                        console.log("Registrazione avvenuta con successo:", context.data);
                        router.push("/dashboard"); // Reindirizza alla dashboard in caso di successo
                    },
                    onError: (context) => {
                        // Gestisci errori specifici da better-auth
                        console.error("Registrazione fallita:", context.error);
                        setError(context.error?.message || "Errore nella registrazione.");
                    },
                    // Se hai bisogno di configurazioni aggiuntive per la fetch sottostante,
                    // le passeresti qui, ma non per onSuccess/onError
                    // fetchOptions: {
                    //   headers: { "X-Custom-Header": "Value" }
                    // }
                }
            );

            // Se onError di better-auth non è stato attivato ma data è null e non c'è un oggetto error
            if (!data && !authError) {
                setError("Errore sconosciuto durante la registrazione.");
            }

        } catch (err) {
            console.error("Errore inatteso durante la registrazione:", err);
            setError("Errore inatteso durante la registrazione.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-xl border border-gray-200">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Crea il tuo account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Oppure{" "}
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            accedi al tuo account esistente
                        </Link>
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <Label htmlFor="name" className="sr-only">Nome</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nome"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="email" className="sr-only">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Indirizzo Email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" className="sr-only">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            minLength={8}
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94l-1.72-1.72z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Errore:</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <Button disabled={loading} className="mt-4 w-full text-white bg-black"
                            type="submit">
                            {loading ? "Loading..." : (
                                <>
                                    Registrati <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
