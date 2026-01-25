import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/contexts/TenantContext";
import { BarChart3, Building2, DollarSign, ShieldCheck } from "lucide-react";

const SaasAdminDashboard = () => {
  const { tenants, plans, updateSubscriptionStatus } = useTenant();

  const activeTenants = tenants.filter((tenant) =>
    ["active", "grace"].includes(tenant.subscriptionStatus)
  );
  const inactiveTenants = tenants.filter((tenant) =>
    ["suspended", "expired"].includes(tenant.subscriptionStatus)
  );

  const mrr = activeTenants.reduce((total, tenant) => {
    const plan = plans.find((entry) => entry.id === tenant.planId);
    if (!plan) return total;
    const monthly =
      tenant.billingCycle === "yearly" ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;
    return total + monthly;
  }, 0);

  const healthRows = tenants.map((tenant, index) => {
    const staffUsage = tenant.usage.staff / tenant.limits.staff;
    const patientUsage = tenant.usage.patients / tenant.limits.patients;
    const storageUsage = tenant.usage.storageGb / tenant.limits.storageGb;
    const peakUsage = Math.max(staffUsage, patientUsage, storageUsage);
    const risk = peakUsage > 0.9 ? "High" : peakUsage > 0.75 ? "Medium" : "Low";
    const uptime = Number((99.9 - index * 0.2).toFixed(2));
    const latency = 120 + index * 25;
    const incidents = risk === "High" ? 2 : risk === "Medium" ? 1 : 0;
    return {
      ...tenant,
      peakUsage,
      risk,
      uptime,
      latency,
      incidents,
    };
  });

  const avgUptime =
    healthRows.reduce((sum, tenant) => sum + tenant.uptime, 0) / Math.max(healthRows.length, 1);
  const atRiskTenants = healthRows.filter((tenant) => tenant.risk !== "Low").length;
  const openIncidents = healthRows.reduce((sum, tenant) => sum + tenant.incidents, 0);

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SaaS Owner Dashboard</h1>
          <p className="text-muted-foreground">Monitor tenant health, revenue, and subscriptions</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-primary" />
                Monthly Recurring Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">₦{mrr.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Across active subscriptions</p>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-primary" />
                Total Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{tenants.length}</p>
              <p className="text-xs text-muted-foreground">Hospitals onboarded</p>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Active Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{activeTenants.length}</p>
              <p className="text-xs text-muted-foreground">Active + grace period</p>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-primary" />
                Inactive Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{inactiveTenants.length}</p>
              <p className="text-xs text-muted-foreground">Suspended or expired</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle>Tenant health</CardTitle>
              <CardDescription>Availability, latency, and usage pressure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Avg uptime</span>
                <span className="text-foreground font-medium">{avgUptime.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>At-risk tenants</span>
                <span className="text-foreground font-medium">{atRiskTenants}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Open incidents</span>
                <span className="text-foreground font-medium">{openIncidents}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-healthcare lg:col-span-2">
            <CardHeader>
              <CardTitle>Tenant health monitoring</CardTitle>
              <CardDescription>Real-time operational status per hospital</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {healthRows.map((tenant) => (
                <div
                  key={tenant.id}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{tenant.profile.name}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>Uptime {tenant.uptime}%</span>
                      <span>Latency {tenant.latency}ms</span>
                      <span>Usage {(tenant.peakUsage * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={tenant.risk === "High" ? "destructive" : "secondary"}>
                      {tenant.risk} risk
                    </Badge>
                    <Badge variant={tenant.incidents > 0 ? "destructive" : "default"}>
                      {tenant.incidents} incidents
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="card-healthcare">
          <CardHeader>
            <CardTitle>Tenant subscriptions</CardTitle>
            <CardDescription>Manage hospital plans and access status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tenants.map((tenant) => {
              const plan = plans.find((entry) => entry.id === tenant.planId);
              const isActive = ["active", "grace"].includes(tenant.subscriptionStatus);
              return (
                <div
                  key={tenant.id}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{tenant.profile.name}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{plan?.name ?? "Plan"}</Badge>
                      <span>{tenant.billingCycle}</span>
                      <span>Next billing: {tenant.nextBillingDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={isActive ? "default" : "destructive"}>
                      {tenant.subscriptionStatus}
                    </Badge>
                    <Button
                      variant={isActive ? "outline" : "default"}
                      onClick={() =>
                        updateSubscriptionStatus(tenant.id, isActive ? "suspended" : "active")
                      }
                    >
                      {isActive ? "Suspend" : "Activate"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SaasAdminDashboard;
