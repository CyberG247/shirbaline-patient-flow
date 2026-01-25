import { useEffect, useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/contexts/TenantContext";
import { useNavigate } from "react-router-dom";
import { fetchTenantInvoices, BillingInvoice } from "@/lib/billing";

const Subscription = () => {
  const { currentTenant, currentPlan } = useTenant();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentTenant) {
      setInvoices([]);
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    const loadInvoices = async () => {
      setIsLoading(true);
      const data = await fetchTenantInvoices(currentTenant.id);
      if (isMounted) {
        setInvoices(data);
        setIsLoading(false);
      }
    };
    loadInvoices();
    return () => {
      isMounted = false;
    };
  }, [currentTenant]);

  const formattedInvoices = useMemo(
    () =>
      invoices.map((invoice) => ({
        ...invoice,
        displayDate: new Date(invoice.invoiceDate).toLocaleDateString("en-NG", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      })),
    [invoices]
  );

  if (!currentTenant || !currentPlan) {
    return null;
  }

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Subscription & Billing</h1>
            <p className="text-muted-foreground">
              Manage plan, usage, and billing history for {currentTenant.profile.name}
            </p>
          </div>
          <Button onClick={() => navigate("/subscribe")}>Upgrade plan</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle>Current plan</CardTitle>
              <CardDescription>Active subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>{currentPlan.name}</span>
                <Badge variant="secondary">{currentTenant.billingCycle}</Badge>
              </div>
              <div>Status: {currentTenant.subscriptionStatus}</div>
              <div>Next billing: {currentTenant.nextBillingDate}</div>
              <div>Staff limit: {currentPlan.staffLimit}</div>
              <div>Patient limit: {currentPlan.patientLimit.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="card-healthcare lg:col-span-2">
            <CardHeader>
              <CardTitle>Billing history</CardTitle>
              <CardDescription>Recent invoices and payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {isLoading && (
                <div className="rounded-lg border border-border px-4 py-6 text-center text-sm">
                  Loading invoices...
                </div>
              )}
              {!isLoading && formattedInvoices.length === 0 && (
                <div className="rounded-lg border border-border px-4 py-6 text-center text-sm">
                  No invoices available yet.
                </div>
              )}
              {!isLoading &&
                formattedInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                  >
                    <div>
                      <p className="text-foreground font-medium">{invoice.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.status.toUpperCase()} · {invoice.displayDate}
                      </p>
                    </div>
                    <span>₦{invoice.amount.toLocaleString()}</span>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Subscription;
