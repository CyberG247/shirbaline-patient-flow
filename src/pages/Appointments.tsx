import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data with multiple dates
const initialAppointments = [
  // Today's appointments (dynamic)
  { id: 1, patientName: "Amina Yusuf", patientId: "SH-2024-001", time: "09:00 AM", doctor: "Dr. Ahmad", department: "General Medicine", status: "confirmed", date: new Date().toISOString().split('T')[0] },
  { id: 2, patientName: "Ibrahim Mohammed", patientId: "SH-2024-002", time: "09:30 AM", doctor: "Dr. Ahmad", department: "General Medicine", status: "confirmed", date: new Date().toISOString().split('T')[0] },
  { id: 3, patientName: "Fatima Abubakar", patientId: "SH-2024-003", time: "10:00 AM", doctor: "Dr. Hauwa", department: "Pediatrics", status: "pending", date: new Date().toISOString().split('T')[0] },
  { id: 4, patientName: "Musa Suleiman", patientId: "SH-2024-004", time: "10:30 AM", doctor: "Dr. Yusuf", department: "Orthopedics", status: "confirmed", date: new Date().toISOString().split('T')[0] },
  { id: 5, patientName: "Aisha Bello", patientId: "SH-2024-005", time: "11:00 AM", doctor: "Dr. Ahmad", department: "General Medicine", status: "in-progress", date: new Date().toISOString().split('T')[0] },
  { id: 6, patientName: "Usman Garba", patientId: "SH-2024-006", time: "11:30 AM", doctor: "Dr. Hauwa", department: "Pediatrics", status: "pending", date: new Date().toISOString().split('T')[0] },
  { id: 7, patientName: "Zainab Isa", patientId: "SH-2024-007", time: "02:00 PM", doctor: "Dr. Yusuf", department: "Orthopedics", status: "confirmed", date: new Date().toISOString().split('T')[0] },
  { id: 8, patientName: "Hassan Danladi", patientId: "SH-2024-008", time: "02:30 PM", doctor: "Dr. Ahmad", department: "General Medicine", status: "confirmed", date: new Date().toISOString().split('T')[0] },
  
  // Tomorrow's appointments
  { id: 9, patientName: "Abdullahi Yusuf", patientId: "SH-2024-009", time: "09:00 AM", doctor: "Dr. Hauwa", department: "Pediatrics", status: "confirmed", date: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
  { id: 10, patientName: "Halima Bello", patientId: "SH-2024-010", time: "10:00 AM", doctor: "Dr. Ahmad", department: "General Medicine", status: "pending", date: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
  { id: 11, patientName: "Sani Mohammed", patientId: "SH-2024-011", time: "11:00 AM", doctor: "Dr. Yusuf", department: "Orthopedics", status: "confirmed", date: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
  { id: 12, patientName: "Maryam Abubakar", patientId: "SH-2024-012", time: "02:00 PM", doctor: "Dr. Hauwa", department: "Pediatrics", status: "pending", date: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
  
  // Yesterday's appointments  
  { id: 13, patientName: "Yusuf Ibrahim", patientId: "SH-2024-013", time: "09:30 AM", doctor: "Dr. Ahmad", department: "General Medicine", status: "completed", date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { id: 14, patientName: "Khadija Suleiman", patientId: "SH-2024-014", time: "10:30 AM", doctor: "Dr. Yusuf", department: "Orthopedics", status: "completed", date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { id: 15, patientName: "Aliyu Garba", patientId: "SH-2024-015", time: "11:30 AM", doctor: "Dr. Hauwa", department: "Pediatrics", status: "completed", date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  
  // Day after tomorrow
  { id: 16, patientName: "Safiya Danladi", patientId: "SH-2024-016", time: "09:00 AM", doctor: "Dr. Ahmad", department: "General Medicine", status: "confirmed", date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0] },
  { id: 17, patientName: "Binta Isa", patientId: "SH-2024-017", time: "10:30 AM", doctor: "Dr. Hauwa", department: "Pediatrics", status: "pending", date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0] },
];

const doctors = ["Dr. Ahmad", "Dr. Hauwa", "Dr. Yusuf"];
const departments = ["General Medicine", "Pediatrics", "Orthopedics", "Gynecology"];
const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM"
];

export default function Appointments() {
  const { toast } = useToast();
  const [allAppointments, setAllAppointments] = useState(initialAppointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Dialog states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    patientName: "",
    patientId: "",
    doctor: "",
    department: "",
    time: "",
    date: new Date().toISOString().split('T')[0],
  });

  const resetBookingForm = () => {
    setBookingForm({
      patientName: "",
      patientId: "",
      doctor: "",
      department: "",
      time: "",
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleBookAppointment = async () => {
    if (!bookingForm.patientName || !bookingForm.patientId || !bookingForm.doctor || !bookingForm.time || !bookingForm.date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newAppointment = {
      id: allAppointments.length + 1,
      patientName: bookingForm.patientName,
      patientId: bookingForm.patientId,
      time: bookingForm.time,
      doctor: bookingForm.doctor,
      department: bookingForm.department || "General Medicine",
      status: "pending",
      date: bookingForm.date,
    };

    setAllAppointments(prev => [...prev, newAppointment]);
    
    toast({
      title: "Appointment Booked",
      description: `Appointment for ${bookingForm.patientName} scheduled for ${bookingForm.time} on ${new Date(bookingForm.date).toLocaleDateString()}.`,
    });

    resetBookingForm();
    setIsBookingOpen(false);
    setIsBooking(false);
    
    // Navigate to the booked date
    setSelectedDate(new Date(bookingForm.date));
  };

  // Date navigation functions
  const goToPreviousDay = () => {
    setSelectedDate(prev => new Date(prev.getTime() - 86400000));
  };

  const goToNextDay = () => {
    setSelectedDate(prev => new Date(prev.getTime() + 86400000));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Format date for display
  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if selected date is today
  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  // Check if selected date is yesterday
  const isYesterday = () => {
    const yesterday = new Date(Date.now() - 86400000);
    return selectedDate.toDateString() === yesterday.toDateString();
  };

  // Check if selected date is tomorrow
  const isTomorrow = () => {
    const tomorrow = new Date(Date.now() + 86400000);
    return selectedDate.toDateString() === tomorrow.toDateString();
  };

  // Get date label
  const getDateLabel = () => {
    if (isToday()) return "Today";
    if (isYesterday()) return "Yesterday";
    if (isTomorrow()) return "Tomorrow";
    return "";
  };

  // Format selected date for comparison with appointment dates
  const selectedDateString = selectedDate.toISOString().split('T')[0];

  // Filter appointments by selected date and other filters
  const filteredAppointments = allAppointments.filter((apt) => {
    const matchesDate = apt.date === selectedDateString;
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDoctor = filterDoctor === "all" || apt.doctor === filterDoctor;
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;

    return matchesDate && matchesSearch && matchesDoctor && matchesStatus;
  });

  const statusStyles = {
    confirmed: "badge-success",
    pending: "badge-warning",
    "in-progress": "badge-info",
    completed: "badge-success",
    cancelled: "badge-alert",
  };

  // Stats for selected date
  const dayAppointments = allAppointments.filter(a => a.date === selectedDateString);
  const stats = {
    total: dayAppointments.length,
    confirmed: dayAppointments.filter((a) => a.status === "confirmed").length,
    pending: dayAppointments.filter((a) => a.status === "pending").length,
    inProgress: dayAppointments.filter((a) => a.status === "in-progress").length,
    completed: dayAppointments.filter((a) => a.status === "completed").length,
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
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      placeholder="Enter patient name"
                      value={bookingForm.patientName}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, patientName: e.target.value }))}
                      disabled={isBooking}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID *</Label>
                    <Input
                      id="patientId"
                      placeholder="e.g., SH-2024-XXX"
                      value={bookingForm.patientId}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, patientId: e.target.value }))}
                      disabled={isBooking}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor *</Label>
                    <Select
                      value={bookingForm.doctor}
                      onValueChange={(value) => setBookingForm(prev => ({ ...prev, doctor: value }))}
                      disabled={isBooking}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor} value={doctor}>
                            {doctor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={bookingForm.department}
                      onValueChange={(value) => setBookingForm(prev => ({ ...prev, department: value }))}
                      disabled={isBooking}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={isBooking}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time Slot *</Label>
                    <Select
                      value={bookingForm.time}
                      onValueChange={(value) => setBookingForm(prev => ({ ...prev, time: value }))}
                      disabled={isBooking}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  className="w-full gap-2 mt-4" 
                  variant="hero"
                  onClick={handleBookAppointment}
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Booking Appointment...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="card-healthcare p-4 animate-fade-in">
            <p className="text-sm text-muted-foreground">Total {isToday() ? "Today" : ""}</p>
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
            <p className="text-sm text-muted-foreground">{stats.completed > 0 ? "Completed" : "In Progress"}</p>
            <p className="text-2xl font-bold text-info">{stats.completed > 0 ? stats.completed : stats.inProgress}</p>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="card-healthcare p-4 mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-center cursor-pointer" onClick={goToToday}>
              <p className="text-lg font-semibold text-foreground">
                {formatDisplayDate(selectedDate)}
              </p>
              {getDateLabel() && (
                <p className="text-sm text-primary font-medium">{getDateLabel()}</p>
              )}
              {!isToday() && (
                <p className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Click to go to today
                </p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={goToNextDay}>
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
                <SelectItem value="completed">Completed</SelectItem>
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
                {dayAppointments.length === 0 
                  ? `No appointments scheduled for ${formatDisplayDate(selectedDate)}`
                  : "Try adjusting your search or filter criteria"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

