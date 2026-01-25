import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

type PlanId = "starter" | "professional" | "enterprise";
type BillingCycle = "monthly" | "yearly";
type SubscriptionStatus = "active" | "grace" | "suspended" | "expired";

interface TenantProfile {
  name: string;
  shortName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website: string;
  logoText: string;
  brandColor: string;
}

interface TenantUsage {
  staff: number;
  patients: number;
  storageGb: number;
}

interface TenantLimits {
  staff: number;
  patients: number;
  storageGb: number;
}

interface Tenant {
  id: string;
  slug: string;
  profile: TenantProfile;
  planId: PlanId;
  billingCycle: BillingCycle;
  subscriptionStatus: SubscriptionStatus;
  nextBillingDate: string;
  createdAt: string;
  usage: TenantUsage;
  limits: TenantLimits;
}

interface Plan {
  id: PlanId;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  staffLimit: number;
  patientLimit: number;
  storageGb: number;
  features: string[];
}

interface TenantContextType {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  plans: Plan[];
  currentPlan: Plan | null;
  isFeatureEnabled: (feature: string) => boolean;
  isReadOnly: boolean;
  switchTenant: (tenantId: string) => void;
  createTenant: (profile: TenantProfile, planId: PlanId, billingCycle: BillingCycle) => Tenant;
  updateTenantProfile: (tenantId: string, profile: Partial<TenantProfile>) => void;
  updateSubscription: (tenantId: string, planId: PlanId, billingCycle: BillingCycle) => void;
  updateSubscriptionStatus: (tenantId: string, status: SubscriptionStatus) => void;
  updateNextBillingDate: (tenantId: string, billingCycle: BillingCycle, trialDays?: number) => void;
  updateUsage: (tenantId: string, usage: Partial<TenantUsage>) => void;
}

const STORAGE_KEY = "hms_tenants";
const ACTIVE_TENANT_KEY = "hms_active_tenant";

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Start 7 days Free Trial",
    priceMonthly: 0,
    priceYearly: 0,
    staffLimit: 25,
    patientLimit: 2500,
    storageGb: 50,
    features: ["core", "wallet", "reports", "analytics", "integrations"],
  },
  {
    id: "professional",
    name: "Professional",
    priceMonthly: 99999,
    priceYearly: 999999,
    staffLimit: 150,
    patientLimit: 20000,
    storageGb: 250,
    features: ["core", "wallet", "reports", "analytics", "integrations"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 149999,
    priceYearly: 1499999,
    staffLimit: 1000,
    patientLimit: 200000,
    storageGb: 2000,
    features: ["core", "wallet", "reports", "analytics", "integrations"],
  },
];

const defaultTenants: Tenant[] = [
  {
    id: "TEN-001",
    slug: "shirbaline",
    profile: {
      name: "FirstGrade Hospital Management System",
      shortName: "SHIMS",
      email: "info@shirbalinehospital.com",
      phone: "+234 803 456 7890",
      address: "Hospital Road, Dutse",
      city: "Dutse",
      state: "Jigawa",
      country: "Nigeria",
      website: "www.shirbalinehospital.com",
      logoText: "SH",
      brandColor: "hsl(152, 69%, 31%)",
    },
    planId: "professional",
    billingCycle: "monthly",
    subscriptionStatus: "active",
    nextBillingDate: "2026-02-15",
    createdAt: "2024-09-12",
    usage: {
      staff: 24,
      patients: 1247,
      storageGb: 32,
    },
    limits: {
      staff: 150,
      patients: 20000,
      storageGb: 250,
    },
  },
];

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const getNextBillingDate = (billingCycle: BillingCycle, trialDays?: number) => {
  const next = new Date();
  if (trialDays) {
    next.setDate(next.getDate() + trialDays);
  } else if (billingCycle === "monthly") {
    next.setMonth(next.getMonth() + 1);
  } else {
    next.setFullYear(next.getFullYear() + 1);
  }
  return next.toISOString().slice(0, 10);
};

const getStoredTenants = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultTenants;
  }
  try {
    return JSON.parse(stored) as Tenant[];
  } catch {
    return defaultTenants;
  }
};

const getInitialTenantId = (tenants: Tenant[]) => {
  const stored = localStorage.getItem(ACTIVE_TENANT_KEY);
  if (stored && tenants.some((tenant) => tenant.id === stored)) {
    return stored;
  }
  return tenants[0]?.id ?? null;
};

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>(getStoredTenants());
  const [activeTenantId, setActiveTenantId] = useState<string | null>(() =>
    getInitialTenantId(getStoredTenants())
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    if (activeTenantId) {
      localStorage.setItem(ACTIVE_TENANT_KEY, activeTenantId);
    }
  }, [activeTenantId]);

  const currentTenant = useMemo(
    () => tenants.find((tenant) => tenant.id === activeTenantId) ?? null,
    [tenants, activeTenantId]
  );

  const currentPlan = useMemo(() => {
    if (!currentTenant) return null;
    return PLANS.find((plan) => plan.id === currentTenant.planId) ?? null;
  }, [currentTenant]);

  const isFeatureEnabled = (feature: string) => {
    if (!currentTenant || !currentPlan) return false;
    if (currentTenant.subscriptionStatus !== "active") {
      return false;
    }
    return currentPlan.features.includes(feature);
  };

  const isReadOnly =
    currentTenant?.subscriptionStatus === "expired" ||
    currentTenant?.subscriptionStatus === "suspended";

  const switchTenant = (tenantId: string) => {
    setActiveTenantId(tenantId);
  };

  const createTenant = (profile: TenantProfile, planId: PlanId, billingCycle: BillingCycle) => {
    const plan = PLANS.find((entry) => entry.id === planId) ?? PLANS[0];
    const isTrial = plan.priceMonthly === 0 && plan.priceYearly === 0;
    const tenant: Tenant = {
      id: `TEN-${Date.now()}`,
      slug: toSlug(profile.name),
      profile,
      planId,
      billingCycle,
      subscriptionStatus: isTrial ? "active" : "grace",
      nextBillingDate: getNextBillingDate(billingCycle, isTrial ? 7 : 7),
      createdAt: new Date().toISOString().slice(0, 10),
      usage: {
        staff: 1,
        patients: 0,
        storageGb: 1,
      },
      limits: {
        staff: plan.staffLimit,
        patients: plan.patientLimit,
        storageGb: plan.storageGb,
      },
    };
    setTenants((prev) => [...prev, tenant]);
    setActiveTenantId(tenant.id);
    return tenant;
  };

  const updateTenantProfile = (tenantId: string, profile: Partial<TenantProfile>) => {
    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === tenantId
          ? { ...tenant, profile: { ...tenant.profile, ...profile } }
          : tenant
      )
    );
  };

  const updateSubscription = (tenantId: string, planId: PlanId, billingCycle: BillingCycle) => {
    const plan = PLANS.find((entry) => entry.id === planId) ?? PLANS[0];
    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === tenantId
          ? {
              ...tenant,
              planId,
              billingCycle,
              limits: {
                staff: plan.staffLimit,
                patients: plan.patientLimit,
                storageGb: plan.storageGb,
              },
            }
          : tenant
      )
    );
  };

  const updateSubscriptionStatus = (tenantId: string, status: SubscriptionStatus) => {
    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === tenantId ? { ...tenant, subscriptionStatus: status } : tenant
      )
    );
  };

  const updateNextBillingDate = (
    tenantId: string,
    billingCycle: BillingCycle,
    trialDays?: number
  ) => {
    const nextBillingDate = getNextBillingDate(billingCycle, trialDays);
    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === tenantId ? { ...tenant, nextBillingDate } : tenant
      )
    );
  };

  const updateUsage = (tenantId: string, usage: Partial<TenantUsage>) => {
    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === tenantId
          ? { ...tenant, usage: { ...tenant.usage, ...usage } }
          : tenant
      )
    );
  };

  return (
    <TenantContext.Provider
      value={{
        tenants,
        currentTenant,
        plans: PLANS,
        currentPlan,
        isFeatureEnabled,
        isReadOnly: !!isReadOnly,
        switchTenant,
        createTenant,
        updateTenantProfile,
        updateSubscription,
        updateSubscriptionStatus,
        updateNextBillingDate,
        updateUsage,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
