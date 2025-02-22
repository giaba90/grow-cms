// api/dashboard/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { userDataSchema } from "@/app/lib/validation";
import bcrypt from "bcryptjs";
function getId(url: string) {
  const regex = /users\/(\d+)/;
  const match = url.match(regex);
  if (match && match.length > 0) {
    const id = match[1];
    return id;
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

    return NextResponse.json(users);
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
  // Hash the password before saving it to the database
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(data.password, salt);

  try {
    const users = await prisma.users.update({
      where: { id: id },
      data: {
        name: name,
        surname: surname,
        email: email,
        password: passwordHash,
        role: role as string,
        lastlogin: lastlogin,
      },
    });

    return NextResponse.json(users);
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

  try {
    await prisma.users.delete({ where: { id: id } });
    return NextResponse.json({ message: "users deleted" });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
