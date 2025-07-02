"use client"

import { useEffect, useState } from "react"

// Define the tag type if not already defined elsewhere
type tag = {
  id: string | number;
  name: string;
  slug: string;
};

interface TagSelectProps {
  initialValue?: string;
  onValueChange?: (value: string) => void;
}

function TagSelect({ initialValue, onValueChange, tags, loading, error }: TagSelectProps & {
  tags: tag[];
  loading: boolean;
  error: string | null;
}) {
  const [selectedValue, setSelectedValue] = useState(initialValue || "")

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
    return <div>Caricamento tag...</div>
  }

  if (error) {
    return <div className="text-red-500">Errore: {error}</div>
  }

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium">Tag</label>
      <select
        id="tagSelect"
        value={selectedValue}
        onChange={handleChange}
        className="border p-2 bg-white"
      >
        <option value="">Nessun tag selezionato</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.slug}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TagSelect