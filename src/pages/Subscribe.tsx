import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/contexts/TenantContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, CreditCard } from "lucide-react";

type PaymentStage = "idle" | "processing" | "confirmed";

interface ReceiptDetails {
  reference: string;
  amount: number;
  billingCycle: "monthly" | "yearly";
  planName: string;
  paidAt: string;
  nextBillingDate: string;
  tenantName: string;
  tenantEmail: string;
}

const Subscribe = () => {
  const {
    currentTenant,
    currentPlan,
    plans,
    updateSubscription,
    updateSubscriptionStatus,
    updateNextBillingDate,
  } = useTenant();
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    currentTenant?.billingCycle ?? "monthly"
  );
  const [planId, setPlanId] = useState<"starter" | "professional" | "enterprise">(
    currentTenant?.planId ?? "professional"
  );
  const [paymentStage, setPaymentStage] = useState<PaymentStage>("idle");
  const [receipt, setReceipt] = useState<ReceiptDetails | null>(null);

  if (!currentTenant) {
    return null;
  }

  const selectedPlan = plans.find((plan) => plan.id === planId) ?? currentPlan;
  const staffLimit = selectedPlan?.staffLimit ?? 0;
  const patientLimit = selectedPlan?.patientLimit ?? 0;
  const storageGb = selectedPlan?.storageGb ?? 0;
  const planPrice =
    billingCycle === "monthly" ? selectedPlan?.priceMonthly ?? 0 : selectedPlan?.priceYearly ?? 0;
  const isTrialPlan = planPrice === 0;

  const formatDate = (value: Date) =>
    value.toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handlePayment = () => {
    if (isTrialPlan) {
      handleStartTrial();
      return;
    }
    setPaymentStage("processing");
  };

  const handleStartTrial = () => {
    const paidAt = new Date();
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 7);
    updateSubscription(currentTenant.id, planId, billingCycle);
    updateSubscriptionStatus(currentTenant.id, "active");
    updateNextBillingDate(currentTenant.id, billingCycle, 7);
    setReceipt({
      reference: `TRIAL-${Date.now()}`,
      amount: 0,
      billingCycle,
      planName: selectedPlan?.name ?? "Plan",
      paidAt: formatDate(paidAt),
      nextBillingDate: formatDate(nextDate),
      tenantName: currentTenant.profile.name,
      tenantEmail: currentTenant.profile.email,
    });
    setPaymentStage("confirmed");
    toast({
      title: "Free trial started",
      description: "Subscription is active and all modules are unlocked.",
    });
  };

  const handleConfirmPayment = () => {
    const paidAt = new Date();
    updateSubscription(currentTenant.id, planId, billingCycle);
    updateSubscriptionStatus(currentTenant.id, "active");
    updateNextBillingDate(currentTenant.id, billingCycle);
    const nextDate = new Date();
    if (billingCycle === "monthly") {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
    setReceipt({
      reference: `PAY-${Date.now()}`,
      amount: planPrice,
      billingCycle,
      planName: selectedPlan?.name ?? "Plan",
      paidAt: formatDate(paidAt),
      nextBillingDate: formatDate(nextDate),
      tenantName: currentTenant.profile.name,
      tenantEmail: currentTenant.profile.email,
    });
    setPaymentStage("confirmed");
    toast({
      title: "Payment confirmed",
      description: "Subscription is now active and all modules are unlocked.",
    });
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscription Checkout</h1>
          <p className="text-muted-foreground">
            Complete payment to activate {currentTenant.profile.name}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle>Plan selection</CardTitle>
              <CardDescription>Choose a subscription plan and billing cycle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Plan</p>
                <Select value={planId} onValueChange={(value) => setPlanId(value as "starter" | "professional" | "enterprise")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Billing cycle</p>
                <Select value={billingCycle} onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handlePayment}>
                {isTrialPlan ? "Start free trial" : "Complete payment"}
              </Button>
            </CardContent>
          </Card>

          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
              <CardDescription>Review your subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedPlan?.name ?? "Plan"}</p>
                  <p className="text-xs text-muted-foreground">Tenant: {currentTenant.profile.shortName}</p>
                </div>
                <Badge variant="secondary">{billingCycle}</Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Staff limit: {staffLimit}</div>
                <div>Patient limit: {patientLimit.toLocaleString()}</div>
                <div>Storage: {storageGb} GB</div>
              </div>
              <div className="rounded-lg border border-border p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Total due</span>
                  <span className="font-semibold">
                    ₦
                    {planPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {paymentStage === "processing" && !isTrialPlan && (
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Simulated Paystack Checkout
              </CardTitle>
              <CardDescription>
                Review the payment details and confirm to activate the subscription.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Tenant</p>
                  <p className="text-sm font-medium text-foreground">{currentTenant.profile.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Plan</p>
                  <p className="text-sm font-medium text-foreground">{selectedPlan?.name ?? "Plan"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Amount</p>
                  <p className="text-sm font-medium text-foreground">₦{planPrice.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleConfirmPayment}>Confirm payment</Button>
                <Button variant="outline" onClick={() => setPaymentStage("idle")}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentStage === "confirmed" && receipt && (
          <Card className="card-healthcare">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Payment receipt
              </CardTitle>
              <CardDescription>Subscription is active and features are unlocked.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Reference</p>
                  <p className="text-sm font-medium text-foreground">{receipt.reference}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Amount</p>
                  <p className="text-sm font-medium text-foreground">₦{receipt.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Plan</p>
                  <p className="text-sm font-medium text-foreground">{receipt.planName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Billing cycle</p>
                  <p className="text-sm font-medium text-foreground">{receipt.billingCycle}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Paid at</p>
                  <p className="text-sm font-medium text-foreground">{receipt.paidAt}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Next payment</p>
                  <p className="text-sm font-medium text-foreground">{receipt.nextBillingDate}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Tenant</p>
                  <p className="text-sm font-medium text-foreground">{receipt.tenantName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{receipt.tenantEmail}</p>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link to="/">Go to dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Subscribe;
