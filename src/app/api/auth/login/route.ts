import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    // Find user
    const user = await prisma.users.findUnique({
      where: {
        email: email, // Ensure `email` is not undefined
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user?.password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      id: user.id,
    });
  } catch (error) {
    console.log("Login error: " + error);
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
