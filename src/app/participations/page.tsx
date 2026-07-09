import { Suspense } from "react";
import { ParticipationCard } from "@/components/participations/participation-card";
import { SearchFilters } from "@/components/participations/search-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { getParticipations } from "@/lib/data-store";
import type { SearchFilters as SearchFiltersType } from "@/lib/types";
import { Search } from "lucide-react";

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function ParticipationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters: SearchFiltersType = {
    keyword: params.keyword,
    loanType: (params.loanType as SearchFiltersType["loanType"]) || "all",
    state: params.state || "all",
    riskRating: (params.riskRating as SearchFiltersType["riskRating"]) || "all",
    status: (params.status as SearchFiltersType["status"]) || "all",
    sortBy: (params.sortBy as SearchFiltersType["sortBy"]) || "relevant",
  };

  const results = getParticipations(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Loan Participations</h1>
        <p className="text-muted-foreground mt-2">
          Search and filter participation opportunities from verified credit unions and brokers
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <SearchFilters />
      </Suspense>

      <div className="mt-8">
        <p className="text-sm text-muted-foreground mb-4">
          {results.length} participation{results.length !== 1 ? "s" : ""} found
        </p>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No participations found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((p) => (
              <ParticipationCard key={p.id} participation={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
