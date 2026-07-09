"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For credit unions exploring participations",
    features: [
      "Browse all participations",
      "Basic search filters",
      "View news & resources",
      "Limited profile visibility",
      "5 inquiries per month",
    ],
    cta: "Get Started",
    popular: false,
    planId: "free",
  },
  {
    name: "Premium CU",
    price: "$499",
    period: "/month",
    description: "Full platform access for credit unions",
    features: [
      "Unlimited participations posting",
      "Advanced search & alerts",
      "Unlimited inquiries",
      "Settlement workflow tools",
      "Priority support",
      "Analytics dashboard",
      "Compliance toolkit",
    ],
    cta: "Start Free Trial",
    popular: true,
    planId: "premium_cu",
  },
  {
    name: "Premium Broker",
    price: "$799",
    period: "/month",
    description: "For vetted participation brokers",
    features: [
      "Everything in Premium CU",
      "Multi-client management",
      "Broker verification badge",
      "Deal facilitation tools",
      "White-label reports",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Apply as Broker",
    popular: false,
    planId: "premium_broker",
  },
];

const faqs = [
  { q: "Who can join PartiFi?", a: "PartiFi is a members-only platform for federally insured credit unions and NCUA-vetted participation brokers. All members undergo verification before gaining full access." },
  { q: "Is PartiFi NCUA compliant?", a: "Yes. PartiFi is designed to align with NCUA Part 701 participation requirements, including due diligence documentation, concentration monitoring, and reporting standards." },
  { q: "How does settlement work?", a: "Our automated settlement workflow guides both parties through documentation, fund transfer coordination, and servicing agreement execution. Average settlement time is 14 days." },
  { q: "Can I cancel anytime?", a: "Yes. Premium subscriptions can be cancelled at any time through the billing portal. You'll retain access until the end of your billing period." },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    if (planId === "free") {
      window.location.href = "/register";
      return;
    }
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Demo mode: Stripe checkout would open here. Configure STRIPE_SECRET_KEY for live billing.");
      }
    } catch {
      alert("Unable to start checkout. Please try again.");
    }
    setLoading(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Start free and upgrade when you&apos;re ready. No hidden fees, no long-term contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Zap className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleCheckout(plan.planId)}
                disabled={loading === plan.planId}
              >
                {loading === plan.planId ? "Loading..." : plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <CardContent className="p-6">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="text-sm text-muted-foreground mt-2">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          Need a custom enterprise plan?{" "}
          <Link href="mailto:support@partifi.com" className="text-primary hover:underline">
            Contact our team
          </Link>
        </p>
      </div>
    </div>
  );
}
