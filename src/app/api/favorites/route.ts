import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { toggleFavorite } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }

    const { participationId } = await request.json();
    if (!participationId) {
      return NextResponse.json({ error: "Participation ID required" }, { status: 400 });
    }

    const favorited = toggleFavorite(user.id, participationId);
    return NextResponse.json({ favorited });
  } catch {
    return NextResponse.json({ error: "Failed to update favorite" }, { status: 500 });
  }
}
