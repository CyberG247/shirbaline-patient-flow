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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Receipt,
  Search,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  FileText,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Mock data
const invoices = [
  {
    id: "INV-2024-001",
    patientId: "SH-2024-0001",
    patientName: "Amina Mohammed",
    date: "2024-01-15",
    dueDate: "2024-01-22",
    status: "paid",
    items: [
      { description: "Consultation Fee", amount: 5000 },
      { description: "Lab Test - Blood Count", amount: 3500 },
      { description: "Medications", amount: 2500 },
    ],
    total: 11000,
    paid: 11000,
    walletDeduction: true,
  },
  {
    id: "INV-2024-002",
    patientId: "SH-2024-0002",
    patientName: "Bello Abdullahi",
    date: "2024-01-15",
    dueDate: "2024-01-22",
    status: "pending",
    items: [
      { description: "Emergency Consultation", amount: 8000 },
      { description: "X-Ray", amount: 6000 },
      { description: "Medications", amount: 4500 },
    ],
    total: 18500,
    paid: 10000,
    walletDeduction: true,
  },
  {
    id: "INV-2024-003",
    patientId: "SH-2024-0003",
    patientName: "Hauwa Sani",
    date: "2024-01-14",
    dueDate: "2024-01-21",
    status: "overdue",
    items: [
      { description: "Follow-up Consultation", amount: 3000 },
      { description: "Lab Test - Urinalysis", amount: 2000 },
    ],
    total: 5000,
    paid: 0,
    walletDeduction: false,
  },
];

const transactions = [
  { id: "TXN001", date: "2024-01-15 10:30", type: "deposit", patient: "Amina Mohammed", amount: 15000, method: "Cash", reference: "DEP-001" },
  { id: "TXN002", date: "2024-01-15 11:15", type: "debit", patient: "Amina Mohammed", amount: 5000, method: "Wallet", reference: "INV-2024-001" },
  { id: "TXN003", date: "2024-01-15 14:00", type: "deposit", patient: "Bello Abdullahi", amount: 10000, method: "Transfer", reference: "DEP-002" },
  { id: "TXN004", date: "2024-01-15 14:30", type: "debit", patient: "Bello Abdullahi", amount: 10000, method: "Wallet", reference: "INV-2024-002" },
  { id: "TXN005", date: "2024-01-14 09:00", type: "deposit", patient: "Hauwa Sani", amount: 5000, method: "Cash", reference: "DEP-003" },
];

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("invoices");
  const [dateFilter, setDateFilter] = useState("today");

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.paid, 0);
  const pendingAmount = invoices.reduce((acc, inv) => acc + (inv.total - inv.paid), 0);
  const overdueCount = invoices.filter(inv => inv.status === "overdue").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success/20 text-success border-success">Paid</Badge>;
      case "pending":
        return <Badge className="bg-warning/20 text-warning-foreground border-warning">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-destructive/20 text-destructive border-destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Billing & Accounts</h1>
            <p className="text-muted-foreground">Invoice management, payments, and financial reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="gap-2">
              <Receipt className="h-4 w-4" />
              New Invoice
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className="text-2xl font-bold text-foreground">₦{totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" /> +12% from yesterday
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold text-warning">₦{pendingAmount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {invoices.filter(i => i.status === "pending").length} invoices
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-destructive">{overdueCount}</p>
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> Requires attention
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Invoices</p>
                  <p className="text-2xl font-bold text-foreground">{invoices.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="invoices" className="gap-2">
              <Receipt className="h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, ID, or invoice number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="card-healthcare">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{invoice.patientName}</p>
                          <p className="text-xs text-muted-foreground">{invoice.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>₦{invoice.total.toLocaleString()}</TableCell>
                      <TableCell className="text-success">₦{invoice.paid.toLocaleString()}</TableCell>
                      <TableCell className={invoice.total - invoice.paid > 0 ? "text-destructive font-medium" : ""}>
                        ₦{(invoice.total - invoice.paid).toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">View</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Invoice {invoice.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-lg font-bold text-primary">Shirbaline Hospital</p>
                                    <p className="text-sm text-muted-foreground">Dutse, Jigawa State, Nigeria</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{invoice.id}</p>
                                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                                  </div>
                                </div>
                                <div className="border-t pt-4">
                                  <p className="text-sm text-muted-foreground">Bill To:</p>
                                  <p className="font-medium">{invoice.patientName}</p>
                                  <p className="text-sm text-muted-foreground">{invoice.patientId}</p>
                                </div>
                                <div className="border rounded-lg overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-muted">
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {invoice.items.map((item, idx) => (
                                        <TableRow key={idx}>
                                          <TableCell>{item.description}</TableCell>
                                          <TableCell className="text-right">₦{item.amount.toLocaleString()}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₦{invoice.total.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-success">
                                    <span>Amount Paid</span>
                                    <span>-₦{invoice.paid.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Balance Due</span>
                                    <span className={invoice.total - invoice.paid > 0 ? "text-destructive" : "text-success"}>
                                      ₦{(invoice.total - invoice.paid).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2 pt-4">
                                  <Button variant="outline" className="flex-1 gap-2">
                                    <Printer className="h-4 w-4" />
                                    Print
                                  </Button>
                                  {invoice.total - invoice.paid > 0 && (
                                    <Button className="flex-1 gap-2">
                                      <DollarSign className="h-4 w-4" />
                                      Record Payment
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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

          <TabsContent value="transactions" className="space-y-4">
            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-medium">{txn.id}</TableCell>
                        <TableCell>{txn.date}</TableCell>
                        <TableCell>{txn.patient}</TableCell>
                        <TableCell>
                          <span className={`flex items-center gap-1 ${txn.type === "deposit" ? "text-success" : "text-destructive"}`}>
                            {txn.type === "deposit" ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                            {txn.type === "deposit" ? "Deposit" : "Debit"}
                          </span>
                        </TableCell>
                        <TableCell className={txn.type === "deposit" ? "text-success font-medium" : "text-destructive font-medium"}>
                          {txn.type === "deposit" ? "+" : "-"}₦{txn.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{txn.method}</TableCell>
                        <TableCell className="text-muted-foreground">{txn.reference}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-healthcare">
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Consultation Fees</span>
                      <span className="font-medium">₦156,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Laboratory Tests</span>
                      <span className="font-medium">₦89,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pharmacy Sales</span>
                      <span className="font-medium">₦124,750</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Registration Fees</span>
                      <span className="font-medium">₦45,000</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="font-medium">Total Revenue</span>
                      <span className="text-xl font-bold text-primary">₦415,250</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-healthcare">
                <CardHeader>
                  <CardTitle className="text-lg">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Cash</span>
                      <span className="font-medium">₦185,000 (45%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bank Transfer</span>
                      <span className="font-medium">₦145,250 (35%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Patient Wallet</span>
                      <span className="font-medium">₦85,000 (20%)</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full gap-2 mt-4">
                    <Download className="h-4 w-4" />
                    Download Full Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Billing;
