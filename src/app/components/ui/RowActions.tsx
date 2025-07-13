
import { EditButton } from "./editbutton";
import DeleteButton from "./DeleteButton";

interface RowActionsProps {
    url: string;
    type: "articles" | "pages" | "taxonomy" | "users";
    id: number | string | undefined;
}

export function RowActions({ url, type, id }: RowActionsProps) {

    return (
        <div className="flex space-x-2">
            <EditButton url={url} />
            <DeleteButton itemId={id} itemType={type} />
        </div>
    );
}