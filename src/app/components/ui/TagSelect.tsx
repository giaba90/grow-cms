"use client"

import { useEffect, useState } from "react"

interface Tag {
  id: number;
  name: string;
  slug: string;
  type: string;
}

interface TagSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

function TagSelect({ value, onChange }: TagSelectProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedValue, setSelectedValue] = useState(value || "")

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/dashboard/taxonomy-type/tag')
        if (!response.ok) {
          throw new Error('Errore nel caricamento dei tag')
        }
        const data = await response.json()
        setTags(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore nel caricamento dei tag')
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

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