import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createInquiry, getParticipationById, getPosterUserId } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to submit an inquiry" }, { status: 401 });
    }

    const { participationId, subject, amount, message } = await request.json();
    const participation = getParticipationById(participationId);
    if (!participation) {
      return NextResponse.json({ error: "Participation not found" }, { status: 404 });
    }

    const inquiry = createInquiry({
      participationId,
      fromUserId: user.id,
      fromUserName: user.fullName,
      fromUserType: user.role === "broker" ? "broker" : "credit_union",
      toUserId: getPosterUserId(participation.postedById, participation.postedByType),
      subject,
      amount: Number(amount),
      message,
    });

    return NextResponse.json({ inquiry });
  } catch {
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
