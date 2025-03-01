import { useState } from "react";

interface PostTaxonomySelectProps {
  initialStatus?: string;
  onChange?: (status: string) => void;
}

const PostTaxonomySelect: React.FC<PostTaxonomySelectProps> = ({
  initialStatus = "nessuna",
  onChange,
}) => {
  const [status, setStatus] = useState<string>(initialStatus);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as string;
    setStatus(newStatus);
    onChange?.(newStatus);
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium">Tassonomia</label>
      <select
        id="postTaxonomy"
        value={status}
        onChange={handleChange}
        className="border p-2 bg-white"
      >
        <option value="nessuna">Nessuna</option>
        <option value="calcio">Calcio</option>
        <option value="lavor">Lavoro</option>
      </select>
    </div>
  );
};

export default PostTaxonomySelect;
