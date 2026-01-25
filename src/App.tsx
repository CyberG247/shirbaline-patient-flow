import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TenantProvider, useTenant } from "@/contexts/TenantContext";
import Index from "./pages/Index";
import RegisterPatient from "./pages/RegisterPatient";
import SearchPatient from "./pages/SearchPatient";
import PatientDashboard from "./pages/PatientDashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Laboratory from "./pages/Laboratory";
import Pharmacy from "./pages/Pharmacy";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SaasLanding from "./pages/SaasLanding";
import Signup from "./pages/Signup";
import Subscribe from "./pages/Subscribe";
import SaasAdminDashboard from "./pages/SaasAdminDashboard";
import TenantAdminDashboard from "./pages/TenantAdminDashboard";
import Subscription from "./pages/Subscription";
import SaasAnalytics from "./pages/SaasAnalytics";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function RoleRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function FeatureRoute({ children, feature }: { children: React.ReactNode; feature: string }) {
  const { isFeatureEnabled } = useTenant();
  if (!isFeatureEnabled(feature)) {
    return <Navigate to="/subscription" replace />;
  }
  return <>{children}</>;
}

function HomeRoute() {
  const { user } = useAuth();
  if (user?.role === "SaaSOwner") {
    return <Navigate to="/saas-admin" replace />;
  }
  return <Index />;
}

const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route path="/saas" element={<SaasLanding />} />
    <Route path="/pricing" element={<SaasLanding />} />
    <Route path="/signup" element={<Signup />} />

    <Route
      path="/"
      element={
        <ProtectedRoute>
          <HomeRoute />
        </ProtectedRoute>
      }
    />
    <Route path="/register" element={<ProtectedRoute><RegisterPatient /></ProtectedRoute>} />
    <Route path="/search" element={<ProtectedRoute><SearchPatient /></ProtectedRoute>} />
    <Route path="/patient/:patientId" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
    <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
    <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
    <Route path="/laboratory" element={<ProtectedRoute><Laboratory /></ProtectedRoute>} />
    <Route path="/pharmacy" element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />
    <Route
      path="/billing"
      element={
        <ProtectedRoute>
          <FeatureRoute feature="wallet">
            <Billing />
          </FeatureRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/reports"
      element={
        <ProtectedRoute>
          <FeatureRoute feature="reports">
            <Reports />
          </FeatureRoute>
        </ProtectedRoute>
      }
    />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route
      path="/subscribe"
      element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={["HospitalAdmin"]}>
            <Subscribe />
          </RoleRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/subscription"
      element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={["HospitalAdmin"]}>
            <Subscription />
          </RoleRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/saas-admin"
      element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={["SaaSOwner"]}>
            <SaasAdminDashboard />
          </RoleRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/saas-analytics"
      element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={["SaaSOwner"]}>
            <SaasAnalytics />
          </RoleRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/tenant-admin"
      element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={["HospitalAdmin"]}>
            <TenantAdminDashboard />
          </RoleRoute>
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TenantProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </TenantProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
