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
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Trash2,
  Loader2,
  CreditCard,
  FileSpreadsheet,
  FileType,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const initialInvoices = [
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

const initialTransactions = [
  { id: "TXN001", date: "2024-01-15 10:30", type: "deposit", patient: "Amina Mohammed", amount: 15000, method: "Cash", reference: "DEP-001" },
  { id: "TXN002", date: "2024-01-15 11:15", type: "debit", patient: "Amina Mohammed", amount: 5000, method: "Wallet", reference: "INV-2024-001" },
  { id: "TXN003", date: "2024-01-15 14:00", type: "deposit", patient: "Bello Abdullahi", amount: 10000, method: "Transfer", reference: "DEP-002" },
  { id: "TXN004", date: "2024-01-15 14:30", type: "debit", patient: "Bello Abdullahi", amount: 10000, method: "Wallet", reference: "INV-2024-002" },
  { id: "TXN005", date: "2024-01-14 09:00", type: "deposit", patient: "Hauwa Sani", amount: 5000, method: "Cash", reference: "DEP-003" },
];

// Service items for quick selection
const serviceItems = [
  { id: 1, name: "Registration Fee", price: 2000 },
  { id: 2, name: "Consultation Fee", price: 5000 },
  { id: 3, name: "Emergency Consultation", price: 8000 },
  { id: 4, name: "Follow-up Consultation", price: 3000 },
  { id: 5, name: "Lab Test - Blood Count", price: 3500 },
  { id: 6, name: "Lab Test - Urinalysis", price: 2000 },
  { id: 7, name: "Lab Test - Malaria", price: 2000 },
  { id: 8, name: "X-Ray", price: 6000 },
  { id: 9, name: "Ultrasound", price: 8000 },
  { id: 10, name: "ECG", price: 5000 },
];

const Billing = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("invoices");
  const [dateFilter, setDateFilter] = useState("today");
  const [invoices, setInvoices] = useState(initialInvoices);
  const [transactions, setTransactions] = useState(initialTransactions);

  // Dialog states
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isRecordingPayment, setIsRecordingPayment] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);

  // Invoice form state
  const [invoiceForm, setInvoiceForm] = useState({
    patientId: "",
    patientName: "",
    items: [] as { description: string; amount: number }[],
    newItemDescription: "",
    newItemAmount: "",
  });

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.paid, 0);
  const pendingAmount = invoices.reduce((acc, inv) => acc + (inv.total - inv.paid), 0);
  const overdueCount = invoices.filter(inv => inv.status === "overdue").length;

  const getInvoiceTotal = () => {
    return invoiceForm.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const resetInvoiceForm = () => {
    setInvoiceForm({
      patientId: "",
      patientName: "",
      items: [],
      newItemDescription: "",
      newItemAmount: "",
    });
  };

  const handleAddItem = () => {
    if (!invoiceForm.newItemDescription || !invoiceForm.newItemAmount) return;
    
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { 
        description: prev.newItemDescription, 
        amount: parseInt(prev.newItemAmount) 
      }],
      newItemDescription: "",
      newItemAmount: "",
    }));
  };

  const handleAddQuickItem = (item: { name: string; price: number }) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { description: item.name, amount: item.price }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleCreateInvoice = async () => {
    if (!invoiceForm.patientId || !invoiceForm.patientName || invoiceForm.items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in patient details and add at least one item.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingInvoice(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newInvoice = {
      id: `INV-2024-${String(invoices.length + 1).padStart(3, "0")}`,
      patientId: invoiceForm.patientId,
      patientName: invoiceForm.patientName,
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "pending",
      items: invoiceForm.items,
      total: getInvoiceTotal(),
      paid: 0,
      walletDeduction: false,
    };

    setInvoices([newInvoice, ...invoices]);
    setIsCreatingInvoice(false);
    setIsNewInvoiceOpen(false);
    resetInvoiceForm();

    toast({
      title: "Invoice Created",
      description: `Invoice ${newInvoice.id} has been generated for ${newInvoice.patientName}.`,
    });
  };

  const handleRecordPayment = async (invoiceId: string, invoice: typeof invoices[0]) => {
    setIsRecordingPayment(invoiceId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const amountDue = invoice.total - invoice.paid;
    
    // Update invoice
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status: "paid", paid: inv.total, walletDeduction: true }
        : inv
    ));

    // Add transaction
    const newTransaction = {
      id: `TXN${String(transactions.length + 1).padStart(3, "0")}`,
      date: new Date().toLocaleString("en-US", { 
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit"
      }),
      type: "debit" as const,
      patient: invoice.patientName,
      amount: amountDue,
      method: "Wallet",
      reference: invoiceId,
    };
    setTransactions([newTransaction, ...transactions]);
    
    setIsRecordingPayment(null);

    toast({
      title: "Payment Recorded",
      description: `₦${amountDue.toLocaleString()} has been deducted from patient's wallet.`,
    });
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    setExportFormat("csv");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate CSV content
    const headers = ["Invoice #", "Patient", "Patient ID", "Date", "Total", "Paid", "Balance", "Status"];
    const rows = invoices.map(inv => [
      inv.id,
      inv.patientName,
      inv.patientId,
      inv.date,
      inv.total,
      inv.paid,
      inv.total - inv.paid,
      inv.status
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `billing_report_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
    setExportFormat(null);

    toast({
      title: "CSV Exported",
      description: `Exported ${invoices.length} invoices to CSV file.`,
    });
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportFormat("pdf");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create PDF content using browser print
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Billing Report - Shirbaline Hospital</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #0d9488; font-size: 24px; }
          h2 { color: #333; font-size: 18px; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f5f5f5; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0d9488; padding-bottom: 10px; }
          .summary { background: #f0fdfa; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .paid { color: #10b981; }
          .pending { color: #f59e0b; }
          .overdue { color: #ef4444; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Shirbaline Hospital</h1>
            <p>Billing Report</p>
          </div>
          <div style="text-align: right;">
            <p>Generated: ${new Date().toLocaleDateString()}</p>
            <p>Dutse, Jigawa State, Nigeria</p>
          </div>
        </div>
        
        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Total Revenue:</strong> ₦${totalRevenue.toLocaleString()}</p>
          <p><strong>Pending Payments:</strong> ₦${pendingAmount.toLocaleString()}</p>
          <p><strong>Total Invoices:</strong> ${invoices.length}</p>
          <p><strong>Overdue:</strong> ${overdueCount}</p>
        </div>
        
        <h2>Invoice Details</h2>
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${invoices.map(inv => `
              <tr>
                <td>${inv.id}</td>
                <td>${inv.patientName}<br/><small>${inv.patientId}</small></td>
                <td>${inv.date}</td>
                <td>₦${inv.total.toLocaleString()}</td>
                <td class="paid">₦${inv.paid.toLocaleString()}</td>
                <td class="${inv.total - inv.paid > 0 ? 'overdue' : ''}">₦${(inv.total - inv.paid).toLocaleString()}</td>
                <td class="${inv.status}">${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>This report was automatically generated by Shirbaline Hospital Management System</p>
          <p>© ${new Date().getFullYear()} Shirbaline Hospital. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
    
    // Open print dialog for PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
    
    setIsExporting(false);
    setExportFormat(null);

    toast({
      title: "PDF Generated",
      description: "Print dialog opened. Save as PDF to download.",
    });
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    setExportFormat("excel");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate Excel-compatible CSV with special formatting
    const headers = ["Invoice #", "Patient", "Patient ID", "Date", "Due Date", "Total (₦)", "Paid (₦)", "Balance (₦)", "Status"];
    const rows = invoices.map(inv => [
      inv.id,
      inv.patientName,
      inv.patientId,
      inv.date,
      inv.dueDate,
      inv.total,
      inv.paid,
      inv.total - inv.paid,
      inv.status
    ]);
    
    // Add summary row
    const summaryRows = [
      [],
      ["SUMMARY"],
      ["Total Revenue", "", "", "", "", "", totalRevenue],
      ["Pending Amount", "", "", "", "", "", "", pendingAmount],
      ["Total Invoices", invoices.length],
      ["Overdue Count", overdueCount],
    ];
    
    const csvContent = [
      headers.join("\t"),
      ...rows.map(row => row.join("\t")),
      ...summaryRows.map(row => row.join("\t"))
    ].join("\n");
    
    // Create and download file with .xls extension for Excel
    const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `billing_report_${new Date().toISOString().split("T")[0]}.xls`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
    setExportFormat(null);

    toast({
      title: "Excel Exported",
      description: `Exported ${invoices.length} invoices to Excel file.`,
    });
  };

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
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary-foreground" />
              </div>
              Billing & Accounts
            </h1>
            <p className="text-muted-foreground mt-2">Invoice management, payments, and financial reports</p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isExporting ? `Exporting ${exportFormat?.toUpperCase()}...` : "Export Report"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4 text-success" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
                  <FileType className="h-4 w-4 text-destructive" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isNewInvoiceOpen} onOpenChange={setIsNewInvoiceOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2">
                  <Receipt className="h-4 w-4" />
                  New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Generate New Invoice</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Patient Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID *</Label>
                      <Input
                        id="patientId"
                        value={invoiceForm.patientId}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, patientId: e.target.value })}
                        placeholder="e.g., SH-2024-0001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name *</Label>
                      <Input
                        id="patientName"
                        value={invoiceForm.patientName}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, patientName: e.target.value })}
                        placeholder="Full name"
                      />
                    </div>
                  </div>

                  {/* Quick Add Services */}
                  <div className="space-y-3">
                    <Label>Quick Add Services</Label>
                    <div className="flex flex-wrap gap-2">
                      {serviceItems.slice(0, 6).map(item => (
                        <Button
                          key={item.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddQuickItem(item)}
                          className="text-xs"
                        >
                          {item.name} (₦{item.price.toLocaleString()})
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Item Entry */}
                  <div className="space-y-3">
                    <Label>Add Custom Item</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Description"
                        value={invoiceForm.newItemDescription}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, newItemDescription: e.target.value })}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Amount"
                        type="number"
                        value={invoiceForm.newItemAmount}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, newItemAmount: e.target.value })}
                        className="w-32"
                      />
                      <Button variant="outline" onClick={handleAddItem}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Invoice Items */}
                  {invoiceForm.items.length > 0 && (
                    <div className="space-y-3">
                      <Label>Invoice Items</Label>
                      <div className="border rounded-lg divide-y">
                        {invoiceForm.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3">
                            <span>{item.description}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">₦{item.amount.toLocaleString()}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(idx)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  {invoiceForm.items.length > 0 && (
                    <div className="bg-secondary rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">₦{getInvoiceTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full gap-2" 
                    variant="hero"
                    onClick={handleCreateInvoice}
                    disabled={isCreatingInvoice}
                  >
                    {isCreatingInvoice ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating Invoice...
                      </>
                    ) : (
                      <>
                        <Receipt className="h-4 w-4" />
                        Generate Invoice
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                                    <Button 
                                      className="flex-1 gap-2"
                                      onClick={() => handleRecordPayment(invoice.id, invoice)}
                                      disabled={isRecordingPayment === invoice.id}
                                    >
                                      {isRecordingPayment === invoice.id ? (
                                        <>
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                          Processing...
                                        </>
                                      ) : (
                                        <>
                                          <DollarSign className="h-4 w-4" />
                                          Record Payment
                                        </>
                                      )}
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full gap-2 mt-4"
                        disabled={isExporting}
                      >
                        {isExporting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        {isExporting ? `Exporting ${exportFormat?.toUpperCase()}...` : "Download Full Report"}
                        <ChevronDown className="h-4 w-4 ml-auto" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-[200px]">
                      <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
                        <FileSpreadsheet className="h-4 w-4" />
                        Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer">
                        <FileSpreadsheet className="h-4 w-4 text-success" />
                        Export as Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
                        <FileType className="h-4 w-4 text-destructive" />
                        Export as PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
