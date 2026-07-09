import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNews } from "@/lib/data-store";
import { formatDate } from "@/lib/utils";

export default function NewsPage() {
  const articles = getNews();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Industry News</h1>
        <p className="text-muted-foreground mt-2">
          Latest updates on loan participations, regulations, and market trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article, i) => (
          <Link key={article.id} href={`/news/${article.slug}`}>
            <Card className={`group h-full hover:shadow-lg transition-all overflow-hidden ${i === 0 ? "md:col-span-2" : ""}`}>
              <div className={`relative ${i === 0 ? "h-64" : "h-48"} overflow-hidden`}>
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {article.featured && (
                  <Badge className="absolute top-4 left-4" variant="warning">Featured</Badge>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <Badge variant="secondary">{article.category}</Badge>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
                <h2 className={`font-bold group-hover:text-primary transition-colors ${i === 0 ? "text-2xl" : "text-lg"}`}>
                  {article.title}
                </h2>
                <p className="text-muted-foreground mt-2 line-clamp-2">{article.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm text-primary mt-4 font-medium">
                  Read more <ArrowRight className="h-4 w-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
