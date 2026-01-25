import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useTenant } from "@/contexts/TenantContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { currentTenant, currentPlan, isReadOnly } = useTenant();
  const { user } = useAuth();
  const showTenantBanner = currentTenant && user?.role !== "SaaSOwner";
  const isReadOnlyForUser = isReadOnly && user?.role !== "SaaSOwner";
  const status = currentTenant?.subscriptionStatus ?? "active";
  const statusLabel =
    status === "active"
      ? "Active"
      : status === "grace"
      ? "Grace Period"
      : status === "suspended"
      ? "Suspended"
      : "Expired";

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-72">
        <div className="min-h-screen">
          {showTenantBanner && (
            <div className="px-6 pt-6">
              <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {currentTenant.profile.name}
                    </span>
                    <Badge variant="secondary">{currentPlan?.name ?? "Plan"}</Badge>
                    <Badge variant={status === "active" ? "default" : "destructive"}>
                      {statusLabel}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentTenant.profile.address}, {currentTenant.profile.city}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 text-xs text-muted-foreground lg:items-end">
                  <span>Next billing: {currentTenant.nextBillingDate}</span>
                  {status !== "active" && user?.role === "HospitalAdmin" && (
                    <Button size="sm" asChild>
                      <Link to="/subscribe">Complete subscription</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className={cn("min-h-screen", isReadOnlyForUser && "pointer-events-none opacity-75")}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
