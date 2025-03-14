import { useState } from "react";

interface PostStatusSelectProps {
  initialStatus?: post_status;
  onChange?: (status: post_status) => void;
}

const PostStatusSelect: React.FC<PostStatusSelectProps> = ({
  initialStatus = "draft",
  onChange,
}) => {
  const [status, setStatus] = useState<post_status>(initialStatus);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as post_status;
    setStatus(newStatus);
    onChange?.(newStatus);
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium">Stato</label>
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
  );
};

export default PostStatusSelect;
