import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({
        message: "Demo mode: Billing portal would open here with Stripe configured.",
        demo: true,
      });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    const session = await stripe.billingPortal.sessions.create({
      customer: user.email,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return NextResponse.redirect(session.url);
  } catch {
    return NextResponse.json({ error: "Portal unavailable" }, { status: 500 });
  }
}
