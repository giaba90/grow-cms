// api/dashboard/taxonomy/[type]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { taxonomy_type } from "@prisma/client";

function getType(url: string): taxonomy_type {
    // Extract the [type] param from the URL path
    // Example: /api/dashboard/taxonomy/category
    const match = url.match(/\/taxonomy\/([^\/\?]+)/);
    if (match && match[1]) {
        return match[1] as taxonomy_type;
    }
    throw new Error("Missing or invalid taxonomy type in URL");
}

// GET api/dashboard/taxonomy/[type]
export async function GET(req: NextRequest) {
    const type = getType(req.url);
    if (!type) {
        return NextResponse.json(
            { error: "Bad request: Missing taxonomy type" },
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


