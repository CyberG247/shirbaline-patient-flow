import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Search,
  Users,
  Calendar,
  FlaskConical,
  Pill,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
  Building2,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const coreNavigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Register Patient", href: "/register", icon: UserPlus },
  { name: "Find Patient", href: "/search", icon: Search },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Laboratory", href: "/laboratory", icon: FlaskConical },
  { name: "Pharmacy", href: "/pharmacy", icon: Pill },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

const adminNavigation = [
  { name: "Hospital Admin", href: "/tenant-admin", icon: Building2 },
  { name: "Subscription", href: "/subscription", icon: CreditCard },
];

const saasNavigation = [
  { name: "SaaS Admin", href: "/saas-admin", icon: Activity },
  { name: "Analytics", href: "/saas-analytics", icon: BarChart3 },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentTenant, currentPlan, tenants, switchTenant } = useTenant();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isSaasOwner = user?.role === "SaaSOwner";
  const isHospitalAdmin = user?.role === "HospitalAdmin";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
              <Building2 className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">
                {currentTenant?.profile.shortName ?? "HMS"}
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                {isSaasOwner ? "SaaS Control Center" : currentTenant?.profile.name ?? "Hospital"}
              </p>
            </div>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sm font-semibold text-sidebar-foreground">
                  {(user?.name ?? "User")
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">
                  {user?.name ?? "Staff Member"}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {user?.department ?? "Department"}
                </p>
              </div>
            </div>
            {currentPlan && !isSaasOwner && (
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="secondary">{currentPlan.name}</Badge>
                <span className="text-xs text-sidebar-foreground/60">
                  {currentTenant?.subscriptionStatus ?? "active"}
                </span>
              </div>
            )}
            {isSaasOwner && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                  Active Tenant
                </p>
                <Select
                  value={currentTenant?.id}
                  onValueChange={(value) => switchTenant(value)}
                >
                  <SelectTrigger className="h-9 bg-sidebar-accent text-sidebar-foreground">
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1">
              {(isSaasOwner ? saasNavigation : coreNavigation).map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn("sidebar-link", isActive && "active")}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {!isSaasOwner && isHospitalAdmin && (
              <div className="mt-8">
                <p className="px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                  Administration
                </p>
                <div className="mt-2 space-y-1">
                  {adminNavigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn("sidebar-link", isActive && "active")}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8">
              <p className="px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                System
              </p>
              <div className="mt-2 space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn("sidebar-link", isActive && "active")}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Status indicator */}
          <div className="px-6 py-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-success" />
              <span className="text-xs text-sidebar-foreground/60">System Online</span>
            </div>
          </div>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-sidebar-border">
            <button 
              onClick={handleLogout}
              className="sidebar-link w-full text-sidebar-foreground/60 hover:text-alert"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
