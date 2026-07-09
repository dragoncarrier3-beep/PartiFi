"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOAN_TYPE_LABELS, US_STATES } from "@/lib/types";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`/participations?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    startTransition(() => router.push("/participations"));
  };

  const hasFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search participations, CUs, states..."
            className="pl-10"
            defaultValue={searchParams.get("keyword") || ""}
            onChange={(e) => updateFilter("keyword", e.target.value)}
          />
        </div>
        <Select
          value={searchParams.get("sortBy") || "relevant"}
          onValueChange={(v) => updateFilter("sortBy", v)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevant">Most Relevant</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="amount_high">Highest Amount</SelectItem>
            <SelectItem value="amount_low">Lowest Amount</SelectItem>
            <SelectItem value="rate_low">Lowest Rate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
        <Select
          value={searchParams.get("loanType") || "all"}
          onValueChange={(v) => updateFilter("loanType", v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Loan Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(LOAN_TYPE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("state") || "all"}
          onValueChange={(v) => updateFilter("state", v)}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {US_STATES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("riskRating") || "all"}
          onValueChange={(v) => updateFilter("riskRating", v)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {["AAA", "AA", "A", "BBB", "BB", "B"].map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(v) => updateFilter("status", v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_negotiation">In Negotiation</SelectItem>
            <SelectItem value="settled">Settled</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {isPending && (
        <div className="h-0.5 w-full bg-primary/20 overflow-hidden rounded">
          <div className="h-full w-1/3 bg-primary animate-shimmer rounded" style={{ backgroundSize: "200% 100%" }} />
        </div>
      )}
    </div>
  );
}
