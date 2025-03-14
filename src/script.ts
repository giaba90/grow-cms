import { prisma } from "@/app/prisma/client";
async function testDbConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Connessione a Prisma riuscita!");
    const users = await prisma.users.findMany();
    console.log("📋 Utenti nel database:", users);
  } catch (error) {
    console.error("❌ Errore nella connessione a Prisma:", error);
  } finally {
    await prisma.$disconnect();
  }
}
testDbConnection();
