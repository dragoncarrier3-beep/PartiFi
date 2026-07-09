"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Share2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { LoanParticipation, User } from "@/lib/types";
import { formatCurrencyFull } from "@/lib/utils";

interface InquiryFormProps {
  participation: LoanParticipation;
  user: User | null;
  isFavorited: boolean;
}

export function ParticipationActions({ participation, user, isFavorited: initialFavorited }: InquiryFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorited, setFavorited] = useState(initialFavorited);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFavorite = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participationId: participation.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setFavorited(data.favorited);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: participation.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participationId: participation.id,
        subject: formData.get("subject"),
        amount: Number(formData.get("amount")),
        message: formData.get("message"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to submit inquiry");
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      setOpen(false);
      setSuccess(false);
    }, 2000);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="flex-1 sm:flex-none">
            <Send className="h-4 w-4" />
            Submit Inquiry
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Participation Inquiry</DialogTitle>
          </DialogHeader>
          {success ? (
            <div className="py-8 text-center">
              <div className="text-4xl mb-4">✓</div>
              <p className="font-semibold text-emerald-600">Inquiry Submitted!</p>
              <p className="text-sm text-muted-foreground mt-2">The listing owner will be notified.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" required placeholder="Participation interest" />
              </div>
              <div>
                <Label htmlFor="amount">Requested Amount ($)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  required
                  max={participation.availableAmount}
                  defaultValue={participation.availableAmount}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max available: {formatCurrencyFull(participation.availableAmount)}
                </p>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Describe your interest and participation terms..."
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Send Inquiry"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Button variant="outline" size="lg" onClick={handleFavorite}>
        <Heart className={`h-4 w-4 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
        {favorited ? "Saved" : "Save"}
      </Button>

      <Button variant="outline" size="lg" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  );
}
