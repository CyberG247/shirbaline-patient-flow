import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useTenant } from "@/contexts/TenantContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart3, Building2, Shield, Users } from "lucide-react";

const TenantAdminDashboard = () => {
  const { currentTenant, currentPlan, isFeatureEnabled } = useTenant();
  const navigate = useNavigate();

  if (!currentTenant || !currentPlan) {
    return null;
  }

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hospital Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage subscription, roles, and configuration for {currentTenant.profile.name}
            </p>
          </div>
          <Button onClick={() => navigate("/subscription")}>View billing</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-primary" />
                Subscription Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground">{currentPlan.name}</p>
              <Badge variant="secondary">{currentTenant.subscriptionStatus}</Badge>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                Staff Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground">
                {currentTenant.usage.staff}/{currentTenant.limits.staff}
              </p>
              <p className="text-xs text-muted-foreground">Active staff accounts</p>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-primary" />
                Patient Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground">
                {currentTenant.usage.patients}/{currentTenant.limits.patients.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Patients tracked</p>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                Storage Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground">
                {currentTenant.usage.storageGb}/{currentTenant.limits.storageGb} GB
              </p>
              <p className="text-xs text-muted-foreground">Encrypted records</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle>Feature gates</CardTitle>
              <CardDescription>Modules enabled for your subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Wallet & Billing</p>
                  <p className="text-xs text-muted-foreground">Patient wallet and billing flows</p>
                </div>
                <Switch checked={isFeatureEnabled("wallet")} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Reports & Analytics</p>
                  <p className="text-xs text-muted-foreground">Operational reporting dashboards</p>
                </div>
                <Switch checked={isFeatureEnabled("reports")} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Advanced Analytics</p>
                  <p className="text-xs text-muted-foreground">Predictive and trend analytics</p>
                </div>
                <Switch checked={isFeatureEnabled("analytics")} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Custom Integrations</p>
                  <p className="text-xs text-muted-foreground">HL7, EMR, and custom API bridges</p>
                </div>
                <Switch checked={isFeatureEnabled("integrations")} disabled />
              </div>
            </CardContent>
          </Card>

          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle>Operational controls</CardTitle>
              <CardDescription>Configure departments and staff policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <p className="text-foreground font-medium">Departments configured</p>
                  <p className="text-xs text-muted-foreground">12 departments active</p>
                </div>
                <Badge variant="secondary">Configured</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <p className="text-foreground font-medium">Role permissions</p>
                  <p className="text-xs text-muted-foreground">RBAC policies in place</p>
                </div>
                <Badge variant="secondary">Secure</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <p className="text-foreground font-medium">Audit trails</p>
                  <p className="text-xs text-muted-foreground">Logs retained for 365 days</p>
                </div>
                <Badge variant="secondary">Enabled</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default TenantAdminDashboard;
