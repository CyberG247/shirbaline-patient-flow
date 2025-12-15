import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock data
const appointments = [
  { id: 1, patientName: "Amina Yusuf", patientId: "SH-2024-001", time: "09:00 AM", doctor: "Dr. Ahmad", department: "General Medicine", status: "confirmed", date: "2024-01-18" },
  { id: 2, patientName: "Ibrahim Mohammed", patientId: "SH-2024-002", time: "09:30 AM", doctor: "Dr. Ahmad", department: "General Medicine", status: "confirmed", date: "2024-01-18" },
  { id: 3, patientName: "Fatima Abubakar", patientId: "SH-2024-003", time: "10:00 AM", doctor: "Dr. Hauwa", department: "Pediatrics", status: "pending", date: "2024-01-18" },
  { id: 4, patientName: "Musa Suleiman", patientId: "SH-2024-004", time: "10:30 AM", doctor: "Dr. Yusuf", department: "Orthopedics", status: "confirmed", date: "2024-01-18" },
  { id: 5, patientName: "Aisha Bello", patientId: "SH-2024-005", time: "11:00 AM", doctor: "Dr. Ahmad", department: "General Medicine", status: "in-progress", date: "2024-01-18" },
  { id: 6, patientName: "Usman Garba", patientId: "SH-2024-006", time: "11:30 AM", doctor: "Dr. Hauwa", department: "Pediatrics", status: "pending", date: "2024-01-18" },
  { id: 7, patientName: "Zainab Isa", patientId: "SH-2024-007", time: "02:00 PM", doctor: "Dr. Yusuf", department: "Orthopedics", status: "confirmed", date: "2024-01-18" },
  { id: 8, patientName: "Hassan Danladi", patientId: "SH-2024-008", time: "02:30 PM", doctor: "Dr. Ahmad", department: "General Medicine", status: "confirmed", date: "2024-01-18" },
];

const doctors = ["Dr. Ahmad", "Dr. Hauwa", "Dr. Yusuf"];
const departments = ["General Medicine", "Pediatrics", "Orthopedics", "Gynecology"];

export default function Appointments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("2024-01-18");

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDoctor = filterDoctor === "all" || apt.doctor === filterDoctor;
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;

    return matchesSearch && matchesDoctor && matchesStatus;
  });

  const statusStyles = {
    confirmed: "badge-success",
    pending: "badge-warning",
    "in-progress": "badge-info",
    completed: "badge-success",
    cancelled: "badge-alert",
  };

  // Stats for today
  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    inProgress: appointments.filter((a) => a.status === "in-progress").length,
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              Appointments
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage patient appointments and schedules
            </p>
          </div>
          <Button variant="hero" size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="card-healthcare p-4 animate-fade-in">
            <p className="text-sm text-muted-foreground">Total Today</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="card-healthcare p-4 animate-fade-in bg-success-light border-success/20">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <p className="text-2xl font-bold text-success">{stats.confirmed}</p>
          </div>
          <div className="card-healthcare p-4 animate-fade-in bg-warning-light border-warning/20">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-warning">{stats.pending}</p>
          </div>
          <div className="card-healthcare p-4 animate-fade-in bg-info-light border-info/20">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-info">{stats.inProgress}</p>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="card-healthcare p-4 mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                Thursday, January 18, 2024
              </p>
              <p className="text-sm text-muted-foreground">Today</p>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="card-healthcare p-4 mb-6 animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name or ID..."
                className="pl-10"
              />
            </div>
            <Select value={filterDoctor} onValueChange={setFilterDoctor}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="All Doctors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Appointment List */}
        <div className="card-healthcare animate-slide-up">
          <div className="divide-y divide-border">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
              >
                {/* Time */}
                <div className="flex items-center gap-3 sm:min-w-[100px]">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="sm:hidden">
                    <p className="font-semibold text-primary">{apt.time}</p>
                    <span className={statusStyles[apt.status as keyof typeof statusStyles]}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="hidden sm:block font-semibold text-primary text-center w-20">
                    {apt.time}
                  </p>
                </div>

                {/* Patient Info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {apt.patientName}
                    </p>
                    <p className="text-sm text-muted-foreground">{apt.patientId}</p>
                  </div>
                </div>

                {/* Doctor & Department */}
                <div className="sm:min-w-[200px]">
                  <p className="font-medium text-foreground">{apt.doctor}</p>
                  <p className="text-sm text-muted-foreground">{apt.department}</p>
                </div>

                {/* Status & Actions */}
                <div className="hidden sm:flex items-center gap-4">
                  <span className={statusStyles[apt.status as keyof typeof statusStyles]}>
                    {apt.status}
                  </span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>

                {/* Mobile Actions */}
                <div className="sm:hidden flex justify-end">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <div className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                No appointments found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
