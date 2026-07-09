import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    open: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    in_negotiation: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    settled: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    closed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    declined: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    completed: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    suspended: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    pending_approval: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getRiskColor(rating: string): string {
  const colors: Record<string, string> = {
    AAA: "text-emerald-600 dark:text-emerald-400",
    AA: "text-emerald-500 dark:text-emerald-400",
    A: "text-blue-600 dark:text-blue-400",
    BBB: "text-amber-600 dark:text-amber-400",
    BB: "text-orange-600 dark:text-orange-400",
    B: "text-red-600 dark:text-red-400",
  };
  return colors[rating] || "text-gray-600";
}
