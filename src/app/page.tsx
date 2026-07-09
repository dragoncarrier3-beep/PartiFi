import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Search,
  Handshake,
  Shield,
  TrendingUp,
  Users,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ParticipationCard } from "@/components/participations/participation-card";
import { getFeaturedParticipations, getCreditUnions, getBrokers } from "@/lib/data-store";
import { PLATFORM_STATS } from "@/lib/seed-data";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const featured = getFeaturedParticipations();
  const creditUnions = getCreditUnions().slice(0, 3);
  const brokers = getBrokers();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur px-4 py-1.5 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>NCUA-Compliant • Members Only • Vetted Brokers</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              The Marketplace for{" "}
              <span className="text-gradient">Loan Participations</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Credit unions and vetted brokers post, search, and settle loan participations — all in one secure, members-only platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/participations">
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  Browse Participations
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                  Join as Credit Union
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { label: "Credit Unions", value: `${PLATFORM_STATS.creditUnions}+`, icon: Building2 },
              { label: "Total Volume", value: PLATFORM_STATS.totalVolume, icon: TrendingUp },
              { label: "Participations", value: `${PLATFORM_STATS.participations}+`, icon: Handshake },
              { label: "Avg Settlement", value: `${PLATFORM_STATS.avgSettlementDays} days`, icon: Users },
            ].map((stat) => (
              <Card key={stat.label} className="text-center border-0 shadow-md bg-background/80 backdrop-blur">
                <CardContent className="p-6">
                  <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Participations */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold">Featured Participations</h2>
              <p className="text-muted-foreground mt-2">Top opportunities from verified credit unions and brokers</p>
            </div>
            <Link href="/participations" className="hidden sm:block">
              <Button variant="outline">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ParticipationCard key={p.id} participation={p} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How PartiFi Works</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              From discovery to settlement in four simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Join & Verify", desc: "Credit unions and vetted brokers complete membership verification.", icon: Shield },
              { step: "02", title: "Post & Search", desc: "List participations or search thousands of opportunities with advanced filters.", icon: Search },
              { step: "03", title: "Connect & Negotiate", desc: "Submit inquiries, review loan packages, and negotiate terms securely.", icon: Handshake },
              { step: "04", title: "Settle", desc: "Complete participations with automated settlement workflows and documentation.", icon: CheckCircle2 },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="text-sm font-bold text-primary">{item.step}</div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Leading Institutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold mb-6 text-center">Credit Unions</h3>
              <div className="grid grid-cols-3 gap-4">
                {creditUnions.map((cu) => (
                  <Card key={cu.id} className="text-center p-4 hover:shadow-md transition-shadow">
                    <Image src={cu.logoUrl!} alt={cu.name} width={48} height={48} className="mx-auto rounded-lg mb-2" />
                    <p className="text-xs font-medium truncate">{cu.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(cu.assets)} assets</p>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-center">Vetted Brokers</h3>
              <div className="grid grid-cols-2 gap-4">
                {brokers.map((b) => (
                  <Card key={b.id} className="text-center p-4 hover:shadow-md transition-shadow">
                    <Image src={b.logoUrl!} alt={b.companyName} width={48} height={48} className="mx-auto rounded-lg mb-2" />
                    <p className="text-xs font-medium truncate">{b.companyName}</p>
                    <p className="text-xs text-muted-foreground">{b.dealsCompleted} deals</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Members Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { quote: "PartiFi cut our participation settlement time from 30 days to under two weeks. Game changer for our lending team.", author: "Jennifer Walsh", role: "CFO, Heritage Community CU" },
              { quote: "As a broker, having a vetted platform where CUs trust the process has doubled our deal flow in six months.", author: "Robert Chen", role: "Managing Partner, Capital Partners LLC" },
              { quote: "The compliance tools and NCUA-aligned documentation alone are worth the membership. Outstanding platform.", author: "David Martinez", role: "Chief Lending Officer, Mountain West FCU" },
            ].map((t, i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Participation Strategy?</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto">
            Join 500+ credit unions already using PartiFi to grow their lending portfolios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="glass" className="text-base px-8">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
