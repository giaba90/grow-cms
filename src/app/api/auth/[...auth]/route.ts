import { auth } from "@/auth/auth";

export async function POST(req: Request) {
    return auth.handler(req);
}

export async function GET(req: Request) {
    return auth.handler(req);
}
