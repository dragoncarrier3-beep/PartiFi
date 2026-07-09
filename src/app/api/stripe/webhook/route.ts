import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ received: true, demo: true });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);
    const body = await request.text();
    const sig = request.headers.get("stripe-signature")!;

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "invoice.payment_failed":
        // Handle subscription lifecycle in production
        break;
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
