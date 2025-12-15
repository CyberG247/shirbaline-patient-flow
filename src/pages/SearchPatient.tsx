import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  User,
  Phone,
  Calendar,
  CreditCard,
  ChevronRight,
  Wallet,
} from "lucide-react";

// Mock patient data
const mockPatients = [
  {
    id: "SH-2024-001",
    firstName: "Amina",
    lastName: "Yusuf",
    phone: "08012345678",
    gender: "Female",
    dateOfBirth: "1985-03-15",
    walletBalance: 15000,
    lastVisit: "2024-01-10",
    status: "active",
  },
  {
    id: "SH-2024-002",
    firstName: "Ibrahim",
    lastName: "Mohammed",
    phone: "08087654321",
    gender: "Male",
    dateOfBirth: "1990-07-22",
    walletBalance: 3500,
    lastVisit: "2024-01-12",
    status: "active",
  },
  {
    id: "SH-2024-003",
    firstName: "Fatima",
    lastName: "Abubakar",
    phone: "08055566677",
    gender: "Female",
    dateOfBirth: "1978-11-08",
    walletBalance: 45000,
    lastVisit: "2024-01-08",
    status: "active",
  },
  {
    id: "SH-2024-004",
    firstName: "Musa",
    lastName: "Suleiman",
    phone: "08099988877",
    gender: "Male",
    dateOfBirth: "1995-02-28",
    walletBalance: 800,
    lastVisit: "2024-01-14",
    status: "low-balance",
  },
];

export default function SearchPatient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof mockPatients>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = mockPatients.filter(
      (patient) =>
        patient.id.toLowerCase().includes(query) ||
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        patient.phone.includes(query)
    );
    setSearchResults(results);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <Search className="h-5 w-5 text-primary-foreground" />
            </div>
            Find Patient
          </h1>
          <p className="text-muted-foreground mt-2">
            Search by Patient ID, name, or phone number
          </p>
        </div>

        {/* Search Form */}
        <div className="card-healthcare p-6 mb-8 animate-fade-in">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Patient ID (e.g., SH-2024-001), name, or phone number..."
                className="pl-12 h-12 text-base"
              />
            </div>
            <Button type="submit" variant="hero" size="lg">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="animate-slide-up">
            {searchResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Search Results ({searchResults.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {searchResults.map((patient) => (
                    <Link
                      key={patient.id}
                      to={`/patient/${patient.id}`}
                      className="card-healthcare p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-primary">
                          {patient.firstName[0]}
                          {patient.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Patient Name
                          </p>
                          <p className="font-semibold text-foreground">
                            {patient.firstName} {patient.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <CreditCard className="h-3 w-3" /> Patient ID
                          </p>
                          <p className="font-semibold text-primary">
                            {patient.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" /> Phone
                          </p>
                          <p className="font-medium text-foreground">
                            {patient.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Wallet className="h-3 w-3" /> Wallet Balance
                          </p>
                          <p
                            className={`font-semibold ${
                              patient.walletBalance < 1000
                                ? "text-alert"
                                : "text-success"
                            }`}
                          >
                            ₦{patient.walletBalance.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right hidden lg:block">
                          <p className="text-sm text-muted-foreground">Age</p>
                          <p className="font-medium">
                            {calculateAge(patient.dateOfBirth)} years
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {patient.walletBalance < 1000 && (
                            <span className="badge-alert">Low Balance</span>
                          )}
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="card-healthcare p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No patients found
                </h3>
                <p className="text-muted-foreground mb-6">
                  No patients match your search criteria. Try a different search
                  term or register a new patient.
                </p>
                <Link to="/register">
                  <Button variant="hero">Register New Patient</Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Initial State - Quick Search Suggestions */}
        {!hasSearched && (
          <div className="card-healthcare p-8 text-center animate-fade-in">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Search for a Patient
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Enter the patient's Hospital ID, full name, or registered phone
              number to access their profile and medical records.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="badge-info">Patient ID: SH-2024-XXX</span>
              <span className="badge-info">Phone: 080XXXXXXXX</span>
              <span className="badge-info">Name: First Last</span>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
