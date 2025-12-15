import { Link } from "react-router-dom";
import { ChevronRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data
const appointments = [
  {
    id: 1,
    patientName: "Aisha Bello",
    patientId: "SH-2024-005",
    time: "09:00 AM",
    doctor: "Dr. Ahmad",
    department: "General Medicine",
    status: "confirmed",
  },
  {
    id: 2,
    patientName: "Usman Garba",
    patientId: "SH-2024-006",
    time: "10:30 AM",
    doctor: "Dr. Hauwa",
    department: "Pediatrics",
    status: "confirmed",
  },
  {
    id: 3,
    patientName: "Zainab Isa",
    patientId: "SH-2024-007",
    time: "11:00 AM",
    doctor: "Dr. Yusuf",
    department: "Orthopedics",
    status: "pending",
  },
  {
    id: 4,
    patientName: "Hassan Danladi",
    patientId: "SH-2024-008",
    time: "02:00 PM",
    doctor: "Dr. Ahmad",
    department: "General Medicine",
    status: "confirmed",
  },
];

export function TodayAppointments() {
  return (
    <div className="card-healthcare animate-slide-up">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Today's Appointments</h2>
        </div>
        <Link to="/appointments">
          <Button variant="ghost" size="sm">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="p-4 space-y-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="text-center min-w-[60px]">
              <p className="text-sm font-semibold text-primary">{apt.time}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{apt.patientName}</p>
              <p className="text-xs text-muted-foreground">
                {apt.doctor} • {apt.department}
              </p>
            </div>
            <span
              className={
                apt.status === "confirmed" ? "badge-success" : "badge-warning"
              }
            >
              {apt.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
