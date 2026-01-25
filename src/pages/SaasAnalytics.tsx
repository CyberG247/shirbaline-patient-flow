import { useEffect, useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/contexts/TenantContext";
import { fetchBillingSummary } from "@/lib/billing";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { DollarSign, TrendingUp, Users } from "lucide-react";

const SaasAnalytics = () => {
  const { tenants, plans } = useTenant();
  const [summary, setSummary] = useState({ totalPaid: 0, paidCount: 0, pendingCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadSummary = async () => {
      setIsLoading(true);
      const data = await fetchBillingSummary();
      if (isMounted) {
        setSummary(data);
        setIsLoading(false);
      }
    };
    loadSummary();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeTenants = tenants.filter((tenant) =>
    ["active", "grace"].includes(tenant.subscriptionStatus)
  );

  const currentMrr = useMemo(
    () =>
      activeTenants.reduce((total, tenant) => {
        const plan = plans.find((entry) => entry.id === tenant.planId);
        if (!plan) return total;
        const monthly =
          tenant.billingCycle === "yearly" ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;
        return total + monthly;
      }, 0),
    [activeTenants, plans]
  );

  const revenueTrend = useMemo(() => {
    const base = Math.max(currentMrr, plans[0]?.priceMonthly ?? 0);
    const values = [0.7, 0.78, 0.84, 0.9, 0.96, 1];
    const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    return months.map((month, index) => ({
      month,
      mrr: Math.round(base * values[index]),
    }));
  }, [currentMrr, plans]);

  const chartConfig = {
    mrr: {
      label: "MRR",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SaaS Analytics</h1>
          <p className="text-muted-foreground">Revenue insights and tenant growth metrics</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-primary" />
                Total Revenue Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                ₦{summary.totalPaid.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.paidCount} paid invoices
              </p>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                Monthly Recurring Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">₦{currentMrr.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">+12% vs last month</p>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                Active Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{activeTenants.length}</p>
              <p className="text-xs text-muted-foreground">
                {tenants.length - activeTenants.length} inactive
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="card-healthcare">
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
            <CardDescription>MRR growth over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="mrr" stroke="var(--color-mrr)" strokeWidth={2} dot />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle>Invoice status</CardTitle>
              <CardDescription>Pending vs paid subscriptions</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-semibold text-foreground">{summary.paidCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-semibold text-foreground">{summary.pendingCount}</p>
              </div>
              <Badge variant={summary.pendingCount > 0 ? "destructive" : "secondary"}>
                {summary.pendingCount > 0 ? "Action needed" : "Healthy"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle>Tenant mix</CardTitle>
              <CardDescription>Active plan distribution snapshot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Starter</span>
                <span>{activeTenants.filter((tenant) => tenant.planId === "starter").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Professional</span>
                <span>{activeTenants.filter((tenant) => tenant.planId === "professional").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Enterprise</span>
                <span>{activeTenants.filter((tenant) => tenant.planId === "enterprise").length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading && (
          <div className="text-sm text-muted-foreground">Refreshing billing metrics...</div>
        )}
      </div>
    </MainLayout>
  );
};

export default SaasAnalytics;
