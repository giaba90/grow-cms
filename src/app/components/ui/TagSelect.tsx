"use client"

import { useEffect, useState } from "react"

function TagSelect({ initialValue, onValueChange }: TagSelectProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/dashboard/taxonomy/?type=tag')
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
        value={initialValue || ""}
        onChange={(e) => onValueChange?.(e.target.value)}
        className="border p-2 bg-white"
      >
        <option value="">Seleziona un Tag</option>
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