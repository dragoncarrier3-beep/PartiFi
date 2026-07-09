"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.push(data.redirect || redirect);
    router.refresh();
  };

  const demoAccounts = [
    { email: "admin@partifi.com", role: "Admin" },
    { email: "cu@heritagecu.org", role: "Credit Union" },
    { email: "broker@capitalpartners.com", role: "Broker" },
  ];

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
            <Building2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your PartiFi account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@creditunion.org" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Demo Accounts (password: demo123)</p>
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                className="w-full text-left text-sm p-2 rounded hover:bg-accent transition-colors"
                onClick={() => {
                  const emailInput = document.getElementById("email") as HTMLInputElement;
                  const passInput = document.getElementById("password") as HTMLInputElement;
                  if (emailInput) emailInput.value = acc.email;
                  if (passInput) passInput.value = "demo123";
                }}
              >
                <span className="font-medium">{acc.role}</span>
                <span className="text-muted-foreground"> — {acc.email}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">Register</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
