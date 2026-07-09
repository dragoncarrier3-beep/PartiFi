import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDashboardPath } from "@/lib/auth-utils";
import { getUsers, getAnalytics } from "@/lib/data-store";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default async function AdminDashboardPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect(getDashboardPath(user.role));

  const users = getUsers();
  const analytics = getAnalytics();

  return <AdminDashboard users={users} analytics={analytics} />;
}
