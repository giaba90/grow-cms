// api/dashboard/taxonomy/[type]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { taxonomy_type } from "@prisma/client";


// GET api/dashboard/taxonomy/[type]
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const typeParam = url.searchParams.get("type");
    const type = typeParam as taxonomy_type;

    if (!typeParam) {
        return NextResponse.json(
            { error: "Bad request : Missing taxonomy type" },
            { status: 400 }
        );
    }
    try {
        const taxonomies = await prisma.taxonomy.findMany({
            where: { type: type },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(taxonomies);
    } catch (error) {
        console.error("Error fetching taxonomies:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}