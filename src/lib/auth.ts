import { cookies } from "next/headers";
import type { User, UserRole } from "./types";
import { getUserByEmail, getUserById } from "./data-store";
import { DEMO_PASSWORD } from "./seed-data";

const AUTH_COOKIE = "partifi_session";

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(AUTH_COOKIE)?.value;
  if (!sessionId) return null;
  return getUserById(sessionId) ?? null;
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User } | { error: string }> {
  const user = getUserByEmail(email);
  if (!user) return { error: "Invalid email or password" };
  if (password !== DEMO_PASSWORD) return { error: "Invalid email or password" };
  if (user.status === "suspended") return { error: "Your account has been suspended. Contact support." };
  if (user.status === "pending_approval") return { error: "Your account is pending approval. You'll receive an email once approved." };

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { user };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export async function register(data: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}): Promise<{ user: User } | { error: string }> {
  const existing = getUserByEmail(data.email);
  if (existing) return { error: "An account with this email already exists" };

  const newUser: User = {
    id: `user-${Date.now()}`,
    email: data.email,
    role: data.role,
    fullName: data.fullName,
    createdAt: new Date().toISOString(),
    status: "pending_approval",
    plan: "free",
  };

  // For demo, auto-login after register
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, newUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { user: newUser };
}

export { getDashboardPath } from "./auth-utils";
