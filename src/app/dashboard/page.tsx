import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDashboardPath } from "@/lib/auth-utils";

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  redirect(getDashboardPath(user.role));
}
