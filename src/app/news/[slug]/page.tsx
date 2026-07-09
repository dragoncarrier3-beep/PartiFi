import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getNewsBySlug } from "@/lib/data-store";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) notFound();

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Link>

      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
        <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
        <Badge variant="secondary">{article.category}</Badge>
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(article.publishedAt)}</span>
        <span className="flex items-center gap-1"><User className="h-4 w-4" />{article.author}</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {article.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
