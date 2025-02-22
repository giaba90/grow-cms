// api/dashboard/users/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { ZodError } from "zod";
import { userDataSchema } from "@/app/lib/validation";

// GET api/dashboard/users
export async function GET(req: Request) {
  try {
    const users = await prisma.users.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST api/dashboard/users
export async function POST(req: Request) {
  try {
    const data: UserData = await req.json();

    if (!userDataSchema.safeParse(data).success) {
      // Check if the data is valid according to the schema
      return NextResponse.json(
        // Return validation errors as a response
        { errors: userDataSchema.safeParse(data).error },
        { status: 400 }
      );
    }

    const { name, surname, email, password, role } = data;
    /*     if (!name || !surname || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    } */
    const lastlogin = new Date();
    const users = await prisma.users.create({
      data: {
        name,
        surname,
        email,
        password,
        role: role as string,
        lastlogin,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid users data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create users" },
      { status: 500 }
    );
  }
}
