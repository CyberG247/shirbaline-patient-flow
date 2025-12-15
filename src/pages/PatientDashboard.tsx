import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Wallet,
  Calendar,
  FileText,
  FlaskConical,
  Pill,
  ArrowLeft,
  Plus,
  Phone,
  MapPin,
  Droplet,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  Printer,
} from "lucide-react";

// Mock patient data
const mockPatient = {
  id: "SH-2024-001",
  firstName: "Amina",
  lastName: "Yusuf",
  dateOfBirth: "1985-03-15",
  gender: "Female",
  phone: "08012345678",
  alternatePhone: "08098765432",
  address: "15 Hospital Road, Dutse",
  lga: "Dutse",
  state: "Jigawa",
  bloodGroup: "O+",
  allergies: "Penicillin",
  emergencyContact: {
    name: "Yusuf Aminu",
    phone: "08055566677",
  },
  walletBalance: 15000,
  registrationDate: "2024-01-02",
  lastVisit: "2024-01-10",
};

const walletTransactions = [
  { id: 1, type: "credit", amount: 20000, description: "Wallet Top-up", date: "2024-01-10", reference: "TXN-001" },
  { id: 2, type: "debit", amount: 3000, description: "Consultation Fee - Dr. Ahmad", date: "2024-01-10", reference: "TXN-002" },
  { id: 3, type: "debit", amount: 2000, description: "Laboratory - Blood Test", date: "2024-01-10", reference: "TXN-003" },
];

const appointments = [
  { id: 1, date: "2024-01-18", time: "09:00 AM", doctor: "Dr. Ahmad", department: "General Medicine", status: "upcoming", isFollowUp: true },
  { id: 2, date: "2024-01-10", time: "10:30 AM", doctor: "Dr. Ahmad", department: "General Medicine", status: "completed", isFollowUp: false },
  { id: 3, date: "2024-01-05", time: "02:00 PM", doctor: "Dr. Hauwa", department: "Gynecology", status: "completed", isFollowUp: false },
];

const medicalRecords = [
  {
    id: 1,
    date: "2024-01-10",
    diagnosis: "Upper Respiratory Tract Infection",
    doctor: "Dr. Ahmad",
    notes: "Patient presented with cough, runny nose, and mild fever for 3 days. Vital signs stable. Prescribed antibiotics and decongestants.",
    vitals: { bp: "120/80", temp: "37.8°C", pulse: "78 bpm" },
  },
  {
    id: 2,
    date: "2024-01-05",
    diagnosis: "Routine Checkup",
    doctor: "Dr. Hauwa",
    notes: "Annual gynecological examination. All findings normal. Advised to continue with regular checkups.",
    vitals: { bp: "118/76", temp: "36.6°C", pulse: "72 bpm" },
  },
];

const labResults = [
  { id: 1, test: "Complete Blood Count (CBC)", date: "2024-01-10", status: "completed", result: "Normal", doctor: "Dr. Ahmad" },
  { id: 2, test: "Blood Sugar (Fasting)", date: "2024-01-10", status: "completed", result: "98 mg/dL", doctor: "Dr. Ahmad" },
  { id: 3, test: "Urinalysis", date: "2024-01-10", status: "pending", result: "-", doctor: "Dr. Ahmad" },
];

const prescriptions = [
  {
    id: 1,
    date: "2024-01-10",
    doctor: "Dr. Ahmad",
    medications: [
      { name: "Amoxicillin 500mg", dosage: "1 tablet 3x daily", duration: "7 days", dispensed: true },
      { name: "Paracetamol 500mg", dosage: "1-2 tablets as needed", duration: "PRN", dispensed: true },
      { name: "Cetirizine 10mg", dosage: "1 tablet at night", duration: "5 days", dispensed: false },
    ],
  },
];

export default function PatientDashboard() {
  const { patientId } = useParams();
  const [activeTab, setActiveTab] = useState("wallet");

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const upcomingAppointment = appointments.find((apt) => apt.status === "upcoming");

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        {/* Back Button */}
        <Link to="/search" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>

        {/* Patient Header Card */}
        <div className="card-healthcare p-6 mb-6 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-primary-foreground">
                  {mockPatient.firstName[0]}{mockPatient.lastName[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {mockPatient.firstName} {mockPatient.lastName}
                </h1>
                <p className="text-lg font-semibold text-primary">{mockPatient.id}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{mockPatient.gender}</span>
                  <span>•</span>
                  <span>{calculateAge(mockPatient.dateOfBirth)} years old</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Droplet className="h-3 w-3 text-alert" />
                    {mockPatient.bloodGroup}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>{mockPatient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{mockPatient.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-alert" />
                <span>Allergic to: {mockPatient.allergies}</span>
              </div>
            </div>

            {/* Wallet Balance Card */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 min-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Wallet Balance</span>
              </div>
              <p className={`text-2xl font-bold ${mockPatient.walletBalance < 5000 ? 'text-alert' : 'text-success'}`}>
                ₦{mockPatient.walletBalance.toLocaleString()}
              </p>
              <Button size="sm" variant="hero" className="mt-3 w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Funds
              </Button>
            </div>
          </div>

          {/* Follow-up Alert */}
          {upcomingAppointment?.isFollowUp && (
            <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-warning-light border border-warning/20">
              <Calendar className="h-5 w-5 text-warning shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Follow-up Appointment Scheduled</p>
                <p className="text-sm text-muted-foreground">
                  {upcomingAppointment.date} at {upcomingAppointment.time} with {upcomingAppointment.doctor}
                </p>
              </div>
              <Button size="sm" variant="outline">View Details</Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-up">
          <TabsList className="w-full flex overflow-x-auto bg-secondary p-1 rounded-xl mb-6">
            <TabsTrigger value="wallet" className="flex-1 min-w-[120px] gap-2">
              <Wallet className="h-4 w-4" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex-1 min-w-[120px] gap-2">
              <Calendar className="h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex-1 min-w-[120px] gap-2">
              <FileText className="h-4 w-4" />
              Medical
            </TabsTrigger>
            <TabsTrigger value="laboratory" className="flex-1 min-w-[120px] gap-2">
              <FlaskConical className="h-4 w-4" />
              Lab Results
            </TabsTrigger>
            <TabsTrigger value="pharmacy" className="flex-1 min-w-[120px] gap-2">
              <Pill className="h-4 w-4" />
              Pharmacy
            </TabsTrigger>
          </TabsList>

          {/* Wallet Tab */}
          <TabsContent value="wallet">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Balance Overview */}
              <div className="card-healthcare p-6">
                <h3 className="font-semibold text-foreground mb-4">Balance Overview</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-success-light">
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-3xl font-bold text-success">₦{mockPatient.walletBalance.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 p-3 rounded-lg bg-secondary">
                      <p className="text-xs text-muted-foreground">Total Deposited</p>
                      <p className="text-lg font-semibold text-foreground">₦45,000</p>
                    </div>
                    <div className="flex-1 p-3 rounded-lg bg-secondary">
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                      <p className="text-lg font-semibold text-foreground">₦30,000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="lg:col-span-2 card-healthcare">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h3 className="font-semibold text-foreground">Transaction History</h3>
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Statement
                  </Button>
                </div>
                <div className="divide-y divide-border">
                  {walletTransactions.map((txn) => (
                    <div key={txn.id} className="flex items-center gap-4 p-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${txn.type === 'credit' ? 'bg-success-light' : 'bg-alert-light'}`}>
                        {txn.type === 'credit' ? (
                          <TrendingUp className="h-5 w-5 text-success" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-alert" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{txn.description}</p>
                        <p className="text-sm text-muted-foreground">{txn.reference} • {txn.date}</p>
                      </div>
                      <p className={`text-lg font-semibold ${txn.type === 'credit' ? 'text-success' : 'text-alert'}`}>
                        {txn.type === 'credit' ? '+' : '-'}₦{txn.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <div className="card-healthcare">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="font-semibold text-foreground">Appointment History</h3>
                <Button variant="hero" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
              <div className="divide-y divide-border">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4 p-4">
                    <div className="text-center min-w-[80px]">
                      <p className="text-lg font-bold text-primary">{apt.time}</p>
                      <p className="text-sm text-muted-foreground">{apt.date}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{apt.doctor}</p>
                        {apt.isFollowUp && <span className="badge-warning">Follow-up</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{apt.department}</p>
                    </div>
                    <span className={apt.status === 'upcoming' ? 'badge-info' : 'badge-success'}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="medical">
            <div className="space-y-6">
              {medicalRecords.map((record) => (
                <div key={record.id} className="card-healthcare p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{record.diagnosis}</h3>
                      <p className="text-sm text-muted-foreground">{record.doctor} • {record.date}</p>
                    </div>
                    <div className="flex gap-2">
                      {Object.entries(record.vitals).map(([key, value]) => (
                        <span key={key} className="badge-info">{value}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{record.notes}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Laboratory Tab */}
          <TabsContent value="laboratory">
            <div className="card-healthcare">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="font-semibold text-foreground">Lab Test Results</h3>
                <Button variant="outline" size="sm">View All Results</Button>
              </div>
              <div className="divide-y divide-border">
                {labResults.map((lab) => (
                  <div key={lab.id} className="flex items-center gap-4 p-4">
                    <div className="h-10 w-10 rounded-full bg-info-light flex items-center justify-center">
                      <FlaskConical className="h-5 w-5 text-info" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{lab.test}</p>
                      <p className="text-sm text-muted-foreground">{lab.doctor} • {lab.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{lab.result}</p>
                      <span className={lab.status === 'completed' ? 'badge-success' : 'badge-warning'}>
                        {lab.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Pharmacy Tab */}
          <TabsContent value="pharmacy">
            <div className="space-y-6">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="card-healthcare">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">Prescription #{rx.id}</h3>
                        <p className="text-sm text-muted-foreground">{rx.doctor} • {rx.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {rx.medications.map((med, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Pill className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{med.name}</p>
                          <p className="text-sm text-muted-foreground">{med.dosage} • {med.duration}</p>
                        </div>
                        <span className={med.dispensed ? 'badge-success' : 'badge-warning'}>
                          {med.dispensed ? 'Dispensed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
