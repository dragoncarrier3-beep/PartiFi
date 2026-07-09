import { FileText, BookOpen, Video, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getResources } from "@/lib/data-store";

const typeIcons = {
  pdf: Download,
  guide: BookOpen,
  template: FileText,
  webinar: Video,
};

export default function ResourcesPage() {
  const resources = getResources();
  const featured = resources.filter((r) => r.featured);
  const all = resources.filter((r) => !r.featured);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Resources & Guides</h1>
        <p className="text-muted-foreground mt-2">
          Compliance templates, regulatory guides, and educational materials for loan participations
        </p>
      </div>

      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((resource) => {
              const Icon = typeIcons[resource.type];
              return (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="mb-2">{resource.category}</Badge>
                    <h3 className="font-semibold">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{resource.description}</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      {resource.type === "webinar" ? "Watch" : "Download"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-6">All Resources</h2>
        <div className="space-y-4">
          {all.map((resource) => {
            const Icon = typeIcons[resource.type];
            return (
              <Card key={resource.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{resource.title}</h3>
                      <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{resource.description}</p>
                  </div>
                  <Badge variant="secondary">{resource.category}</Badge>
                  <Button variant="ghost" size="sm">Access</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
