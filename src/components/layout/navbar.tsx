"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  Menu,
  X,
  Search,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";
import { getDashboardPath } from "@/lib/auth-utils";

interface NavbarProps {
  user: User | null;
}

const navLinks = [
  { href: "/participations", label: "Browse" },
  { href: "/news", label: "News" },
  { href: "/resources", label: "Resources" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline">PartiFi</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent",
                pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/participations" className="hidden sm:block">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {user.fullName.charAt(0)}
                </div>
                <span className="hidden lg:inline text-sm font-medium">{user.fullName}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-background shadow-lg z-50 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
                    </div>
                    <Link
                      href={getDashboardPath(user.role)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <form action="/api/auth/logout" method="POST">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-accent text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background animate-slide-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
