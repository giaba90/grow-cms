// api/dashboard/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { auth } from "@/auth/auth";
import { userDataSchema } from "@/app/lib/validation";
import bcrypt from "bcryptjs";

// Helpers
function getUserIdFromUrl(req: NextRequest): string | null {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.length - 1];
  return id && id.length > 0 ? id : null;
}

async function requireAuth(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }
  return session;
}

// GET /api/dashboard/users/:id
export async function GET(req: NextRequest) {
  /*  const session = await requireAuth(req);
   if (session instanceof NextResponse) return session;
  */
  const id = getUserIdFromUrl(req);
  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User found", user }, { status: 200 });
  } catch (error) {
    console.error("GET user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/dashboard/users/:id
export async function PUT(req: NextRequest) {
  /*  const session = await requireAuth(req);
   if (session instanceof NextResponse) return session;
  */
  const id = getUserIdFromUrl(req);
  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  let data: UserData;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = userDataSchema.safeParse(data);

  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.flatten() }, { status: 400 });
  }

  const { name, email, password } = validation.data;

  let passwordHash = "";
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }


  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: passwordHash,
        updatedAt: new Date(),
      },
    });

    // Find and update the account associated with this user
    const account = await prisma.account.findFirst({
      where: { userId: id },
    });

    if (account) {
      await prisma.account.update({
        where: { id: account.id },
        data: {
          password: passwordHash,
        },
      });
    }

    return NextResponse.json({ message: "User updated", user }, { status: 200 });
  } catch (error) {
    console.error("PUT user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/dashboard/users/:id
export async function DELETE(req: NextRequest) {
  /*   const session = await requireAuth(req);
    if (session instanceof NextResponse) return session;
   */
  const id = getUserIdFromUrl(req);
  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
