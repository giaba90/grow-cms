import { Trash2 } from "lucide-react";
import { EditButton } from "./editbutton";
import DeleteButton from "./DeleteButton";

export function RowActions({ url, type, id }: { url: string; type: string, id: number | string }) {

    return (
        <div className="flex space-x-2">
            <EditButton url={url} />
            <DeleteButton itemId={id} itemType={type} />
        </div>
    );
}