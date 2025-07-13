import UserForm from "@/app/components/ui/form/UserForm";

export default function CreateUser() {

    const initialForm: UserData = {
        name: "",
        email: "",
    }

    return (

        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Crea Nuova Pagina</h1>
            <UserForm initialData={initialForm} action="create" />
        </div>
    );
}
