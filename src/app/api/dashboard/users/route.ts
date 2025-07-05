import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { ZodError } from "zod";
import { userDataSchema } from "@/app/lib/validation";
import bcrypt from "bcryptjs";
import { auth } from "@/auth/auth"; // Importa la tua istanza di better-auth
import { headers } from "next/headers"; // Per accedere alle intestazioni della richiesta


// GET api/dashboard/users
export async function GET(req: Request) {
  /*  // Ottieni le intestazioni della richiesta per la sessione
   const requestHeaders = await headers();
   const compatibleHeaders = new Headers(requestHeaders); // Crea un oggetto Headers compatibile
 
   // Verifica la sessione dell'utente
   const session = await auth.api.getSession({
     headers: compatibleHeaders,
   });
 
 
   // Se l'utente non è autenticato, restituisci un errore 401
   if (!session) {
     return NextResponse.json(
       { error: "Unauthorized: Authentication required" },
       { status: 401 }
     );
   } */

  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(
      { message: "Users fetched successfully", users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST api/dashboard/users
export async function POST(req: Request) {
  // Ottieni le intestazioni della richiesta per la sessione
  const requestHeaders = await headers();
  const compatibleHeaders = new Headers(requestHeaders); // Crea un oggetto Headers compatibile

  // Verifica la sessione dell'utente
  const session = await auth.api.getSession({
    headers: compatibleHeaders,
  });

  // Se l'utente non è autenticato, restituisci un errore 401
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }


  try {
    const data: User = await req.json();

    // Gestione della validazione Zod:
    // Lasciamo che safeParse avvenga e poi gestiamo l'errore nel blocco catch
    const validationResult = userDataSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.errors }, // Restituisce gli errori di Zod
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data; // Usa i dati validati

    // Validate that the email is unique
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash the password before saving it to the database
    // Assicurati che 'password' sia sempre presente qui se è richiesto
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Create a new user in the database
    const users = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        emailVerified: false, // Imposta a false se non gestisci la verifica dell'email
        createdAt: new Date(), // Prisma gestisce automaticamente i timestamp se configurato
        updatedAt: new Date(), // Anche questo può essere gestito automaticamente

      },
    });
    return NextResponse.json(
      { message: "User created successfully", users },
      { status: 201 }
    );
  } catch (error) {
    // Cattura e gestisci specificamente gli errori Zod se non sono stati catturati prima
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid user data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
