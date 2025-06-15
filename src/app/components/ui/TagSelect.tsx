"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface Tag {
  id: number;
  name: string;
}

interface TagSelectProps {
  onChange: (tagIds: number[]) => void;
  initialValues?: number[];
}

export default function TagSelect({ onChange, initialValues = [] }: TagSelectProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>(initialValues);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/dashboard/taxonomy?type=tag');
        if (!response.ok) throw new Error('Errore nel caricamento dei tag');
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error('Errore nel caricamento dei tag:', error);
      }
    };

    fetchTags();
  }, []);

  const handleTagChange = (tagId: string) => {
    const numericTagId = parseInt(tagId, 10);
    let newSelectedTags: number[];

    if (selectedTags.includes(numericTagId)) {
      newSelectedTags = selectedTags.filter(id => id !== numericTagId);
    } else {
      newSelectedTags = [...selectedTags, numericTagId];
    }

    setSelectedTags(newSelectedTags);
    onChange(newSelectedTags);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tag</label>
      <Select
        defaultValue={selectedTags[0]?.toString()}
        onValueChange={handleTagChange}
      >
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Seleziona i tag" />
        </SelectTrigger>
        <SelectContent>
          {tags.map((tag) => (
            <SelectItem key={tag.id} value={tag.id.toString()}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  className="mr-2"
                  readOnly
                />
                {tag.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTags.map(tagId => {
          const tag = tags.find(t => t.id === tagId);
          return tag ? (
            <span
              key={tag.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag.name}
              <button
                type="button"
                className="ml-1 hover:text-blue-900"
                onClick={() => handleTagChange(tag.id.toString())}
              >
                ×
              </button>
            </span>
          ) : null;
        })}
      </div>
    </div>
  );
}
