export type UserRole = "guest" | "credit_union" | "broker" | "admin";

export type LoanType =
  | "commercial"
  | "consumer"
  | "real_estate"
  | "auto"
  | "agricultural"
  | "sba";

export type ParticipationStatus =
  | "open"
  | "pending"
  | "in_negotiation"
  | "settled"
  | "closed";

export type RiskRating = "AAA" | "AA" | "A" | "BBB" | "BB" | "B";

export type InquiryStatus = "pending" | "accepted" | "declined" | "completed";

export type SubscriptionPlan = "free" | "premium_cu" | "premium_broker";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  status: "active" | "suspended" | "pending_approval";
  plan: SubscriptionPlan;
}

export interface CreditUnion {
  id: string;
  userId: string;
  name: string;
  charterNumber: string;
  logoUrl?: string;
  description: string;
  assets: number;
  state: string;
  city: string;
  website?: string;
  memberCount: number;
  founded: number;
  verified: boolean;
}

export interface Broker {
  id: string;
  userId: string;
  companyName: string;
  logoUrl?: string;
  description: string;
  licenseNumber: string;
  states: string[];
  dealsCompleted: number;
  totalVolume: number;
  website?: string;
  verified: boolean;
}

export interface LoanParticipation {
  id: string;
  postedById: string;
  postedByType: "credit_union" | "broker";
  postedByName: string;
  title: string;
  loanType: LoanType;
  originalAmount: number;
  availableAmount: number;
  participationPercent: number;
  interestRate: number;
  termMonths: number;
  riskRating: RiskRating;
  state: string;
  description: string;
  collateral?: string;
  borrowerType: string;
  status: ParticipationStatus;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  views: number;
  inquiries: number;
}

export interface Inquiry {
  id: string;
  participationId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserType: "credit_union" | "broker";
  toUserId: string;
  subject: string;
  amount: number;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  participationId: string;
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  imageUrl: string;
  publishedAt: string;
  featured: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "pdf" | "guide" | "template" | "webinar";
  url: string;
  featured: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "inquiry" | "settlement" | "system" | "approval";
}

export interface Analytics {
  totalUsers: number;
  creditUnions: number;
  brokers: number;
  activeParticipations: number;
  totalVolume: number;
  settledDeals: number;
  monthlyRevenue: number;
  pendingApprovals: number;
}

export interface SearchFilters {
  keyword?: string;
  loanType?: LoanType | "all";
  state?: string;
  minAmount?: number;
  maxAmount?: number;
  minRate?: number;
  maxRate?: number;
  riskRating?: RiskRating | "all";
  status?: ParticipationStatus | "all";
  sortBy?: "relevant" | "newest" | "amount_high" | "amount_low" | "rate_low";
}

export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  commercial: "Commercial",
  consumer: "Consumer",
  real_estate: "Real Estate",
  auto: "Auto",
  agricultural: "Agricultural",
  sba: "SBA",
};

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];
