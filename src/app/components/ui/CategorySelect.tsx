"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface Category {
  id: number;
  name: string;
}

interface CategorySelectProps {
  onChange: (categoryId: number | null) => void;
  initialValue?: number;
}

export default function CategorySelect({ onChange, initialValue }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/dashboard/taxonomy?type=category');
        if (!response.ok) throw new Error('Errore nel caricamento delle categorie');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Errore nel caricamento delle categorie:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Categoria</label>
      <Select
        defaultValue={initialValue?.toString()}
        onValueChange={(value) => onChange(value ? parseInt(value, 10) : null)}
      >
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Seleziona una categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Nessuna categoria</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
