import { NextRequest } from "next/server";
import { updateSession } from "@/app/lib/session";
// Middleware to update the session
export default async function middleware(request: NextRequest) {
  updateSession();
}
