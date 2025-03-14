// api/dashboard/media/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { ZodError } from "zod";
import { mediaDataSchema } from "@/app/lib/validation";
//GET /api/dashboard/media
export async function GET(req: Request) {
  try {
    const media = await prisma.media.findMany();
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

//POST /api/dashboard/media
export async function POST(req: Request) {
  try {
    const data: MediaData = await req.json();

    if (!mediaDataSchema.safeParse(data).success) {
      // Check if the data is valid according to the schema
      return NextResponse.json(
        // Return validation errors as a response
        { errors: mediaDataSchema.safeParse(data).error },
        { status: 400 }
      );
    }

    const { user_id, file_name, file_type, file_path, size, created_at } = data;

    const media = await prisma.media.create({
      data: {
        user_id,
        file_name,
        file_type,
        file_path,
        size,
        created_at,
      },
    });
    return NextResponse.json(media);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid media data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create media" },
      { status: 500 }
    );
  }
}
