//dashboard/users/[id]/edit/page.tsx
import UserForm from "@/app/components/ui/form/UserForm";
import { getUserData } from "@/app/utils/utils";

interface Params {
    params: Promise<{ id: string }>;
}

export default async function EditUserPage(props: Params) {
    const params = await props.params;
    const { id } = params;

    const data = await getUserData(id);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Modifica Utente</h1>
            <UserForm initialData={data.user} action="edit" />
        </div>
    );
}
