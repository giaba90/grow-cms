"use client";

import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createUser, updateUser } from "@/app/lib/actions";

interface UserFormProps {
    initialData: UserData;
    action: "create" | "edit";
}

export default function UserForm({ initialData, action }: UserFormProps) {

    const [form, setForm] = useState<UserData>({
        name: initialData.name || "",
        email: initialData.email || "",
        // Se initialData ha un ID, lo includiamo nel formData
        ...(initialData.id && { id: initialData.id }),
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const updateForm = <K extends keyof UserData>(field: K, value: UserData[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (action === "create") {
                const result = await createUser(form);
                if (result?.error) {
                    throw new Error(result.error);
                }
                toast.success("Utente creato con successo!");
            } else if (action === "edit") {
                const result = await updateUser(form);
                if (result?.error) {
                    throw new Error(result.error);
                }
                toast.success("Utente aggiornato con successo!");
            }
            router.push("/dashboard/users");
            router.refresh();

        } catch (error) {
            toast.error("Si è verificato un errore imprevisto durante l'azione.");
        } finally {
            setIsLoading(false);
        }

    };



    return (
        <form onSubmit={handleSubmit}>
            <div className="flex w-full flex-row justify-between items-start flex-nowrap">
                <div className="w-2/3 space-y-4">
                    <div>
                        <label className="text-sm font-medium">Nome</label>
                        <Input
                            name="name"
                            value={form.name}
                            onChange={(e) => updateForm("name", e.target.value)}
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
                            onChange={(e) => updateForm("email", e.target.value)}
                            required
                            disabled={isLoading}
                            className="bg-white"
                        />
                    </div>

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