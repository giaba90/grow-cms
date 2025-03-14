// api/dashboard/media/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { mediaDataSchema } from "@/app/lib/validation";
function getId(url: string) {
  const regex = /media\/(\d+)/;
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

// GET /api/dashboard/media/:id
export async function GET(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json(
      { error: "Bad request : Missing media ID" },
      { status: 400 }
    );
  }
  try {
    const media = await prisma.media.findUnique({
      where: { id: id },
    });

    if (!media) {
      return NextResponse.json({ error: "media not found" }, { status: 404 });
    }

    return NextResponse.json(media);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
// PUT /api/dashboard/media/:id
export async function PUT(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json(
      { error: "Bad request : Missing media ID" },
      { status: 400 }
    );
  }

  const data: MediaData = await req.json();
  const validationResult = mediaDataSchema.safeParse(data);
  if (!validationResult.success) {
    return NextResponse.json(
      { errors: validationResult.error.errors },
      { status: 400 }
    );
  }

  const { file_name, file_type, file_path, size, created_at } = data;

  try {
    const media = await prisma.media.update({
      where: { id: id },
      data: {
        file_name,
        file_type,
        file_path,
        size,
        created_at,
      },
    });

    return NextResponse.json(media);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/dashboard/media/:id
export async function DELETE(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json(
      { error: "Bad request : Missing media ID" },
      { status: 400 }
    );
  }

  try {
    await prisma.media.delete({ where: { id: id } });
    return NextResponse.json({ message: "media deleted" });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
