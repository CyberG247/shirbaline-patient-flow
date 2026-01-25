import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTenant } from "@/contexts/TenantContext";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Cloud,
  CreditCard,
  FileText,
  FlaskConical,
  Globe2,
  HeartPulse,
  Lock,
  PhoneCall,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const SaasLanding = () => {
  const { plans } = useTenant();
  const { toast } = useToast();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    staffSize: "",
    preferredDate: "",
    message: "",
  });

  const handleDemoChange =
    (field: keyof typeof demoForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDemoForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleDemoSubmit = (event: FormEvent) => {
    event.preventDefault();
    toast({
      title: "Demo request received",
      description: "We will reach out shortly to schedule your session.",
    });
    setDemoForm({
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      role: "",
      staffSize: "",
      preferredDate: "",
      message: "",
    });
    setIsDemoOpen(false);
  };

  const highlightStats = [
    { label: "Hospitals onboarded", value: "27+" },
    { label: "Monthly revenue processed", value: "₦2.7M" },
    { label: "Avg. patient wait time drop", value: "38%" },
    { label: "Uptime SLA", value: "99.99%" },
  ];

  const featureCards = [
    {
      title: "Tenant-grade isolation",
      description: "Data segregation, role-based access, and audit trails per hospital.",
      icon: ShieldCheck,
    },
    {
      title: "Subscription automation",
      description: "Self-serve onboarding, payments, renewals, and feature gating.",
      icon: CreditCard,
    },
    {
      title: "Clinical workflow suite",
      description: "Appointments, EMR, pharmacy, laboratory, and billing connected.",
      icon: Stethoscope,
    },
    {
      title: "Enterprise analytics",
      description: "Revenue, usage, and operational insights in real time.",
      icon: BarChart3,
    },
    {
      title: "Compliance & security",
      description: "Encryption, RBAC, MFA-ready, and audit trails per tenant.",
      icon: Lock,
    },
    {
      title: "Custom branding",
      description: "Hospital logos, domains, and color palettes for each tenant.",
      icon: Sparkles,
    },
  ];

  const modules = [
    { name: "Patient Registration", icon: Users },
    { name: "Appointments & Scheduling", icon: Calendar },
    { name: "Clinical Documentation", icon: FileText },
    { name: "Laboratory Workflows", icon: FlaskConical },
    { name: "Pharmacy & Inventory", icon: Pill },
    { name: "Billing & Wallets", icon: CreditCard },
  ];

  const capabilities = [
    { title: "Unified patient record", description: "Single longitudinal record across visits." },
    { title: "Revenue cycle controls", description: "Automated billing rules and claim tracking." },
    { title: "Smart triage", description: "Queue management and priority routing." },
    { title: "Multi-site visibility", description: "Group-level reporting across branches." },
  ];

  const compliance = [
    { title: "Data encryption", description: "At-rest and in-transit encryption defaults." },
    { title: "Audit logging", description: "Immutable activity trails per hospital." },
    { title: "Backups & DR", description: "Daily backups and regional redundancy." },
    { title: "Access governance", description: "Role-based controls with approvals." },
  ];

  const integrations = [
    { name: "WhatsApp & SMS", icon: PhoneCall },
    { name: "Telemedicine", icon: HeartPulse },
    { name: "HL7 / FHIR Ready", icon: Globe2 },
    { name: "Cloud storage", icon: Cloud },
  ];

  const testimonials = [
    {
      name: "Dr. Adaeze N.",
      role: "Medical Director, Sunrise Clinics",
      quote:
        "We onboarded two hospitals in a week. The billing automation alone saved 14 hours weekly.",
    },
    {
      name: "Mr. Teslim K.",
      role: "COO, Cedar Medical",
      quote:
        "We finally have multi-branch visibility with real-time dashboards and compliance built in.",
    },
    {
      name: "Aisha Y.",
      role: "Head of Operations, NovaCare",
      quote:
        "The subscription model makes budgeting predictable and the patient flow tools are exceptional.",
    },
  ];

  const faqs = [
    {
      question: "Can we run multiple hospitals under one subscription?",
      answer: "Yes. Enterprise tenants can enable multi-site workflows and centralized analytics.",
    },
    {
      question: "How is data isolation enforced?",
      answer: "Every request is tenant-scoped with RBAC, encryption, and audit logging policies.",
    },
    {
      question: "Do you support migration from legacy HMS?",
      answer: "We provide assisted onboarding and data migration playbooks for enterprise clients.",
    },
  ];

  return (
    <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
      <div className="min-h-screen bg-background">
        <div className="relative overflow-hidden">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-12">
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
              <p className="text-lg font-semibold text-foreground">FirstGrade HMS</p>
                <p className="text-sm text-muted-foreground">Multi-tenant Hospital Management Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="#pricing">Pricing</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </motion.header>

          <motion.section
            className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <motion.div className="space-y-6" variants={fadeUp}>
              <Badge variant="secondary">B2B Healthcare SaaS</Badge>
              <h1 className="text-4xl font-bold text-foreground lg:text-5xl">
                Trusted By Fast-growing Hospitals to Run modern Healthcare Operations!
              </h1>
              <p className="text-lg text-muted-foreground">
                Unify patient intake, clinical workflows, labs, pharmacy, billing, and analytics in a single
                secure SaaS platform built for multi-tenant scale.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline">
                    Request a Demo
                  </Button>
                </DialogTrigger>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  SOC2-ready architecture
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  30-day assisted onboarding
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  24/7 enterprise support
                </div>
              </div>
            </motion.div>

            <motion.div
              className="grid gap-4"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
                {featureCards.slice(0, 4).map((feature) => (
                  <Card key={feature.title} className="card-healthcare">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <feature.icon className="h-4 w-4 text-primary" />
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">{feature.description}</CardContent>
                  </Card>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
                {featureCards.slice(4).map((feature) => (
                  <Card key={feature.title} className="card-healthcare">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <feature.icon className="h-4 w-4 text-primary" />
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">{feature.description}</CardContent>
                  </Card>
                ))}
              </motion.div>
            </motion.div>
          </motion.section>

          <motion.section
            className="grid gap-6 rounded-3xl border border-border bg-muted/40 px-6 py-8 md:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {highlightStats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="space-y-2">
                <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.section>

          <motion.section
            className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <Badge variant="secondary">Operational excellence</Badge>
              <h2 className="text-3xl font-semibold text-foreground">
                Built for operational leaders and clinical teams
              </h2>
              <p className="text-muted-foreground">
                Reduce patient wait time, automate revenue workflows, and keep every department aligned with
                tenant-level analytics and audit trails.
              </p>
              <div className="grid gap-3">
                {capabilities.map((capability) => (
                  <div key={capability.title} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{capability.title}</p>
                      <p className="text-xs text-muted-foreground">{capability.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-2">
              {modules.map((module) => (
                <Card key={module.name} className="card-healthcare">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <module.icon className="h-4 w-4 text-primary" />
                      {module.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Integrated workflows, notifications, and dashboards for every team.
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </motion.section>

          <motion.section
            className="grid gap-6 lg:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {compliance.map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <Card className="card-healthcare h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lock className="h-4 w-4 text-primary" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{item.description}</CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.section>

          <motion.section
            className="grid gap-6 rounded-3xl border border-border bg-muted/40 px-6 py-8 lg:grid-cols-[1fr_1.2fr]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="space-y-3">
              <h3 className="text-2xl font-semibold text-foreground">Integration-ready ecosystem</h3>
              <p className="text-sm text-muted-foreground">
                Connect to messaging providers, telemedicine tools, and hospital ERPs with API-first workflows.
              </p>
              <Button variant="outline" asChild>
                <Link to="/signup">Talk to sales</Link>
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3"
                >
                  <integration.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground">{integration.name}</span>
                </div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section
            className="grid gap-6 lg:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.name} variants={fadeUp}>
                <Card className="card-healthcare h-full">
                  <CardHeader>
                    <CardTitle className="text-base">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">“{testimonial.quote}”</CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.section>

          <motion.section
            className="space-y-6"
            id="pricing"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="space-y-2">
              <h2 className="text-3xl font-semibold text-foreground">Subscription plans</h2>
              <p className="text-muted-foreground">Choose a plan that scales from clinics to multi-site hospitals.</p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <motion.div key={plan.id} variants={fadeUp}>
                  <Card className="card-healthcare h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {plan.name}
                        {plan.id === "professional" && <Badge>Popular</Badge>}
                      </CardTitle>
                      <CardDescription>
                        ₦{plan.priceMonthly.toLocaleString()}/mo or ₦{plan.priceYearly.toLocaleString()}/yr
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <div>Staff limit: {plan.staffLimit}</div>
                      <div>Patient limit: {plan.patientLimit.toLocaleString()}</div>
                      <div>Storage: {plan.storageGb} GB</div>
                      <div>Features: {plan.features.join(", ")}</div>
                      <Button className="w-full" asChild>
                        <Link to="/signup">Choose {plan.name}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <h2 className="text-3xl font-semibold text-foreground">Everything you need to launch faster</h2>
              <p className="text-muted-foreground">
                Dedicated onboarding, data migration playbooks, and 24/7 enterprise support help you go live fast.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Real-time monitoring</p>
                    <p className="text-xs text-muted-foreground">Health checks and uptime alerts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Automated workflows</p>
                    <p className="text-xs text-muted-foreground">Zero-touch renewals and billing.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Frequently asked questions</h3>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-xl border border-border bg-background px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{faq.question}</p>
                    <p className="text-xs text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.section>

          <motion.section
            className="rounded-3xl border border-border bg-primary/10 px-6 py-10 text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mx-auto flex max-w-3xl flex-col gap-4">
              <Badge className="mx-auto">Launch-ready SaaS</Badge>
              <h2 className="text-3xl font-semibold text-foreground">
                Transform your hospital operations with a commercial-grade SaaS platform
              </h2>
              <p className="text-muted-foreground">
                Go live in weeks with tenant-ready onboarding, compliance, and scalable infrastructure.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline">
                    Book a demo
                  </Button>
                </DialogTrigger>
              </div>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </div>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request a demo</DialogTitle>
          <DialogDescription>
            Tell us about your hospital so we can tailor the walkthrough.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleDemoSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="demo-name">Full name</Label>
              <Input
                id="demo-name"
                value={demoForm.fullName}
                onChange={handleDemoChange("fullName")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-email">Work email</Label>
              <Input
                id="demo-email"
                type="email"
                value={demoForm.email}
                onChange={handleDemoChange("email")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-phone">Phone</Label>
              <Input id="demo-phone" value={demoForm.phone} onChange={handleDemoChange("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-organization">Hospital / Organization</Label>
              <Input
                id="demo-organization"
                value={demoForm.organization}
                onChange={handleDemoChange("organization")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-role">Role / Title</Label>
              <Input id="demo-role" value={demoForm.role} onChange={handleDemoChange("role")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-size">Staff size</Label>
              <Input
                id="demo-size"
                value={demoForm.staffSize}
                onChange={handleDemoChange("staffSize")}
                placeholder="e.g. 50-200"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="demo-date">Preferred demo date</Label>
              <Input
                id="demo-date"
                type="date"
                value={demoForm.preferredDate}
                onChange={handleDemoChange("preferredDate")}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="demo-message">Notes</Label>
              <Textarea
                id="demo-message"
                rows={4}
                value={demoForm.message}
                onChange={handleDemoChange("message")}
                placeholder="Key workflows, integrations, or questions you want covered."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaasLanding;
