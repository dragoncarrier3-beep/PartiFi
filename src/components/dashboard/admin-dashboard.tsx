"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  Briefcase,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/lib/types";
import { formatCurrency, getStatusColor } from "@/lib/utils";

interface AdminDashboardProps {
  users: User[];
  analytics: {
    totalUsers: number;
    creditUnions: number;
    brokers: number;
    activeParticipations: number;
    totalVolume: number;
    settledDeals: number;
    monthlyRevenue: number;
    pendingApprovals: number;
  };
}

export function AdminDashboard({ users, analytics }: AdminDashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (userId: string, action: "approve" | "suspend") => {
    setLoading(userId);
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action }),
    });
    setLoading(null);
    router.refresh();
  };

  const pendingUsers = users.filter((u) => u.status === "pending_approval");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users", value: analytics.totalUsers, icon: Users },
          { label: "Credit Unions", value: analytics.creditUnions, icon: Building2 },
          { label: "Brokers", value: analytics.brokers, icon: Briefcase },
          { label: "Active Listings", value: analytics.activeParticipations, icon: FileText },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.totalVolume)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Settled Deals</p>
                <p className="text-2xl font-bold">{analytics.settledDeals.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${analytics.monthlyRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="approvals">
            Pending Approvals
            {pendingUsers.length > 0 && (
              <Badge variant="warning" className="ml-2">{pendingUsers.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Plan</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{u.fullName}</td>
                        <td className="py-3 text-muted-foreground">{u.email}</td>
                        <td className="py-3 capitalize">{u.role.replace("_", " ")}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(u.status)}`}>
                            {u.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 capitalize">{u.plan.replace("_", " ")}</td>
                        <td className="py-3">
                          {u.role !== "admin" && u.status === "active" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleAction(u.id, "suspend")}
                              disabled={loading === u.id}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Membership Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending approvals</p>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{u.fullName}</p>
                        <p className="text-sm text-muted-foreground">{u.email} · {u.role.replace("_", " ")}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAction(u.id, "approve")}
                          disabled={loading === u.id}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleAction(u.id, "suspend")}
                          disabled={loading === u.id}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
