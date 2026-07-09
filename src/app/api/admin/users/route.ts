import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { approveUser, suspendUser } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, action } = await request.json();
    if (!userId || !action) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const updated =
      action === "approve" ? approveUser(userId) : suspendUser(userId);

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
