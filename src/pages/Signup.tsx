import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTenant } from "@/contexts/TenantContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { plans, createTenant } = useTenant();
  const { login } = useAuth();
  const { toast } = useToast();

  const [hospitalName, setHospitalName] = useState("");
  const [shortName, setShortName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [website, setWebsite] = useState("");
  const [planId, setPlanId] = useState<"starter" | "professional" | "enterprise">("professional");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedPlan = plans.find((plan) => plan.id === planId);
  const isTrialPlan =
    selectedPlan?.priceMonthly === 0 && selectedPlan?.priceYearly === 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const tenant = createTenant(
      {
        name: hospitalName,
        shortName: shortName || hospitalName.slice(0, 3).toUpperCase(),
        email: adminEmail,
        phone,
        address,
        city,
        state,
        country,
        website,
        logoText: (shortName || hospitalName.slice(0, 2)).toUpperCase(),
        brandColor: "hsl(152, 69%, 31%)",
      },
      planId,
      billingCycle
    );

    const success = await login(adminEmail, password, {
      tenantId: tenant.id,
      role: "HospitalAdmin",
      name: adminName || "Hospital Admin",
      department: "Administration",
    });

    if (success) {
      if (isTrialPlan) {
        toast({
          title: "Trial activated",
          description: "Your hospital tenant is active. Enjoy your 7-day free trial.",
        });
        navigate("/");
      } else {
        toast({
          title: "Workspace created",
          description: "Your hospital tenant is ready. Complete subscription to activate access.",
        });
        navigate("/subscribe");
      }
    } else {
      toast({
        title: "Signup failed",
        description: "Please check your details and try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">Hospital Onboarding</p>
              <p className="text-sm text-muted-foreground">Create a new tenant workspace</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link to="/login">Back to login</Link>
          </Button>
        </div>

        <Card className="card-healthcare">
          <CardHeader>
            <CardTitle>Hospital profile</CardTitle>
            <CardDescription>Provision your tenant and admin account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Hospital Name</Label>
                  <Input value={hospitalName} onChange={(event) => setHospitalName(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Short Name</Label>
                  <Input value={shortName} onChange={(event) => setShortName(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Admin Name</Label>
                  <Input value={adminName} onChange={(event) => setAdminName(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Admin Email</Label>
                  <Input type="email" value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Input value={address} onChange={(event) => setAddress(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={city} onChange={(event) => setCity(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={state} onChange={(event) => setState(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={country} onChange={(event) => setCountry(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={website} onChange={(event) => setWebsite(event.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Subscription Plan</Label>
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
                  <Label>Billing Cycle</Label>
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
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Provisioning workspace..." : "Create tenant and continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
