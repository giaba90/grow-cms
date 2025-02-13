// api/dashobard/taxonomy/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { ZodError } from "zod";
import { taxonomyDataSchema } from "@/app/lib/validation";

// GET api/dashboard/taxonomy
export async function GET(req: Request) {
  try {
    const taxonomies = await prisma.taxonomy.findMany();
    return NextResponse.json(taxonomies);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch taxonomies" },
      { status: 500 }
    );
  }
}
