"use client";

import { useEffect, useState } from "react";

function CategorySelect({ initialValue, onValueChange, categories, loading, error }: CategorySelectProps & {
    categories: Category[];
    loading: boolean;
    error: string | null;
}) {
    const [selectedValue, setSelectedValue] = useState(initialValue || "");

    // Aggiorna il valore selezionato quando cambia il prop value
    useEffect(() => {
        setSelectedValue(initialValue || "");
    }, [initialValue]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setSelectedValue(newValue);
        onValueChange?.(newValue);
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