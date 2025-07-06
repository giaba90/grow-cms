<<<<<<< HEAD:src/app/dashboard/page.tsx
// src/app/dashboard/page.tsx 
import { auth } from "@/auth";
import { redirect } from "next/navigation";
=======
import prisma from "@/app/prisma/client";
>>>>>>> cr/better-auth:src/app/(protected)/dashboard/page.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { BarChart, Users, FileText, Activity } from "lucide-react";
<<<<<<< HEAD:src/app/dashboard/page.tsx

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Nessun redirect qui! L'utente è autenticato e può vedere la dashboard
=======
export default async function Dashboard() {


  const [totalUsers, totalArticles] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
  ]);
>>>>>>> cr/better-auth:src/app/(protected)/dashboard/page.tsx

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Utenti</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articoli Pubblicati</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visite Mensili</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,678</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasso di Attività</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
