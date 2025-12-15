import { useState } from "react";
import { Link } from "react-router-dom";
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
  Users,
  Search,
  Filter,
  ChevronRight,
  UserPlus,
  Wallet,
  Calendar,
} from "lucide-react";

// Mock data
const allPatients = [
  { id: "SH-2024-001", firstName: "Amina", lastName: "Yusuf", phone: "08012345678", gender: "Female", walletBalance: 15000, lastVisit: "2024-01-10", status: "active" },
  { id: "SH-2024-002", firstName: "Ibrahim", lastName: "Mohammed", phone: "08087654321", gender: "Male", walletBalance: 3500, lastVisit: "2024-01-12", status: "active" },
  { id: "SH-2024-003", firstName: "Fatima", lastName: "Abubakar", phone: "08055566677", gender: "Female", walletBalance: 45000, lastVisit: "2024-01-08", status: "active" },
  { id: "SH-2024-004", firstName: "Musa", lastName: "Suleiman", phone: "08099988877", gender: "Male", walletBalance: 800, lastVisit: "2024-01-14", status: "low-balance" },
  { id: "SH-2024-005", firstName: "Aisha", lastName: "Bello", phone: "08033344455", gender: "Female", walletBalance: 25000, lastVisit: "2024-01-11", status: "active" },
  { id: "SH-2024-006", firstName: "Usman", lastName: "Garba", phone: "08066677788", gender: "Male", walletBalance: 12000, lastVisit: "2024-01-13", status: "active" },
  { id: "SH-2024-007", firstName: "Zainab", lastName: "Isa", phone: "08077788899", gender: "Female", walletBalance: 500, lastVisit: "2024-01-09", status: "low-balance" },
  { id: "SH-2024-008", firstName: "Hassan", lastName: "Danladi", phone: "08088899900", gender: "Male", walletBalance: 8000, lastVisit: "2024-01-15", status: "active" },
];

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredPatients = allPatients.filter((patient) => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "low-balance" && patient.walletBalance < 1000) ||
      (filterStatus === "active" && patient.walletBalance >= 1000);

    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              All Patients
            </h1>
            <p className="text-muted-foreground mt-2">
              {filteredPatients.length} patients registered
            </p>
          </div>
          <Link to="/register">
            <Button variant="hero" size="lg">
              <UserPlus className="h-4 w-4 mr-2" />
              Register New Patient
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="card-healthcare p-4 mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID, or phone..."
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="low-balance">Low Balance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Patient List */}
        <div className="card-healthcare animate-slide-up">
          {/* Table Header - Desktop */}
          <div className="hidden lg:grid grid-cols-6 gap-4 p-4 bg-secondary/50 border-b border-border text-sm font-medium text-muted-foreground">
            <div className="col-span-2">Patient</div>
            <div>Phone</div>
            <div>Wallet Balance</div>
            <div>Last Visit</div>
            <div>Status</div>
          </div>

          {/* Patient Rows */}
          <div className="divide-y divide-border">
            {filteredPatients.map((patient) => (
              <Link
                key={patient.id}
                to={`/patient/${patient.id}`}
                className="flex flex-col lg:grid lg:grid-cols-6 gap-4 p-4 hover:bg-accent/50 transition-colors"
              >
                {/* Patient Info */}
                <div className="col-span-2 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-semibold text-primary">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-sm text-primary">{patient.id}</p>
                  </div>
                </div>

                {/* Mobile: Additional info */}
                <div className="lg:hidden grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Phone: </span>
                    <span className="font-medium">{patient.phone}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Balance: </span>
                    <span className={`font-medium ${patient.walletBalance < 1000 ? 'text-alert' : 'text-success'}`}>
                      ₦{patient.walletBalance.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Desktop columns */}
                <div className="hidden lg:flex items-center">
                  <span className="text-foreground">{patient.phone}</span>
                </div>
                <div className="hidden lg:flex items-center">
                  <span className={`font-semibold flex items-center gap-1 ${patient.walletBalance < 1000 ? 'text-alert' : 'text-success'}`}>
                    <Wallet className="h-4 w-4" />
                    ₦{patient.walletBalance.toLocaleString()}
                  </span>
                </div>
                <div className="hidden lg:flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {patient.lastVisit}
                </div>
                <div className="hidden lg:flex items-center justify-between">
                  {patient.walletBalance < 1000 ? (
                    <span className="badge-alert">Low Balance</span>
                  ) : (
                    <span className="badge-success">Active</span>
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Mobile: Status & Arrow */}
                <div className="lg:hidden flex items-center justify-between">
                  {patient.walletBalance < 1000 ? (
                    <span className="badge-alert">Low Balance</span>
                  ) : (
                    <span className="badge-success">Active</span>
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No patients found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
