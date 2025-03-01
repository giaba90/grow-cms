import { useState } from "react";

interface PostTaxonomySelectProps {
  type: taxonomy_type;
  initialStatus?: string[];
  onChange?: (status: string[]) => void;
}

const PostTaxonomySelect: React.FC<PostTaxonomySelectProps> = ({
  type,
  initialStatus = [],
  onChange,
}) => {
  const [status, setStatus] = useState<string[]>(initialStatus);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    setStatus(newStatus);
    onChange?.(newStatus);
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium">{type}</label>
      <select
        id={`post${type}`}
        value={status}
        onChange={handleChange}
        className="border p-2 bg-white mb-6"
        multiple
        size={1}
        onFocus={(e) => (e.target.size = 3)}
        onBlur={(e) => (e.target.size = 1)}
      >
        <option value="none">None</option>
        <option value="sports">Sports</option>
        <option value="work">Work</option>
        <option value="education">Education</option>
        <option value="entertainment">Entertainment</option>
      </select>
    </div>
  );
};

export default PostTaxonomySelect;
