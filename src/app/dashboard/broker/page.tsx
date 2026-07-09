import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MessageSquare,
  Heart,
  BarChart3,
  Bell,
  CreditCard,
  Briefcase,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getDashboardPath } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParticipationCard } from "@/components/participations/participation-card";
import {
  getInquiries,
  getFavorites,
  getParticipations,
  getNotifications,
  getBrokerByUserId,
  getParticipationById,
} from "@/lib/data-store";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

export default async function BrokerDashboard() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "broker") redirect(getDashboardPath(user.role));

  const broker = getBrokerByUserId(user.id);
  const inquiries = getInquiries(user.id);
  const favorites = getFavorites(user.id);
  const notifications = getNotifications(user.id).filter((n) => !n.read);
  const savedParticipations = favorites
    .map((f) => getParticipationById(f.participationId))
    .filter(Boolean);
  const recentParticipations = getParticipations({ status: "open" }).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Broker Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.fullName}</p>
        </div>
        <div className="flex items-center gap-2">
          {broker?.verified && <Badge variant="success">Verified Broker</Badge>}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
              {notifications.length}
            </Button>
          )}
        </div>
      </div>

      {broker && (
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Briefcase className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-bold text-lg">{broker.companyName}</h2>
                <p className="text-sm text-muted-foreground">
                  {broker.dealsCompleted} deals · {formatCurrency(broker.totalVolume)} volume · License {broker.licenseNumber}
                </p>
              </div>
            </div>
            <Link href="/participations">
              <Button><Search className="h-4 w-4" /> Search Participations</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Sent Inquiries", value: inquiries.filter((i) => i.fromUserId === user.id).length, icon: MessageSquare },
          { label: "Saved Participations", value: favorites.length, icon: Heart },
          { label: "Active Deals", value: inquiries.filter((i) => i.status === "accepted").length, icon: BarChart3 },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {inquiries.filter((i) => i.fromUserId === user.id).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No inquiries sent yet</p>
            ) : (
              <div className="space-y-4">
                {inquiries.filter((i) => i.fromUserId === user.id).map((inq) => (
                  <div key={inq.id} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">{inq.subject}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(inq.status)}`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{formatCurrency(inq.amount)} · {formatDate(inq.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Saved Participations</CardTitle>
          </CardHeader>
          <CardContent>
            {savedParticipations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No saved participations</p>
            ) : (
              <div className="space-y-3">
                {savedParticipations.map((p) => p && (
                  <Link key={p.id} href={`/participations/${p.id}`} className="block p-3 rounded-lg hover:bg-muted/50">
                    <p className="font-medium text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(p.availableAmount)} · {p.state}</p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">New Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentParticipations.map((p) => (
            <ParticipationCard key={p.id} participation={p} />
          ))}
        </div>
      </section>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">Plan: <strong className="capitalize">{user.plan.replace("_", " ")}</strong></p>
          <Link href="/pricing"><Button variant="outline" size="sm">Manage Plan</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}
