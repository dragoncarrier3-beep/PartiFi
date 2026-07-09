import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Calendar,
  Eye,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParticipationActions } from "@/components/participations/inquiry-form";
import {
  getParticipationById,
  incrementParticipationViews,
  isFavorite,
  getCreditUnionById,
  getBrokerById,
} from "@/lib/data-store";
import { getSession } from "@/lib/auth";
import { LOAN_TYPE_LABELS } from "@/lib/types";
import {
  formatCurrency,
  formatCurrencyFull,
  formatPercent,
  formatDate,
  getStatusColor,
  getRiskColor,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ParticipationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const participation = getParticipationById(id);
  if (!participation) notFound();

  incrementParticipationViews(id);

  const user = await getSession();
  const favorited = user ? isFavorite(user.id, id) : false;

  const poster =
    participation.postedByType === "credit_union"
      ? getCreditUnionById(participation.postedById)
      : getBrokerById(participation.postedById);

  const p = participation;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/participations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary">{LOAN_TYPE_LABELS[p.loanType]}</Badge>
              <span className={`text-sm font-bold px-2 py-0.5 rounded ${getRiskColor(p.riskRating)}`}>
                Risk: {p.riskRating}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getStatusColor(p.status)}`}>
                {p.status.replace("_", " ")}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{p.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{p.postedByName}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{p.state}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Posted {formatDate(p.createdAt)}</span>
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{p.views} views</span>
              <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" />{p.inquiries} inquiries</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{p.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {[
                  { label: "Original Amount", value: formatCurrencyFull(p.originalAmount) },
                  { label: "Available", value: formatCurrencyFull(p.availableAmount) },
                  { label: "Participation %", value: `${p.participationPercent}%` },
                  { label: "Interest Rate", value: formatPercent(p.interestRate) },
                  { label: "Term", value: `${p.termMonths} months` },
                  { label: "Borrower Type", value: p.borrowerType },
                  { label: "Collateral", value: p.collateral || "N/A" },
                  { label: "Risk Rating", value: p.riskRating },
                  { label: "State", value: p.state },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-semibold mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div className="text-center p-4 rounded-xl bg-primary/5">
                <p className="text-sm text-muted-foreground">Available for Participation</p>
                <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(p.availableAmount)}</p>
                <p className="text-sm text-muted-foreground mt-1">at {formatPercent(p.interestRate)}</p>
              </div>

              <ParticipationActions
                participation={p}
                user={user}
                isFavorited={favorited}
              />

              {!user && (
                <p className="text-xs text-center text-muted-foreground">
                  <Link href="/login" className="text-primary hover:underline">Sign in</Link> to submit inquiries and save participations
                </p>
              )}
            </CardContent>
          </Card>

          {poster && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Posted by {participation.postedByType === "credit_union" ? "Credit Union" : "Broker"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">
                  {"name" in poster ? poster.name : poster.companyName}
                </p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{poster.description}</p>
                {poster.verified && (
                  <Badge variant="success" className="mt-3">Verified Member</Badge>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
