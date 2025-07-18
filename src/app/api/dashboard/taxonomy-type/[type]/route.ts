// api/dashboard/taxonomy/taxonomy-type/[type]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/client";


function getType(url: string): taxonomy_type {
    // Extract the [type] param from the URL path
    // Example: /api/dashboard/taxonomy-type/category
    const match = url.match(/\/taxonomy-type\/([^\/\?]+)/);
    if (match && match[1]) {
        return match[1] as taxonomy_type;
    }
    throw new Error("Missing or invalid taxonomy type in URL");
}

// GET api/dashboard/taxonomy-type/[type]
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
            orderBy: { title: "asc" },
        });

        return NextResponse.json(
            {
                message: `Fetched ${taxonomies.length} taxonomies of type ${type}`,
                taxonomies: taxonomies.map((taxonomy: any) => ({
                    id: taxonomy.id,
                    name: taxonomy.title,
                    description: taxonomy.description || "",
                    type: taxonomy.type,
                })),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching taxonomies:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


