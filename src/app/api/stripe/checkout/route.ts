import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }

    const { planId } = await request.json();
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      return NextResponse.json({
        message: "Demo mode: Stripe is not configured. In production, this would redirect to Stripe Checkout.",
        demo: true,
      });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    const priceMap: Record<string, string | undefined> = {
      premium_cu: process.env.STRIPE_PRICE_PREMIUM_CU,
      premium_broker: process.env.STRIPE_PRICE_PREMIUM_BROKER,
    };

    const priceId = priceMap[planId];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled`,
      customer_email: user.email,
      metadata: { userId: user.id, planId },
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
