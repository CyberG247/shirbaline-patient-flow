import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FlaskConical,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  Printer,
  TestTube,
  Microscope,
  Activity,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const initialTestRequests = [
  {
    id: "LAB-001",
    patientId: "SH-2024-0001",
    patientName: "Amina Mohammed",
    doctorName: "Dr. Ibrahim Yusuf",
    date: "2024-01-15",
    time: "09:30 AM",
    status: "pending",
    priority: "normal",
    tests: [
      { name: "Complete Blood Count (CBC)", price: 3500 },
      { name: "Blood Glucose (Fasting)", price: 1500 },
    ],
    totalCost: 5000,
  },
  {
    id: "LAB-002",
    patientId: "SH-2024-0002",
    patientName: "Bello Abdullahi",
    doctorName: "Dr. Fatima Umar",
    date: "2024-01-15",
    time: "10:15 AM",
    status: "sample-collected",
    priority: "urgent",
    tests: [
      { name: "Malaria Parasite Test", price: 2000 },
      { name: "Widal Test", price: 2500 },
    ],
    totalCost: 4500,
  },
  {
    id: "LAB-003",
    patientId: "SH-2024-0003",
    patientName: "Hauwa Sani",
    doctorName: "Dr. Ibrahim Yusuf",
    date: "2024-01-15",
    time: "11:00 AM",
    status: "processing",
    priority: "normal",
    tests: [
      { name: "Urinalysis", price: 2000 },
    ],
    totalCost: 2000,
  },
  {
    id: "LAB-004",
    patientId: "SH-2024-0004",
    patientName: "Yusuf Garba",
    doctorName: "Dr. Ahmad Hassan",
    date: "2024-01-15",
    time: "08:45 AM",
    status: "completed",
    priority: "normal",
    tests: [
      { name: "Liver Function Test", price: 5000 },
      { name: "Kidney Function Test", price: 5000 },
    ],
    totalCost: 10000,
  },
];

const completedResults = [
  {
    id: "LAB-004",
    patientId: "SH-2024-0004",
    patientName: "Yusuf Garba",
    doctorName: "Dr. Ahmad Hassan",
    date: "2024-01-15",
    testName: "Liver Function Test",
    result: "Normal",
    remarks: "All values within normal range",
    verifiedBy: "Dr. Musa Lab Scientist",
  },
  {
    id: "LAB-005",
    patientId: "SH-2024-0005",
    patientName: "Zainab Isa",
    doctorName: "Dr. Fatima Umar",
    date: "2024-01-14",
    testName: "Complete Blood Count",
    result: "Abnormal",
    remarks: "Low hemoglobin level detected - 9.5 g/dL",
    verifiedBy: "Dr. Musa Lab Scientist",
  },
  {
    id: "LAB-006",
    patientId: "SH-2024-0006",
    patientName: "Ibrahim Danladi",
    doctorName: "Dr. Ibrahim Yusuf",
    date: "2024-01-14",
    testName: "Blood Glucose (Fasting)",
    result: "Normal",
    remarks: "Fasting blood glucose: 95 mg/dL",
    verifiedBy: "Dr. Musa Lab Scientist",
  },
];

const initialSampleCollection = [
  {
    id: "SC-001",
    labId: "LAB-001",
    patientName: "Amina Mohammed",
    sampleType: "Blood",
    collectionTime: "Pending",
    collectedBy: "-",
    status: "pending",
  },
  {
    id: "SC-002",
    labId: "LAB-002",
    patientName: "Bello Abdullahi",
    sampleType: "Blood",
    collectionTime: "10:20 AM",
    collectedBy: "Nurse Fatima",
    status: "collected",
  },
  {
    id: "SC-003",
    labId: "LAB-003",
    patientName: "Hauwa Sani",
    sampleType: "Urine",
    collectionTime: "11:05 AM",
    collectedBy: "Nurse Aisha",
    status: "collected",
  },
];

// Available tests
const availableTests = [
  { id: 1, name: "Complete Blood Count (CBC)", price: 3500 },
  { id: 2, name: "Blood Glucose (Fasting)", price: 1500 },
  { id: 3, name: "Blood Glucose (Random)", price: 1500 },
  { id: 4, name: "Malaria Parasite Test", price: 2000 },
  { id: 5, name: "Widal Test", price: 2500 },
  { id: 6, name: "Urinalysis", price: 2000 },
  { id: 7, name: "Liver Function Test", price: 5000 },
  { id: 8, name: "Kidney Function Test", price: 5000 },
  { id: 9, name: "Lipid Profile", price: 4500 },
  { id: 10, name: "HIV Screening", price: 3000 },
  { id: 11, name: "Hepatitis B Test", price: 3500 },
  { id: 12, name: "Pregnancy Test", price: 1500 },
];

const doctors = ["Dr. Ibrahim Yusuf", "Dr. Fatima Umar", "Dr. Ahmad Hassan", "Dr. Hauwa Sani"];

const Laboratory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("requests");
  const [statusFilter, setStatusFilter] = useState("all");
  const [testRequests, setTestRequests] = useState(initialTestRequests);
  const [sampleCollection, setSampleCollection] = useState(initialSampleCollection);
  
  // Dialog states
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCollecting, setIsCollecting] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // New Request Form State
  const [requestForm, setRequestForm] = useState({
    patientId: "",
    patientName: "",
    doctorName: "",
    priority: "normal",
    selectedTests: [] as number[],
  });

  const pendingCount = testRequests.filter(t => t.status === "pending").length;
  const processingCount = testRequests.filter(t => t.status === "processing" || t.status === "sample-collected").length;
  const completedCount = testRequests.filter(t => t.status === "completed").length;
  const urgentCount = testRequests.filter(t => t.priority === "urgent").length;

  const resetRequestForm = () => {
    setRequestForm({
      patientId: "",
      patientName: "",
      doctorName: "",
      priority: "normal",
      selectedTests: [],
    });
  };

  const getSelectedTestsTotal = () => {
    return requestForm.selectedTests.reduce((total, testId) => {
      const test = availableTests.find(t => t.id === testId);
      return total + (test?.price || 0);
    }, 0);
  };

  const handleTestToggle = (testId: number) => {
    setRequestForm(prev => ({
      ...prev,
      selectedTests: prev.selectedTests.includes(testId)
        ? prev.selectedTests.filter(id => id !== testId)
        : [...prev.selectedTests, testId]
    }));
  };

  const handleSubmitRequest = async () => {
    if (!requestForm.patientId || !requestForm.patientName || !requestForm.doctorName || requestForm.selectedTests.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one test.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedTestDetails = requestForm.selectedTests.map(testId => {
      const test = availableTests.find(t => t.id === testId);
      return { name: test?.name || "", price: test?.price || 0 };
    });

    const newRequest = {
      id: `LAB-${String(testRequests.length + 1).padStart(3, "0")}`,
      patientId: requestForm.patientId,
      patientName: requestForm.patientName,
      doctorName: requestForm.doctorName,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      status: "pending",
      priority: requestForm.priority,
      tests: selectedTestDetails,
      totalCost: getSelectedTestsTotal(),
    };

    setTestRequests([newRequest, ...testRequests]);
    
    // Add to sample collection queue
    const newSample = {
      id: `SC-${String(sampleCollection.length + 1).padStart(3, "0")}`,
      labId: newRequest.id,
      patientName: requestForm.patientName,
      sampleType: "Blood",
      collectionTime: "Pending",
      collectedBy: "-",
      status: "pending",
    };
    setSampleCollection([newSample, ...sampleCollection]);

    setIsSubmitting(false);
    setIsNewRequestOpen(false);
    resetRequestForm();

    toast({
      title: "Test Request Created",
      description: `Lab request ${newRequest.id} has been created for ${newRequest.patientName}.`,
    });
  };

  const handleCollectSample = async (labId: string) => {
    setIsCollecting(labId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setTestRequests(testRequests.map(req => 
      req.id === labId ? { ...req, status: "sample-collected" } : req
    ));

    setSampleCollection(sampleCollection.map(sample => 
      sample.labId === labId ? { 
        ...sample, 
        status: "collected", 
        collectionTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        collectedBy: "Current User"
      } : sample
    ));
    
    setIsCollecting(null);

    toast({
      title: "Sample Collected",
      description: `Sample for ${labId} has been collected.`,
    });
  };

  const handleStartProcessing = async (labId: string) => {
    setIsProcessing(labId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setTestRequests(testRequests.map(req => 
      req.id === labId ? { ...req, status: "processing" } : req
    ));
    
    setIsProcessing(null);

    toast({
      title: "Processing Started",
      description: `Lab request ${labId} is now being processed.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning/20 text-warning-foreground border-warning">Pending</Badge>;
      case "sample-collected":
        return <Badge className="bg-info/20 text-info border-info">Sample Collected</Badge>;
      case "processing":
        return <Badge className="bg-primary/20 text-primary border-primary">Processing</Badge>;
      case "completed":
        return <Badge className="bg-success/20 text-success border-success">Completed</Badge>;
      case "collected":
        return <Badge className="bg-success/20 text-success border-success">Collected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === "urgent") {
      return <Badge className="bg-destructive/20 text-destructive border-destructive">Urgent</Badge>;
    }
    return null;
  };

  const getResultBadge = (result: string) => {
    if (result === "Normal") {
      return <Badge className="bg-success/20 text-success border-success">Normal</Badge>;
    }
    return <Badge className="bg-destructive/20 text-destructive border-destructive">Abnormal</Badge>;
  };

  const filteredRequests = testRequests.filter(request => {
    const matchesSearch = 
      request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                <FlaskConical className="h-5 w-5 text-primary-foreground" />
              </div>
              Laboratory
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage lab test requests, sample collection, and results
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </Button>
            <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Test Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>New Lab Test Request</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Patient Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID *</Label>
                      <Input
                        id="patientId"
                        value={requestForm.patientId}
                        onChange={(e) => setRequestForm({ ...requestForm, patientId: e.target.value })}
                        placeholder="e.g., SH-2024-0001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name *</Label>
                      <Input
                        id="patientName"
                        value={requestForm.patientName}
                        onChange={(e) => setRequestForm({ ...requestForm, patientName: e.target.value })}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctorName">Requesting Doctor *</Label>
                      <Select value={requestForm.doctorName} onValueChange={(value) => setRequestForm({ ...requestForm, doctorName: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map(doc => (
                            <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={requestForm.priority} onValueChange={(value) => setRequestForm({ ...requestForm, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Test Selection */}
                  <div className="space-y-3">
                    <Label>Select Tests *</Label>
                    <div className="border rounded-lg p-4 max-h-[250px] overflow-y-auto space-y-2">
                      {availableTests.map(test => (
                        <div 
                          key={test.id} 
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            requestForm.selectedTests.includes(test.id) 
                              ? "bg-primary/10 border-primary" 
                              : "hover:bg-accent"
                          }`}
                          onClick={() => handleTestToggle(test.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox 
                              checked={requestForm.selectedTests.includes(test.id)}
                              onCheckedChange={() => handleTestToggle(test.id)}
                            />
                            <span className="font-medium">{test.name}</span>
                          </div>
                          <span className="text-muted-foreground">₦{test.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {requestForm.selectedTests.length > 0 && (
                    <div className="bg-secondary rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Selected Tests</p>
                          <p className="font-medium">{requestForm.selectedTests.length} test(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Cost</p>
                          <p className="text-xl font-bold text-primary">₦{getSelectedTestsTotal().toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full gap-2" 
                    variant="hero"
                    onClick={handleSubmitRequest}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Request...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create Test Request
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold text-foreground">{processingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold text-success">{completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Urgent</p>
                  <p className="text-2xl font-bold text-destructive">{urgentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Alert */}
        {urgentCount > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Urgent Tests Pending</p>
                  <p className="text-sm text-muted-foreground">
                    {urgentCount} urgent test request(s) require immediate attention
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="requests" className="gap-2">
              <FileText className="h-4 w-4" />
              Test Requests
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <Microscope className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="samples" className="gap-2">
              <TestTube className="h-4 w-4" />
              Sample Collection
            </TabsTrigger>
          </TabsList>

          {/* Test Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, ID, or lab number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sample-collected">Sample Collected</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="card-healthcare">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lab ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} className={request.priority === "urgent" ? "bg-destructive/5" : ""}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.patientName}</p>
                          <p className="text-xs text-muted-foreground">{request.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{request.doctorName}</TableCell>
                      <TableCell>{request.tests.length} test(s)</TableCell>
                      <TableCell>₦{request.totalCost.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Lab Request {request.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Patient</p>
                                  <p className="font-medium">{request.patientName}</p>
                                  <p className="text-xs text-muted-foreground">{request.patientId}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Requested By</p>
                                  <p className="font-medium">{request.doctorName}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Date/Time</p>
                                  <p className="font-medium">{request.date} - {request.time}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Status</p>
                                  {getStatusBadge(request.status)}
                                </div>
                              </div>
                              <div className="border rounded-lg p-4 space-y-3">
                                <p className="font-medium">Requested Tests</p>
                                {request.tests.map((test, idx) => (
                                  <div key={idx} className="flex justify-between items-center pb-2 border-b last:border-0">
                                    <p>{test.name}</p>
                                    <p className="font-medium">₦{test.price.toLocaleString()}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t">
                                <p className="font-medium">Total Cost</p>
                                <p className="text-lg font-bold text-primary">₦{request.totalCost.toLocaleString()}</p>
                              </div>
                              {request.status === "pending" && (
                                <Button 
                                  className="w-full gap-2"
                                  onClick={() => handleCollectSample(request.id)}
                                  disabled={isCollecting === request.id}
                                >
                                  {isCollecting === request.id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Collecting Sample...
                                    </>
                                  ) : (
                                    <>
                                      <TestTube className="h-4 w-4" />
                                      Collect Sample
                                    </>
                                  )}
                                </Button>
                              )}
                              {request.status === "sample-collected" && (
                                <Button 
                                  className="w-full gap-2"
                                  onClick={() => handleStartProcessing(request.id)}
                                  disabled={isProcessing === request.id}
                                >
                                  {isProcessing === request.id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Starting...
                                    </>
                                  ) : (
                                    <>
                                      <Activity className="h-4 w-4" />
                                      Start Processing
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search completed results..."
                className="pl-10 max-w-md"
              />
            </div>

            <Card className="card-healthcare">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lab ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Verified By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{result.patientName}</p>
                          <p className="text-xs text-muted-foreground">{result.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{result.testName}</TableCell>
                      <TableCell>{getResultBadge(result.result)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{result.remarks}</TableCell>
                      <TableCell>{result.verifiedBy}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="ghost" size="sm">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Sample Collection Tab */}
          <TabsContent value="samples" className="space-y-4">
            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="text-lg">Sample Collection Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sample ID</TableHead>
                      <TableHead>Lab ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Sample Type</TableHead>
                      <TableHead>Collection Time</TableHead>
                      <TableHead>Collected By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleCollection.map((sample) => (
                      <TableRow key={sample.id}>
                        <TableCell className="font-medium">{sample.id}</TableCell>
                        <TableCell>{sample.labId}</TableCell>
                        <TableCell>{sample.patientName}</TableCell>
                        <TableCell>{sample.sampleType}</TableCell>
                        <TableCell>{sample.collectionTime}</TableCell>
                        <TableCell>{sample.collectedBy}</TableCell>
                        <TableCell>{getStatusBadge(sample.status)}</TableCell>
                        <TableCell>
                          {sample.status === "pending" ? (
                            <Button 
                              size="sm" 
                              variant="hero"
                              onClick={() => handleCollectSample(sample.labId)}
                              disabled={isCollecting === sample.labId}
                            >
                              {isCollecting === sample.labId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Collect"
                              )}
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline">View</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Laboratory;
