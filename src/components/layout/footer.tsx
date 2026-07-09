import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-4 w-4" />
              </div>
              PartiFi
            </Link>
            <p className="text-sm text-muted-foreground">
              The members-only marketplace for credit union loan participations. Post, search, and settle with confidence.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/participations" className="hover:text-foreground transition-colors">Browse Participations</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">Join as CU</Link></li>
              <li><Link href="/register?role=broker" className="hover:text-foreground transition-colors">Join as Broker</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/news" className="hover:text-foreground transition-colors">News</Link></li>
              <li><Link href="/resources" className="hover:text-foreground transition-colors">Guides & Templates</Link></li>
              <li><Link href="/resources" className="hover:text-foreground transition-colors">Compliance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@partifi.com</li>
              <li>1-800-PARTIFI</li>
              <li>Washington, DC</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PartiFi. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">NCUA Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
