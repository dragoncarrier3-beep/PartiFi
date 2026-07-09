import type {
  User,
  LoanParticipation,
  Inquiry,
  Favorite,
  SearchFilters,
  CreditUnion,
  Broker,
  NewsArticle,
  Resource,
  Notification,
} from "./types";
import {
  DEMO_USERS,
  PARTICIPATIONS,
  INQUIRIES,
  FAVORITES,
  CREDIT_UNIONS,
  BROKERS,
  NEWS,
  RESOURCES,
  NOTIFICATIONS,
  ANALYTICS,
} from "./seed-data";

// In-memory store for demo mutations
let users = [...DEMO_USERS];
let participations = [...PARTICIPATIONS];
let inquiries = [...INQUIRIES];
let favorites = [...FAVORITES];
let notifications = [...NOTIFICATIONS];

export function getUsers() {
  return users;
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getCreditUnions(): CreditUnion[] {
  return CREDIT_UNIONS;
}

export function getCreditUnionById(id: string): CreditUnion | undefined {
  return CREDIT_UNIONS.find((cu) => cu.id === id);
}

export function getCreditUnionByUserId(userId: string): CreditUnion | undefined {
  return CREDIT_UNIONS.find((cu) => cu.userId === userId);
}

export function getBrokers(): Broker[] {
  return BROKERS;
}

export function getBrokerById(id: string): Broker | undefined {
  return BROKERS.find((b) => b.id === id);
}

export function getBrokerByUserId(userId: string): Broker | undefined {
  return BROKERS.find((b) => b.userId === userId);
}

export function getParticipations(filters?: SearchFilters): LoanParticipation[] {
  let results = [...participations];

  if (filters?.keyword) {
    const kw = filters.keyword.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw) ||
        p.postedByName.toLowerCase().includes(kw) ||
        p.state.toLowerCase().includes(kw)
    );
  }

  if (filters?.loanType && filters.loanType !== "all") {
    results = results.filter((p) => p.loanType === filters.loanType);
  }

  if (filters?.state && filters.state !== "all") {
    results = results.filter((p) => p.state === filters.state);
  }

  if (filters?.minAmount) {
    results = results.filter((p) => p.availableAmount >= filters.minAmount!);
  }

  if (filters?.maxAmount) {
    results = results.filter((p) => p.availableAmount <= filters.maxAmount!);
  }

  if (filters?.minRate) {
    results = results.filter((p) => p.interestRate >= filters.minRate!);
  }

  if (filters?.maxRate) {
    results = results.filter((p) => p.interestRate <= filters.maxRate!);
  }

  if (filters?.riskRating && filters.riskRating !== "all") {
    results = results.filter((p) => p.riskRating === filters.riskRating);
  }

  if (filters?.status && filters.status !== "all") {
    results = results.filter((p) => p.status === filters.status);
  }

  switch (filters?.sortBy) {
    case "newest":
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "amount_high":
      results.sort((a, b) => b.availableAmount - a.availableAmount);
      break;
    case "amount_low":
      results.sort((a, b) => a.availableAmount - b.availableAmount);
      break;
    case "rate_low":
      results.sort((a, b) => a.interestRate - b.interestRate);
      break;
    default:
      results.sort((a, b) => {
        const scoreA = (a.featured ? 100 : 0) + a.views;
        const scoreB = (b.featured ? 100 : 0) + b.views;
        return scoreB - scoreA;
      });
  }

  return results;
}

export function getParticipationById(id: string): LoanParticipation | undefined {
  return participations.find((p) => p.id === id);
}

export function getFeaturedParticipations(): LoanParticipation[] {
  return participations.filter((p) => p.featured && p.status === "open");
}

export function getInquiries(userId?: string): Inquiry[] {
  if (!userId) return inquiries;
  return inquiries.filter((i) => i.fromUserId === userId || i.toUserId === userId);
}

export function getInquiriesForParticipation(participationId: string): Inquiry[] {
  return inquiries.filter((i) => i.participationId === participationId);
}

export function createInquiry(data: Omit<Inquiry, "id" | "createdAt" | "status">): Inquiry {
  const inquiry: Inquiry = {
    ...data,
    id: `inq-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  inquiries = [inquiry, ...inquiries];

  const part = participations.find((p) => p.id === data.participationId);
  if (part) {
    participations = participations.map((p) =>
      p.id === data.participationId ? { ...p, inquiries: p.inquiries + 1 } : p
    );
  }

  notifications = [
    {
      id: `notif-${Date.now()}`,
      userId: data.toUserId,
      title: "New Participation Inquiry",
      message: `${data.fromUserName} submitted an inquiry on your participation listing.`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "inquiry",
    },
    ...notifications,
  ];

  return inquiry;
}

export function updateInquiryStatus(id: string, status: Inquiry["status"]): Inquiry | undefined {
  const idx = inquiries.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  inquiries[idx] = { ...inquiries[idx], status };
  return inquiries[idx];
}

export function getFavorites(userId: string): Favorite[] {
  return favorites.filter((f) => f.userId === userId);
}

export function isFavorite(userId: string, participationId: string): boolean {
  return favorites.some((f) => f.userId === userId && f.participationId === participationId);
}

export function toggleFavorite(userId: string, participationId: string): boolean {
  const existing = favorites.find(
    (f) => f.userId === userId && f.participationId === participationId
  );
  if (existing) {
    favorites = favorites.filter((f) => f.id !== existing.id);
    return false;
  }
  favorites = [
    {
      id: `fav-${Date.now()}`,
      userId,
      participationId,
      createdAt: new Date().toISOString(),
    },
    ...favorites,
  ];
  return true;
}

export function getNews(): NewsArticle[] {
  return NEWS;
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return NEWS.find((n) => n.slug === slug);
}

export function getResources(): Resource[] {
  return RESOURCES;
}

export function getNotifications(userId: string): Notification[] {
  return notifications.filter((n) => n.userId === userId);
}

export function markNotificationRead(id: string): void {
  notifications = notifications.map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
}

export function getAnalytics() {
  return ANALYTICS;
}

export function updateUserStatus(userId: string, status: User["status"]): User | undefined {
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], status };
  return users[idx];
}

export function suspendUser(userId: string): User | undefined {
  return updateUserStatus(userId, "suspended");
}

export function approveUser(userId: string): User | undefined {
  return updateUserStatus(userId, "active");
}

export function incrementParticipationViews(id: string): void {
  participations = participations.map((p) =>
    p.id === id ? { ...p, views: p.views + 1 } : p
  );
}

export function getPosterUserId(postedById: string, postedByType: "credit_union" | "broker"): string {
  const cuMap: Record<string, string> = {
    "cu-1": "user-cu-1",
    "cu-2": "user-cu-2",
    "cu-3": "user-cu-3",
  };
  const brokerMap: Record<string, string> = {
    "broker-1": "user-broker-1",
    "broker-2": "user-broker-2",
  };
  return postedByType === "credit_union"
    ? cuMap[postedById] || "user-cu-1"
    : brokerMap[postedById] || "user-broker-1";
}

export function getParticipationsByUser(userId: string): LoanParticipation[] {
  const cu = getCreditUnionByUserId(userId);
  const broker = getBrokerByUserId(userId);
  if (cu) return participations.filter((p) => p.postedById === cu.id);
  if (broker) return participations.filter((p) => p.postedById === broker.id);
  return [];
}
