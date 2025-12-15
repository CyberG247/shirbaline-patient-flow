import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus,
  User,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Wallet,
  CheckCircle2,
  Printer,
} from "lucide-react";

export default function RegisterPatient() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [patientId, setPatientId] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    alternatePhone: "",
    address: "",
    state: "Jigawa",
    lga: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodGroup: "",
    allergies: "",
    presentingComplaint: "",
    initialDeposit: "5000",
  });

  const generatePatientId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `SH-${year}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newPatientId = generatePatientId();
    setPatientId(newPatientId);
    setRegistrationComplete(true);
    setIsSubmitting(false);

    toast({
      title: "Patient Registered Successfully",
      description: `Patient ID: ${newPatientId}`,
    });
  };

  const handlePrintSlip = () => {
    // In production, this would trigger actual printing
    toast({
      title: "Print Job Sent",
      description: "Registration slip sent to printer",
    });
  };

  if (registrationComplete) {
    return (
      <MainLayout>
        <div className="p-6 lg:p-8 max-w-2xl mx-auto">
          <div className="card-healthcare p-8 text-center animate-slide-up">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-success-light flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Registration Complete!
            </h1>
            <p className="text-muted-foreground mb-6">
              Patient has been successfully registered in the system.
            </p>

            {/* Registration Slip Preview */}
            <div className="bg-secondary rounded-xl p-6 text-left mb-6 border-2 border-dashed border-border">
              <div className="text-center mb-4 pb-4 border-b border-border">
                <h2 className="text-lg font-bold text-primary">SHIRBALINE HOSPITAL</h2>
                <p className="text-sm text-muted-foreground">Dutse, Jigawa State, Nigeria</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient ID:</span>
                  <span className="font-bold text-primary">{patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium text-right max-w-[200px]">
                    {formData.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registration Fee:</span>
                  <span className="font-medium">₦2,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Initial Deposit:</span>
                  <span className="font-medium">₦{formData.initialDeposit}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-muted-foreground">Wallet Balance:</span>
                  <span className="font-bold text-success">
                    ₦{parseInt(formData.initialDeposit) - 2000}
                  </span>
                </div>
                <div className="text-center pt-4 text-xs text-muted-foreground">
                  Registration Date: {new Date().toLocaleDateString("en-NG")}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={handlePrintSlip} variant="outline" size="lg">
                <Printer className="h-4 w-4 mr-2" />
                Print Slip
              </Button>
              <Button
                onClick={() => {
                  setRegistrationComplete(false);
                  setFormData({
                    firstName: "",
                    lastName: "",
                    dateOfBirth: "",
                    gender: "",
                    phone: "",
                    alternatePhone: "",
                    address: "",
                    state: "Jigawa",
                    lga: "",
                    emergencyContactName: "",
                    emergencyContactPhone: "",
                    bloodGroup: "",
                    allergies: "",
                    presentingComplaint: "",
                    initialDeposit: "5000",
                  });
                }}
                variant="hero"
                size="lg"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register Another
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary-foreground" />
            </div>
            Register New Patient
          </h1>
          <p className="text-muted-foreground mt-2">
            Create a new patient profile and initialize their wallet
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="card-healthcare p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bloodGroup: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card-healthcare p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="08012345678"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alternatePhone">Alternate Phone</Label>
                <Input
                  id="alternatePhone"
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={(e) =>
                    setFormData({ ...formData, alternatePhone: e.target.value })
                  }
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter full address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" value="Jigawa" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lga">Local Government Area *</Label>
                <Select
                  value={formData.lga}
                  onValueChange={(value) =>
                    setFormData({ ...formData, lga: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select LGA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dutse">Dutse</SelectItem>
                    <SelectItem value="hadejia">Hadejia</SelectItem>
                    <SelectItem value="gumel">Gumel</SelectItem>
                    <SelectItem value="kazaure">Kazaure</SelectItem>
                    <SelectItem value="birnin-kudu">Birnin Kudu</SelectItem>
                    <SelectItem value="ringim">Ringim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="card-healthcare p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-alert" />
              Emergency Contact
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Contact Name *</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContactName: e.target.value,
                    })
                  }
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Contact Phone *</Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContactPhone: e.target.value,
                    })
                  }
                  placeholder="08012345678"
                  required
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="card-healthcare p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Visit Information
            </h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="presentingComplaint">
                  Presenting Complaint / Reason for Visit *
                </Label>
                <Textarea
                  id="presentingComplaint"
                  value={formData.presentingComplaint}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      presentingComplaint: e.target.value,
                    })
                  }
                  placeholder="Describe the patient's symptoms or reason for visiting..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Input
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  placeholder="List any known allergies (if any)"
                />
              </div>
            </div>
          </div>

          {/* Wallet Initialization */}
          <div className="card-healthcare p-6 animate-fade-in border-2 border-primary/20 bg-primary/5">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Wallet Initialization
            </h2>
            <div className="bg-card rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Registration Fee:</span>
                <span className="font-semibold">₦2,000</span>
              </div>
              <p className="text-xs text-muted-foreground">
                One-time fee for creating patient profile and hospital card
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialDeposit">Initial Wallet Deposit *</Label>
              <Select
                value={formData.initialDeposit}
                onValueChange={(value) =>
                  setFormData({ ...formData, initialDeposit: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select deposit amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5000">₦5,000 (Minimum)</SelectItem>
                  <SelectItem value="10000">₦10,000</SelectItem>
                  <SelectItem value="20000">₦20,000</SelectItem>
                  <SelectItem value="50000">₦50,000</SelectItem>
                  <SelectItem value="100000">₦100,000</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Registration fee will be deducted from initial deposit. Wallet
                balance:{" "}
                <span className="font-semibold text-success">
                  ₦{parseInt(formData.initialDeposit) - 2000}
                </span>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" size="lg">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Complete Registration
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
