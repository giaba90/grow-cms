// api/dashboard/users/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { ZodError } from "zod";
import { userDataSchema } from "@/app/lib/validation";
import bcrypt from "bcryptjs";
// GET api/dashboard/users
export async function GET(req: Request) {
  try {
    const users = await prisma.users.findMany();
    return NextResponse.json(
      { message: "Users fetched successfully", users },
      { status: 200 }
    );
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

    const { name, surname, email, role } = data;
    // validate password if it exists
    if (data.password && data.password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }
    // Validate that the email is unique
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const lastlogin = new Date();
    // Hash the password before saving it to the database
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(data.password, salt);

    // Create a new user in the database
    const users = await prisma.users.create({
      data: {
        name,
        surname,
        email,
        password: passwordHash,
        role: role as string,
        lastlogin,
      },
    });
    return NextResponse.json(
      { message: "User created successfully", users },
      { status: 201 }
    );
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
