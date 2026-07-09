"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "broker" ? "broker" : "credit_union";
  const [role, setRole] = useState(defaultRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        fullName: formData.get("fullName"),
        role,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8 space-y-4">
            <div className="text-5xl">✓</div>
            <h2 className="text-2xl font-bold">Application Submitted</h2>
            <p className="text-muted-foreground">
              Your membership application is under review. You&apos;ll receive an email once approved by our team.
            </p>
            <Link href="/">
              <Button className="mt-4">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
            <Building2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Join PartiFi</CardTitle>
          <CardDescription>Apply for membership on the loan participation marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Account Type</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_union">Credit Union</SelectItem>
                  <SelectItem value="broker">Vetted Broker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fullName">
                {role === "credit_union" ? "Credit Union Name" : "Company Name"}
              </Label>
              <Input id="fullName" name="fullName" required placeholder="Your institution name" />
            </div>
            <div>
              <Label htmlFor="email">Work Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@institution.org" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={6} placeholder="Min 6 characters" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already a member?{" "}
            <Link href="/login" className="text-primary hover:underline">Sign In</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
