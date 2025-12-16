import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Pill,
  Search,
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  Plus,
  FileText,
} from "lucide-react";

// Mock data
const prescriptions = [
  {
    id: "RX001",
    patientId: "SH-2024-0001",
    patientName: "Amina Mohammed",
    doctorName: "Dr. Ibrahim Yusuf",
    date: "2024-01-15",
    status: "pending",
    items: [
      { name: "Paracetamol 500mg", qty: 20, dosage: "2 tablets 3x daily" },
      { name: "Amoxicillin 250mg", qty: 21, dosage: "1 capsule 3x daily" },
    ],
    totalCost: 2500,
  },
  {
    id: "RX002",
    patientId: "SH-2024-0002",
    patientName: "Bello Abdullahi",
    doctorName: "Dr. Fatima Umar",
    date: "2024-01-15",
    status: "dispensed",
    items: [
      { name: "Metformin 500mg", qty: 60, dosage: "1 tablet 2x daily" },
    ],
    totalCost: 3200,
  },
  {
    id: "RX003",
    patientId: "SH-2024-0003",
    patientName: "Hauwa Sani",
    doctorName: "Dr. Ibrahim Yusuf",
    date: "2024-01-14",
    status: "partially_dispensed",
    items: [
      { name: "Omeprazole 20mg", qty: 30, dosage: "1 capsule daily" },
      { name: "Domperidone 10mg", qty: 30, dosage: "1 tablet 3x daily" },
    ],
    totalCost: 4500,
  },
];

const inventory = [
  { id: 1, name: "Paracetamol 500mg", category: "Analgesic", stock: 500, minStock: 100, unit: "Tablets", price: 50, expiry: "2025-06-15" },
  { id: 2, name: "Amoxicillin 250mg", category: "Antibiotic", stock: 200, minStock: 50, unit: "Capsules", price: 100, expiry: "2024-12-20" },
  { id: 3, name: "Metformin 500mg", category: "Antidiabetic", stock: 45, minStock: 100, unit: "Tablets", price: 80, expiry: "2025-03-10" },
  { id: 4, name: "Omeprazole 20mg", category: "Antacid", stock: 150, minStock: 50, unit: "Capsules", price: 120, expiry: "2024-09-30" },
  { id: 5, name: "Ibuprofen 400mg", category: "Analgesic", stock: 300, minStock: 80, unit: "Tablets", price: 60, expiry: "2025-08-22" },
  { id: 6, name: "Ciprofloxacin 500mg", category: "Antibiotic", stock: 15, minStock: 30, unit: "Tablets", price: 150, expiry: "2024-11-15" },
];

const Pharmacy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [selectedPrescription, setSelectedPrescription] = useState<typeof prescriptions[0] | null>(null);

  const lowStockItems = inventory.filter(item => item.stock < item.minStock);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning/20 text-warning-foreground border-warning">Pending</Badge>;
      case "dispensed":
        return <Badge className="bg-success/20 text-success border-success">Dispensed</Badge>;
      case "partially_dispensed":
        return <Badge className="bg-info/20 text-info border-info">Partial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock < minStock) {
      return <span className="text-destructive font-medium flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> Low</span>;
    }
    return <span className="text-success font-medium flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> OK</span>;
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pharmacy</h1>
            <p className="text-muted-foreground">Manage prescriptions, inventory, and dispensing</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Drug
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">
                    {prescriptions.filter(p => p.status === "pending").length}
                  </p>
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
                  <p className="text-sm text-muted-foreground">Dispensed Today</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-2xl font-bold text-destructive">{lowStockItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Drugs</p>
                  <p className="text-2xl font-bold text-foreground">{inventory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Low Stock Alert</p>
                  <p className="text-sm text-muted-foreground">
                    {lowStockItems.map(i => i.name).join(", ")} - Restock required
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="prescriptions" className="gap-2">
              <FileText className="h-4 w-4" />
              Prescriptions
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, ID, or prescription number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Card className="card-healthcare">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rx #</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((rx) => (
                    <TableRow key={rx.id}>
                      <TableCell className="font-medium">{rx.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{rx.patientName}</p>
                          <p className="text-xs text-muted-foreground">{rx.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{rx.doctorName}</TableCell>
                      <TableCell>{rx.items.length} items</TableCell>
                      <TableCell>₦{rx.totalCost.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(rx.status)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPrescription(rx)}
                            >
                              {rx.status === "pending" ? "Dispense" : "View"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Prescription {rx.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Patient</p>
                                  <p className="font-medium">{rx.patientName}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Doctor</p>
                                  <p className="font-medium">{rx.doctorName}</p>
                                </div>
                              </div>
                              <div className="border rounded-lg p-4 space-y-3">
                                <p className="font-medium">Prescribed Items</p>
                                {rx.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-start pb-2 border-b last:border-0">
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-xs text-muted-foreground">{item.dosage}</p>
                                    </div>
                                    <p className="text-sm">Qty: {item.qty}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t">
                                <p className="font-medium">Total Cost</p>
                                <p className="text-lg font-bold text-primary">₦{rx.totalCost.toLocaleString()}</p>
                              </div>
                              {rx.status === "pending" && (
                                <Button className="w-full gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Dispense & Deduct from Wallet
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

          <TabsContent value="inventory" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drugs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Card className="card-healthcare">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Drug Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((drug) => (
                    <TableRow key={drug.id} className={drug.stock < drug.minStock ? "bg-destructive/5" : ""}>
                      <TableCell className="font-medium">{drug.name}</TableCell>
                      <TableCell>{drug.category}</TableCell>
                      <TableCell>{drug.stock} {drug.unit}</TableCell>
                      <TableCell>{getStockStatus(drug.stock, drug.minStock)}</TableCell>
                      <TableCell>₦{drug.price}</TableCell>
                      <TableCell>{drug.expiry}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Restock</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Pharmacy;
