import { NextRequest, NextResponse } from "next/server";
import { register } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role } = await request.json();
    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const result = await register({ email, password, fullName, role });
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ user: result.user, message: "Application submitted for review" });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
