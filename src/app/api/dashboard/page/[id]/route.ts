import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { pageDataSchema } from "@/app/lib/validation";
// GET api/dashboard/pages/:page
export async function GET({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json({ error: "Missing page ID" }, { status: 400 });
  }

  try {
    const page = await prisma.page.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!page) {
      return NextResponse.json({ error: "page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
// PUT api/dashboard/pages/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const data: PageData = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Missing page ID" }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json({ error: "Missing page data" }, { status: 400 });
  }
  // Perform validation here if necessary
  if (!pageDataSchema.safeParse(data).success) {
    // Check if the data is valid according to the schema
    return NextResponse.json(
      // Return validation errors as a response
      { errors: pageDataSchema.safeParse(data).error },
      { status: 400 }
    );
  }

  try {
    const updatedPage = await prisma.page.update({
      where: { id: parseInt(id, 10) },
      data: data,
    });

    return NextResponse.json(updatedPage);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE api/dashboard/pages/[id]
export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json({ error: "Missing page ID" }, { status: 400 });
  }

  try {
    await prisma.page.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ message: "Page deleted" });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
