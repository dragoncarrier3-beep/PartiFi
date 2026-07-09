import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { getDashboardPath } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    const result = await login(email, password);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json({
      user: result.user,
      redirect: getDashboardPath(result.user.role),
    });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
