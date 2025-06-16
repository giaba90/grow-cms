import { useState } from "react";
interface TagSelectProps {
  initialValue?: string
  onValueChange?: (value: string) => void
}

function TagSelect({ initialValue, onValueChange }: TagSelectProps) {
    const [status, setStatus] = useState(initialValue || "draft");

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        const value = event.target.value;
        setStatus(value);
        if (onValueChange) {
            onValueChange(value);
        }
    }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tag</label>
      <select
        id="postStatus"
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

export default TagSelect;