type BillingStatus = "paid" | "pending" | "failed";
type BillingCycle = "monthly" | "yearly";

export interface BillingInvoice {
  id: string;
  tenantId: string;
  planId: "starter" | "professional" | "enterprise";
  billingCycle: BillingCycle;
  amount: number;
  currency: "NGN";
  status: BillingStatus;
  invoiceDate: string;
  periodStart: string;
  periodEnd: string;
  paidAt?: string;
}

const invoices: BillingInvoice[] = [
  {
    id: "INV-2026-001",
    tenantId: "TEN-001",
    planId: "professional",
    billingCycle: "monthly",
    amount: 99999,
    currency: "NGN",
    status: "paid",
    invoiceDate: "2026-01-15",
    periodStart: "2026-01-15",
    periodEnd: "2026-02-14",
    paidAt: "2026-01-15",
  },
  {
    id: "INV-2025-012",
    tenantId: "TEN-001",
    planId: "professional",
    billingCycle: "monthly",
    amount: 99999,
    currency: "NGN",
    status: "paid",
    invoiceDate: "2025-12-15",
    periodStart: "2025-12-15",
    periodEnd: "2026-01-14",
    paidAt: "2025-12-15",
  },
  {
    id: "INV-2025-011",
    tenantId: "TEN-001",
    planId: "professional",
    billingCycle: "monthly",
    amount: 99999,
    currency: "NGN",
    status: "paid",
    invoiceDate: "2025-11-15",
    periodStart: "2025-11-15",
    periodEnd: "2025-12-14",
    paidAt: "2025-11-15",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchTenantInvoices(tenantId: string) {
  await delay(400);
  return invoices.filter((invoice) => invoice.tenantId === tenantId);
}

export async function fetchBillingSummary() {
  await delay(300);
  const paid = invoices.filter((invoice) => invoice.status === "paid");
  const totalPaid = paid.reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingCount = invoices.filter((invoice) => invoice.status === "pending").length;
  return {
    totalPaid,
    paidCount: paid.length,
    pendingCount,
  };
}
