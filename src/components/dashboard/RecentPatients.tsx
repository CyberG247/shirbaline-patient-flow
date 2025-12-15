import { Link } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - will be replaced with real data
const recentPatients = [
  {
    id: "SH-2024-001",
    name: "Amina Yusuf",
    reason: "General Consultation",
    time: "10 mins ago",
    status: "waiting",
  },
  {
    id: "SH-2024-002",
    name: "Ibrahim Mohammed",
    reason: "Follow-up Visit",
    time: "25 mins ago",
    status: "in-progress",
  },
  {
    id: "SH-2024-003",
    name: "Fatima Abubakar",
    reason: "Lab Results Collection",
    time: "45 mins ago",
    status: "completed",
  },
  {
    id: "SH-2024-004",
    name: "Musa Suleiman",
    reason: "Emergency",
    time: "1 hour ago",
    status: "urgent",
  },
];

const statusStyles = {
  waiting: "badge-info",
  "in-progress": "badge-warning",
  completed: "badge-success",
  urgent: "badge-alert",
};

const statusLabels = {
  waiting: "Waiting",
  "in-progress": "In Progress",
  completed: "Completed",
  urgent: "Urgent",
};

export function RecentPatients() {
  return (
    <div className="card-healthcare animate-slide-up">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Recent Patients</h2>
        <Link to="/patients">
          <Button variant="ghost" size="sm">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-border">
        {recentPatients.map((patient) => (
          <Link
            key={patient.id}
            to={`/patient/${patient.id}`}
            className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {patient.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{patient.name}</p>
              <p className="text-sm text-muted-foreground truncate">{patient.reason}</p>
            </div>
            <div className="text-right shrink-0">
              <span className={statusStyles[patient.status as keyof typeof statusStyles]}>
                {statusLabels[patient.status as keyof typeof statusLabels]}
              </span>
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                <Clock className="h-3 w-3" />
                {patient.time}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
