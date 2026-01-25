import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentPatients } from "@/components/dashboard/RecentPatients";
import { TodayAppointments } from "@/components/dashboard/TodayAppointments";
import {
  Users,
  UserPlus,
  Calendar,
  Wallet,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { currentTenant, currentPlan } = useTenant();
  // Get current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Welcome to {currentTenant?.profile.name ?? "Hospital"} Reception Dashboard
          </h1>
          <p className="text-muted-foreground">
            {currentTenant?.profile.name ?? "Hospital"} Internal Management System
          </p>
          {currentPlan && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary">{currentPlan.name}</Badge>
              <span className="text-xs text-muted-foreground">
                Subscription: {currentTenant?.subscriptionStatus ?? "active"}
              </span>
            </div>
          )}
        </div>

        {/* Alert Banner */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-alert-light border border-alert/20 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-alert shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              2 patients require urgent attention
            </p>
            <p className="text-xs text-muted-foreground">
              Emergency cases flagged by medical staff
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Patients Today"
            value={47}
            subtitle="12 new registrations"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatCard
            title="Appointments Today"
            value={32}
            subtitle="8 pending confirmation"
            icon={Calendar}
            variant="default"
          />
          <StatCard
            title="New Registrations"
            value={12}
            subtitle="This week: 67"
            icon={UserPlus}
            trend={{ value: 8, isPositive: true }}
            variant="success"
          />
          <StatCard
            title="Revenue Today"
            value="₦425,000"
            subtitle="Collected from services"
            icon={Wallet}
            variant="default"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <QuickActions />
          <TodayAppointments />
        </div>

        {/* Recent Patients */}
        <RecentPatients />
      </div>
    </MainLayout>
  );
};

export default Index;
