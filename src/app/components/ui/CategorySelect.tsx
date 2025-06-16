import { useState } from "react";
import { ChangeEvent } from "react";


interface CategorySelectProps {
  initialValue?: string
  onValueChange?: (value: string) => void
}

 function CategorySelect({ initialValue, onValueChange }: CategorySelectProps) {
    const [status, setStatus] = useState(initialValue || "draft");

    function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
        const value = event.target.value;
        setStatus(value);
        if (onValueChange) {
            onValueChange(value);
        }
    }

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium">Categoria</label>
      <select
        id="postCategory"
        value={status}
        onChange={handleChange}
        className="border p-2 bg-white"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  )
}
export default CategorySelect;