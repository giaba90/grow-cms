// api/dashboard/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { userDataSchema } from "@/app/lib/validation";
function getId(url: string) {
  const regex = /users\/(\d+)/;
  const match = url.match(regex);
  if (match && match.length > 0) {
    const id = parseInt(match[1], 10);
    if (isNaN(id)) {
      return null;
    } else {
      return id;
    }
  } else {
    return null;
  }
}

// GET /api/dashboard/users/:id
export async function GET(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json(
      { error: "Bad request : Missing users ID" },
      { status: 400 }
    );
  }
  try {
    const users = await prisma.users.findUnique({
      where: { id: id },
    });

    if (!users) {
      return NextResponse.json({ error: "users not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "users found", users }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
// PUT /api/dashboard/users/:id
export async function PUT(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json(
      { error: "Bad request : Missing users ID" },
      { status: 400 }
    );
  }

  const data: UserData = await req.json();
  const validationResult = userDataSchema.safeParse(data);
  if (!validationResult.success) {
    return NextResponse.json(
      { errors: validationResult.error.errors },
      { status: 400 }
    );
  }
  const { name, surname, email, role } = data;
  const lastlogin = new Date();

  try {
    const users = await prisma.users.update({
      where: { id: id },
      data: {
        name: name,
        surname: surname,
        email: email,
        role: role as string,
        lastlogin: lastlogin,
      },
    });

    return NextResponse.json(
      { message: "users updated", users },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/dashboard/users/:id
export async function DELETE(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json(
      { error: "Bad request : Missing users ID" },
      { status: 400 }
    );
  }
  // Check if the user exists
  const existingUser = await prisma.users.findUnique({
    where: { id: id },
  });
  if (!existingUser) {
    return NextResponse.json({ error: "users not found" }, { status: 404 });
  }

  try {
    await prisma.users.delete({ where: { id: id } });
    return NextResponse.json({ message: "users deleted" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
