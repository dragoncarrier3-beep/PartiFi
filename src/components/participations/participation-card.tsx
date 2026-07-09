import Link from "next/link";
import { MapPin, TrendingUp, Building2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LoanParticipation } from "@/lib/types";
import { LOAN_TYPE_LABELS } from "@/lib/types";
import { formatCurrency, formatPercent, getStatusColor, getRiskColor } from "@/lib/utils";

interface ParticipationCardProps {
  participation: LoanParticipation;
  showActions?: boolean;
}

export function ParticipationCard({ participation: p }: ParticipationCardProps) {
  return (
    <Link href={`/participations/${p.id}`}>
      <Card className="group h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary/60 to-primary" />
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{LOAN_TYPE_LABELS[p.loanType]}</Badge>
                {p.featured && <Badge variant="warning">Featured</Badge>}
              </div>
              <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {p.title}
              </h3>
            </div>
            <span className={`text-sm font-bold ${getRiskColor(p.riskRating)}`}>{p.riskRating}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Available</p>
              <p className="font-semibold text-lg">{formatCurrency(p.availableAmount)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Rate</p>
              <p className="font-semibold text-lg">{formatPercent(p.interestRate)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              <span className="truncate max-w-[140px]">{p.postedByName}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {p.state}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getStatusColor(p.status)}`}>
              {p.status.replace("_", " ")}
            </span>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.views}</span>
              <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{p.participationPercent}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
