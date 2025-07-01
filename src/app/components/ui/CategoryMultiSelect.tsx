"use client";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface CategoryMultiSelectProps {
  selected: number[];
  onChange: (selected: number[]) => void;
  disabled?: boolean;
}

export default function CategoryMultiSelect({
  selected,
  onChange,
  disabled = false,
}: CategoryMultiSelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/taxonomy-type/category");
        if (!res.ok) throw new Error("Errore nel caricamento delle categorie");
        const data = await res.json();
        setCategories(data.taxonomies || []);
        setError(null);
      } catch (err) {
        setError("Errore nel caricamento delle categorie");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCheckboxChange = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((catId) => catId !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Caricamento categorie...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Categorie</label>
      <div className="flex flex-col gap-2">
        {categories.map((cat) => (
          <label key={cat.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(cat.id)}
              onChange={() => handleCheckboxChange(cat.id)}
              disabled={disabled}
            />
            {cat.name}
          </label>
        ))}
      </div>
    </div>
  );
}