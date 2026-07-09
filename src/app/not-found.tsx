import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="inline-block mt-8">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
