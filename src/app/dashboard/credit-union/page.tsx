import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Heart,
  BarChart3,
  Bell,
  CreditCard,
  Settings,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getDashboardPath } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getInquiries,
  getFavorites,
  getParticipationsByUser,
  getNotifications,
  getCreditUnionByUserId,
} from "@/lib/data-store";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

export default async function CreditUnionDashboard() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "credit_union") redirect(getDashboardPath(user.role));

  const cu = getCreditUnionByUserId(user.id);
  const myParticipations = getParticipationsByUser(user.id);
  const inquiries = getInquiries(user.id);
  const favorites = getFavorites(user.id);
  const notifications = getNotifications(user.id).filter((n) => !n.read);

  const profileCompletion = cu ? 85 : 40;
  const receivedInquiries = inquiries.filter((i) => i.toUserId === user.id);
  const sentInquiries = inquiries.filter((i) => i.fromUserId === user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Credit Union Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.fullName}</p>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
              {notifications.length} new
            </Button>
          )}
          <Badge variant={user.plan === "premium_cu" ? "success" : "secondary"}>
            {user.plan === "premium_cu" ? "Premium" : "Free Plan"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "My Listings", value: myParticipations.length, icon: FileText },
          { label: "Received Inquiries", value: receivedInquiries.length, icon: MessageSquare },
          { label: "Sent Inquiries", value: sentInquiries.length, icon: MessageSquare },
          { label: "Saved", value: favorites.length, icon: Heart },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Inquiries</CardTitle>
              <Link href="/participations"><Button variant="ghost" size="sm">Browse</Button></Link>
            </CardHeader>
            <CardContent>
              {receivedInquiries.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No inquiries yet</p>
              ) : (
                <div className="space-y-4">
                  {receivedInquiries.slice(0, 5).map((inq) => (
                    <div key={inq.id} className="flex items-start justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{inq.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">From {inq.fromUserName} · {formatDate(inq.createdAt)}</p>
                        <p className="text-sm mt-2 line-clamp-2">{inq.message}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="font-semibold text-sm">{formatCurrency(inq.amount)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(inq.status)}`}>
                          {inq.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Participations</CardTitle>
            </CardHeader>
            <CardContent>
              {myParticipations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No listings posted yet</p>
              ) : (
                <div className="space-y-3">
                  {myParticipations.map((p) => (
                    <Link key={p.id} href={`/participations/${p.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(p.availableAmount)} available</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(p.status)}`}>
                        {p.status.replace("_", " ")}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-2xl font-bold">{profileCompletion}%</span>
                </div>
                <div className="overflow-hidden h-2 rounded-full bg-muted">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${profileCompletion}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Complete your profile to increase visibility to potential participation partners.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Current plan: <strong className="capitalize">{user.plan.replace("_", " ")}</strong>
              </p>
              {user.plan === "free" ? (
                <Link href="/pricing">
                  <Button className="w-full" size="sm">Upgrade to Premium</Button>
                </Link>
              ) : (
                <form action="/api/stripe/portal" method="POST">
                  <Button type="submit" variant="outline" className="w-full" size="sm">
                    Manage Billing
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/participations" className="block text-sm text-primary hover:underline">Browse Participations</Link>
              <Link href="/resources" className="block text-sm text-primary hover:underline">Compliance Resources</Link>
              <Link href="/news" className="block text-sm text-primary hover:underline">Industry News</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
