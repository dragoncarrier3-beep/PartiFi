import type { UserRole } from "./types";

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "credit_union":
      return "/dashboard/credit-union";
    case "broker":
      return "/dashboard/broker";
    default:
      return "/";
  }
}
