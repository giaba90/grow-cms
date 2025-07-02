import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { pageDataSchema } from "@/app/lib/validation";
import slugify from "slugify";
import { Prisma } from "@prisma/client";

/**
 * Extracts the numeric ID from a given URL string.
 *
 * @param url - The URL string to extract the ID from.
 * @returns The extracted ID as a number, or `null` if the ID is not found or is not a valid number.
 */
function getId(url: string) {
  const regex = /pages\/(\d+)/;
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

// GET api/dashboard/pages/[id]
export async function GET(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json(
      { error: "Bad request : Missing page ID" },
      { status: 400 }
    );
  }
  try {
    const page = await prisma.page.findUnique({
      where: { id: id },
    });

    if (!page) {
      return NextResponse.json({ error: "page not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Page fetched successfully",
        page: {
          id: page.id,
          title: page.title,
          content: page.content,
          url: page.url,
          status: page.status,
          description: page.description,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
// PUT api/dashboard/pages/[id]
export async function PUT(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json(
      { error: "Bad request : Missing page ID" },
      { status: 400 }
    );
  }

  try {
    const data: PageData = await req.json();
    // check zod schema
    const validationResult = pageDataSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { title, content, status, url, description } = data;

    const updatedPage = await prisma.page.update({
      where: { id: id },
      data: {
        title,
        content,
        status: status, // Use status directly, assuming it matches the expected type
        url: url || slugify(title, { lower: true, strict: true }),
        description: description || content.slice(0, 200),
      },
    });

    return NextResponse.json(
      {
        message: "Page updated successfully",
        page: {
          id: updatedPage.id,
          title: updatedPage.title,
          content: updatedPage.content,
          url: updatedPage.url,
          status: updatedPage.status,
          description: updatedPage.description,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
// DELETE api/dashboard/pages/[id]
export async function DELETE(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json(
      { error: "Bad request : Missing page ID" },
      { status: 400 }
    );
  }

  try {
    await prisma.page.delete({ where: { id: id } });
    return NextResponse.json({ message: "Page deleted" });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
