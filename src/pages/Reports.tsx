import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Wallet,
  FlaskConical,
  Pill,
  Calendar,
  FileSpreadsheet,
  FileType,
  ChevronDown,
  Loader2,
  Activity,
  UserCheck,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for reports
const overviewStats = {
  totalPatients: { value: 1247, change: 12, isPositive: true },
  totalRevenue: { value: 2850000, change: 8, isPositive: true },
  labTests: { value: 456, change: 15, isPositive: true },
  pharmacySales: { value: 1125000, change: -3, isPositive: false },
};

const monthlyTrends = [
  { month: "Jan", patients: 89, revenue: 425000 },
  { month: "Feb", patients: 102, revenue: 512000 },
  { month: "Mar", patients: 115, revenue: 578000 },
  { month: "Apr", patients: 98, revenue: 489000 },
  { month: "May", patients: 124, revenue: 621000 },
  { month: "Jun", patients: 135, revenue: 687000 },
];

const departmentPerformance = [
  { name: "General Medicine", patients: 423, revenue: 845000, target: 1000000, progress: 85 },
  { name: "Laboratory", patients: 456, revenue: 684000, target: 750000, progress: 91 },
  { name: "Pharmacy", patients: 512, revenue: 1125000, target: 1200000, progress: 94 },
  { name: "Radiology", patients: 89, revenue: 445000, target: 500000, progress: 89 },
  { name: "Emergency", patients: 67, revenue: 335000, target: 400000, progress: 84 },
];

const topServices = [
  { name: "Consultation", count: 423, revenue: 2115000 },
  { name: "Lab - Blood Tests", count: 312, revenue: 936000 },
  { name: "Pharmacy Sales", count: 892, revenue: 1125000 },
  { name: "X-Ray", count: 89, revenue: 534000 },
  { name: "Ultrasound", count: 56, revenue: 448000 },
];

const patientDemographics = [
  { ageGroup: "0-17", count: 156, percentage: 12.5 },
  { ageGroup: "18-35", count: 389, percentage: 31.2 },
  { ageGroup: "36-50", count: 423, percentage: 33.9 },
  { ageGroup: "51-65", count: 198, percentage: 15.9 },
  { ageGroup: "65+", count: 81, percentage: 6.5 },
];

const revenueByPaymentMethod = [
  { method: "Cash", amount: 1282500, percentage: 45 },
  { method: "Bank Transfer", amount: 997500, percentage: 35 },
  { method: "Patient Wallet", amount: 570000, percentage: 20 },
];

const Reports = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("this-month");
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);

  const handleExportCSV = async () => {
    setIsExporting(true);
    setExportFormat("csv");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const headers = ["Metric", "Value", "Change"];
    const rows = [
      ["Total Patients", overviewStats.totalPatients.value, `${overviewStats.totalPatients.change}%`],
      ["Total Revenue", `₦${overviewStats.totalRevenue.value.toLocaleString()}`, `${overviewStats.totalRevenue.change}%`],
      ["Lab Tests", overviewStats.labTests.value, `${overviewStats.labTests.change}%`],
      ["Pharmacy Sales", `₦${overviewStats.pharmacySales.value.toLocaleString()}`, `${overviewStats.pharmacySales.change}%`],
    ];
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `hospital_report_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
    setExportFormat(null);

    toast({
      title: "CSV Exported",
      description: "Report exported to CSV file.",
    });
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    setExportFormat("excel");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const headers = ["Metric", "Value", "Change", "Status"];
    const rows = [
      ["Total Patients", overviewStats.totalPatients.value, `${overviewStats.totalPatients.change}%`, "Positive"],
      ["Total Revenue", overviewStats.totalRevenue.value, `${overviewStats.totalRevenue.change}%`, "Positive"],
      ["Lab Tests", overviewStats.labTests.value, `${overviewStats.labTests.change}%`, "Positive"],
      ["Pharmacy Sales", overviewStats.pharmacySales.value, `${overviewStats.pharmacySales.change}%`, "Negative"],
    ];
    
    const csvContent = [
      headers.join("\t"),
      ...rows.map(row => row.join("\t"))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `hospital_report_${new Date().toISOString().split("T")[0]}.xls`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
    setExportFormat(null);

    toast({
      title: "Excel Exported",
      description: "Report exported to Excel file.",
    });
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportFormat("pdf");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hospital Reports - FirstGrade Hospital Management System</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #0d9488; font-size: 24px; }
          h2 { color: #333; font-size: 18px; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f5f5f5; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0d9488; padding-bottom: 10px; }
          .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
          .stat-card { background: #f0fdfa; padding: 15px; border-radius: 8px; }
          .positive { color: #10b981; }
          .negative { color: #ef4444; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>FirstGrade Hospital Management System</h1>
            <p>Hospital Performance Report</p>
          </div>
          <div style="text-align: right;">
            <p>Generated: ${new Date().toLocaleDateString()}</p>
            <p>Period: ${dateRange === 'this-month' ? 'This Month' : dateRange === 'this-week' ? 'This Week' : 'This Year'}</p>
          </div>
        </div>
        
        <h2>Key Metrics</h2>
        <div class="stat-grid">
          <div class="stat-card">
            <p><strong>Total Patients:</strong> ${overviewStats.totalPatients.value.toLocaleString()}</p>
            <p class="${overviewStats.totalPatients.isPositive ? 'positive' : 'negative'}">
              ${overviewStats.totalPatients.isPositive ? '+' : ''}${overviewStats.totalPatients.change}% from last period
            </p>
          </div>
          <div class="stat-card">
            <p><strong>Total Revenue:</strong> ₦${overviewStats.totalRevenue.value.toLocaleString()}</p>
            <p class="${overviewStats.totalRevenue.isPositive ? 'positive' : 'negative'}">
              ${overviewStats.totalRevenue.isPositive ? '+' : ''}${overviewStats.totalRevenue.change}% from last period
            </p>
          </div>
          <div class="stat-card">
            <p><strong>Lab Tests:</strong> ${overviewStats.labTests.value}</p>
            <p class="${overviewStats.labTests.isPositive ? 'positive' : 'negative'}">
              ${overviewStats.labTests.isPositive ? '+' : ''}${overviewStats.labTests.change}% from last period
            </p>
          </div>
          <div class="stat-card">
            <p><strong>Pharmacy Sales:</strong> ₦${overviewStats.pharmacySales.value.toLocaleString()}</p>
            <p class="${overviewStats.pharmacySales.isPositive ? 'positive' : 'negative'}">
              ${overviewStats.pharmacySales.isPositive ? '+' : ''}${overviewStats.pharmacySales.change}% from last period
            </p>
          </div>
        </div>

        <h2>Department Performance</h2>
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Patients</th>
              <th>Revenue</th>
              <th>Target</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            ${departmentPerformance.map(dept => `
              <tr>
                <td>${dept.name}</td>
                <td>${dept.patients}</td>
                <td>₦${dept.revenue.toLocaleString()}</td>
                <td>₦${dept.target.toLocaleString()}</td>
                <td>${dept.progress}%</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <h2>Top Services</h2>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Count</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${topServices.map(service => `
              <tr>
                <td>${service.name}</td>
                <td>${service.count}</td>
                <td>₦${service.revenue.toLocaleString()}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>This report was automatically generated by FirstGrade Hospital Management System</p>
          <p>© ${new Date().getFullYear()} FirstGrade Hospital Management System. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
    
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

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Hospital performance metrics and detailed analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
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
                  {isExporting ? `Exporting ${exportFormat?.toUpperCase()}...` : "Export"}
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
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold text-foreground">{overviewStats.totalPatients.value.toLocaleString()}</p>
                  <p className={`text-xs flex items-center gap-1 mt-1 ${overviewStats.totalPatients.isPositive ? 'text-success' : 'text-destructive'}`}>
                    {overviewStats.totalPatients.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {overviewStats.totalPatients.change}% from last period
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">₦{(overviewStats.totalRevenue.value / 1000000).toFixed(2)}M</p>
                  <p className={`text-xs flex items-center gap-1 mt-1 ${overviewStats.totalRevenue.isPositive ? 'text-success' : 'text-destructive'}`}>
                    {overviewStats.totalRevenue.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {overviewStats.totalRevenue.change}% from last period
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <Wallet className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lab Tests</p>
                  <p className="text-2xl font-bold text-foreground">{overviewStats.labTests.value}</p>
                  <p className={`text-xs flex items-center gap-1 mt-1 ${overviewStats.labTests.isPositive ? 'text-success' : 'text-destructive'}`}>
                    {overviewStats.labTests.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {overviewStats.labTests.change}% from last period
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-info/10">
                  <FlaskConical className="h-6 w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-healthcare">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pharmacy Sales</p>
                  <p className="text-2xl font-bold text-foreground">₦{(overviewStats.pharmacySales.value / 1000000).toFixed(2)}M</p>
                  <p className={`text-xs flex items-center gap-1 mt-1 ${overviewStats.pharmacySales.isPositive ? 'text-success' : 'text-destructive'}`}>
                    {overviewStats.pharmacySales.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(overviewStats.pharmacySales.change)}% from last period
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-warning/10">
                  <Pill className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="patients" className="gap-2">
              <UserCheck className="h-4 w-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="financial" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="departments" className="gap-2">
              <PieChart className="h-4 w-4" />
              Departments
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Monthly Trends */}
              <Card className="card-healthcare">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Monthly Trends
                  </CardTitle>
                  <CardDescription>Patient visits and revenue over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyTrends.map((item, index) => (
                      <div key={item.month} className="flex items-center gap-4">
                        <span className="w-12 text-sm font-medium">{item.month}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.patients} patients</span>
                            <span className="text-muted-foreground">₦{(item.revenue / 1000).toFixed(0)}K</span>
                          </div>
                          <Progress value={(item.patients / 150) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Services */}
              <Card className="card-healthcare">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Top Services
                  </CardTitle>
                  <CardDescription>Most utilized services by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topServices.map((service, index) => (
                        <TableRow key={service.name}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                {index + 1}
                              </span>
                              {service.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{service.count}</TableCell>
                          <TableCell className="text-right font-medium">₦{service.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Demographics */}
              <Card className="card-healthcare">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Patient Demographics
                  </CardTitle>
                  <CardDescription>Age distribution of patients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patientDemographics.map((item) => (
                      <div key={item.ageGroup} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.ageGroup} years</span>
                          <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Registration Stats */}
              <Card className="card-healthcare">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Registration Statistics
                  </CardTitle>
                  <CardDescription>New patient registrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">156</p>
                      <p className="text-sm text-muted-foreground">This Week</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-2xl font-bold text-success">687</p>
                      <p className="text-sm text-muted-foreground">This Month</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-2xl font-bold text-info">2,341</p>
                      <p className="text-sm text-muted-foreground">This Quarter</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-2xl font-bold text-foreground">8,927</p>
                      <p className="text-sm text-muted-foreground">This Year</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Registration Rate</p>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="flex-1" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">78% of walk-ins become registered patients</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Revenue Breakdown */}
              <Card className="card-healthcare">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Revenue by Payment Method
                  </CardTitle>
                  <CardDescription>How patients pay for services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueByPaymentMethod.map((item) => (
                      <div key={item.method} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.method}</span>
                          <span className="text-muted-foreground">₦{item.amount.toLocaleString()} ({item.percentage}%)</span>
                        </div>
                        <Progress value={item.percentage} className="h-3" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Revenue</span>
                      <span className="text-xl font-bold text-primary">₦{(2850000).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Department */}
              <Card className="card-healthcare">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    Revenue by Department
                  </CardTitle>
                  <CardDescription>Department-wise revenue contribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">%</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departmentPerformance.map((dept) => (
                        <TableRow key={dept.name}>
                          <TableCell className="font-medium">{dept.name}</TableCell>
                          <TableCell className="text-right">₦{dept.revenue.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">{dept.progress}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <div className="grid gap-4">
              {departmentPerformance.map((dept) => (
                <Card key={dept.name} className="card-healthcare">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{dept.name}</h3>
                          <Badge 
                            className={dept.progress >= 90 
                              ? "bg-success/20 text-success border-success" 
                              : dept.progress >= 80 
                                ? "bg-warning/20 text-warning-foreground border-warning"
                                : "bg-destructive/20 text-destructive border-destructive"
                            }
                          >
                            {dept.progress}% of target
                          </Badge>
                        </div>
                        <Progress value={dept.progress} className="h-3 mb-3" />
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Patients: </span>
                            <span className="font-medium">{dept.patients}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Revenue: </span>
                            <span className="font-medium text-success">₦{dept.revenue.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target: </span>
                            <span className="font-medium">₦{dept.target.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Gap: </span>
                            <span className={`font-medium ${dept.revenue >= dept.target ? 'text-success' : 'text-destructive'}`}>
                              ₦{Math.abs(dept.target - dept.revenue).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
