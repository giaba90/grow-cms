import { SignIn } from "@/app/components/auth/signin";
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6
        shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Accedi</h1>
          <p className="mt-2 text-sm text-gray-600">
            Benvenuto! Inserisci le tue credenziali per accedere al tuo account.
            Altrimenti <a href="/signup" className="text-blue-600 hover:underline">registrati</a> se non l'hai fatto.
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}