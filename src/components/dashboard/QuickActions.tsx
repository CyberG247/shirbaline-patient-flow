import { Link } from "react-router-dom";
import { UserPlus, Search, Calendar, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    title: "Register New Patient",
    description: "Create a new patient profile and wallet",
    icon: UserPlus,
    href: "/register",
    variant: "hero" as const,
  },
  {
    title: "Find Patient",
    description: "Search by ID, name, or phone number",
    icon: Search,
    href: "/search",
    variant: "outline" as const,
  },
  {
    title: "Book Appointment",
    description: "Schedule patient appointments",
    icon: Calendar,
    href: "/appointments",
    variant: "outline" as const,
  },
  {
    title: "View Reports",
    description: "Access daily and weekly reports",
    icon: FileText,
    href: "/reports",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <div className="card-healthcare p-6 animate-slide-up">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <Link key={action.title} to={action.href}>
            <Button
              variant={action.variant}
              className="w-full h-auto py-4 px-4 flex items-start gap-4 text-left"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.variant === 'hero' ? 'bg-primary-foreground/20' : 'bg-primary/10'}`}>
                <action.icon className={`h-5 w-5 ${action.variant === 'hero' ? 'text-primary-foreground' : 'text-primary'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{action.title}</p>
                <p className={`text-xs mt-0.5 ${action.variant === 'hero' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {action.description}
                </p>
              </div>
              <ArrowRight className={`h-4 w-4 shrink-0 ${action.variant === 'hero' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`} />
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
