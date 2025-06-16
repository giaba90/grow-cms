"use client";

import { useEffect, useState } from "react";

interface Category {
    id: number;
    name: string;
    slug: string;
    type: string;
}

interface CategorySelectProps {
    value?: string;
    onChange?: (value: string) => void;
}

function CategorySelect({ value, onChange }: CategorySelectProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = useState(value || "");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    "/api/dashboard/taxonomy-type/category"
                );
                if (!response.ok) {
                    throw new Error("Errore nel caricamento delle categorie");
                }
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Errore nel caricamento delle categorie"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Aggiorna il valore selezionato quando cambia il prop value
    useEffect(() => {
        setSelectedValue(value || "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setSelectedValue(newValue);
        onChange?.(newValue);
    };

    if (loading) {
        return <div>Caricamento categorie...</div>;
    }

    if (error) {
        return <div className="text-red-500">Errore: {error}</div>;
    }

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium">Categoria</label>
            <select
                id="categorySelect"
                value={selectedValue}
                onChange={handleChange}
                className="border p-2 bg-white"
            >
                <option value="">Nessuna categoria selezionata</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default CategorySelect;