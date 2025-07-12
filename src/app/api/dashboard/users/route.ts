// src/app/api/dashboard/users/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { auth } from "@/auth/auth"; // Importa la tua istanza di better-auth
import { headers } from "next/headers"; // Per accedere alle intestazioni della richiesta

export async function GET() {
  /*   const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: new Headers(await requestHeaders),
    });
  
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    } */

  // Facoltativo: controllo admin
  // if (session.user.role !== "admin") {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ message: "OK", users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}