import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings as SettingsIcon,
  Building2,
  User,
  Bell,
  Palette,
  Shield,
  Save,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  Users,
  Key,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/contexts/TenantContext";

const Settings = () => {
  const { toast } = useToast();
  const { currentTenant, updateTenantProfile } = useTenant();
  const [activeTab, setActiveTab] = useState("hospital");
  const [showPassword, setShowPassword] = useState(false);
  
  // Loading states
  const [isSavingHospital, setIsSavingHospital] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Hospital settings state
  const [hospitalSettings, setHospitalSettings] = useState({
    name: currentTenant?.profile.name ?? "Hospital",
    shortName: currentTenant?.profile.shortName ?? "HMS",
    email: currentTenant?.profile.email ?? "info@hospital.com",
    phone: currentTenant?.profile.phone ?? "",
    address: currentTenant?.profile.address ?? "",
    city: currentTenant?.profile.city ?? "",
    state: currentTenant?.profile.state ?? "",
    country: currentTenant?.profile.country ?? "",
    website: currentTenant?.profile.website ?? "",
    brandColor: currentTenant?.profile.brandColor ?? "hsl(152, 69%, 31%)",
    registrationFee: "2000",
    minimumDeposit: "5000",
    workingHours: "24/7",
  });

  // User settings state
  const [userSettings, setUserSettings] = useState({
    fullName: "IT Desk Officer",
    email: "it@shirbalinehospital.com",
    phone: "08012345678",
    role: "Reception",
    department: "Front Desk",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    lowBalanceAlerts: true,
    appointmentReminders: true,
    labResultsReady: true,
    systemUpdates: false,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: "light",
    compactMode: false,
    showAnimations: true,
    fontSize: "medium",
  });

  const handleSaveHospital = async () => {
    setIsSavingHospital(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSavingHospital(false);
    if (currentTenant) {
      updateTenantProfile(currentTenant.id, {
        name: hospitalSettings.name,
        shortName: hospitalSettings.shortName,
        email: hospitalSettings.email,
        phone: hospitalSettings.phone,
        address: hospitalSettings.address,
        city: hospitalSettings.city,
        state: hospitalSettings.state,
        country: hospitalSettings.country,
        website: hospitalSettings.website,
        brandColor: hospitalSettings.brandColor,
        logoText: hospitalSettings.shortName.slice(0, 2).toUpperCase(),
      });
    }
    toast({
      title: "Settings Saved",
      description: "Hospital settings have been updated successfully.",
    });
  };

  const handleSaveUser = async () => {
    setIsSavingUser(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSavingUser(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSavingNotifications(false);
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSaveAppearance = async () => {
    setIsSavingAppearance(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSavingAppearance(false);
    toast({
      title: "Appearance Updated",
      description: "Appearance settings have been applied.",
    });
  };

  const handleSavePassword = async () => {
    setIsSavingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSavingPassword(false);
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };

  const handleSignOutAll = async () => {
    setIsSigningOut(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSigningOut(false);
    toast({
      title: "Sessions Terminated",
      description: "All other sessions have been signed out.",
    });
  };

  useEffect(() => {
    if (!currentTenant) return;
    setHospitalSettings((prev) => ({
      ...prev,
      name: currentTenant.profile.name,
      shortName: currentTenant.profile.shortName,
      email: currentTenant.profile.email,
      phone: currentTenant.profile.phone,
      address: currentTenant.profile.address,
      city: currentTenant.profile.city,
      state: currentTenant.profile.state,
      country: currentTenant.profile.country,
      website: currentTenant.profile.website,
      brandColor: currentTenant.profile.brandColor,
    }));
  }, [currentTenant]);

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <SettingsIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage hospital profile, user preferences, and system configuration
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="hospital" className="gap-2">
              <Building2 className="h-4 w-4" />
              Hospital
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Hospital Settings */}
          <TabsContent value="hospital" className="space-y-6">
            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Hospital Information
                </CardTitle>
                <CardDescription>
                  Basic information about the hospital
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital Name</Label>
                    <Input
                      id="hospitalName"
                      value={hospitalSettings.name}
                      onChange={(e) => setHospitalSettings({ ...hospitalSettings, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortName">Short Name / Abbreviation</Label>
                    <Input
                      id="shortName"
                      value={hospitalSettings.shortName}
                      onChange={(e) => setHospitalSettings({ ...hospitalSettings, shortName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hospitalEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      id="hospitalEmail"
                      type="email"
                      value={hospitalSettings.email}
                      onChange={(e) => setHospitalSettings({ ...hospitalSettings, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospitalPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone
                    </Label>
                    <Input
                      id="hospitalPhone"
                      value={hospitalSettings.phone}
                      onChange={(e) => setHospitalSettings({ ...hospitalSettings, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Address
                  </Label>
                  <Textarea
                    id="address"
                    value={hospitalSettings.address}
                    onChange={(e) => setHospitalSettings({ ...hospitalSettings, address: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={hospitalSettings.city}
                      onChange={(e) => setHospitalSettings({ ...hospitalSettings, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={hospitalSettings.state}
                      onChange={(e) => setHospitalSettings({ ...hospitalSettings, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={hospitalSettings.country}
                      disabled
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Website
                    </Label>
                    <Input
                      id="website"
                      value={hospitalSettings.website}
                      onChange={(e) => setHospitalSettings({ ...hospitalSettings, website: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brandColor" className="flex items-center gap-2">
                      <Palette className="h-4 w-4" /> Brand Color
                    </Label>
                    <Input
                      id="brandColor"
                      type="color"
                      value={hospitalSettings.brandColor}
                      onChange={(e) => setHospitalSettings({ ...hospitalSettings, brandColor: e.target.value })}
                      className="h-10 w-full p-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHours" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Working Hours
                    </Label>
                    <Input
                      id="workingHours"
                      value={hospitalSettings.workingHours}
                      onChange={(e) => setHospitalSettings({ ...hospitalSettings, workingHours: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Billing Configuration</CardTitle>
                <CardDescription>
                  Configure registration fee and wallet settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="regFee">Registration Fee (₦)</Label>
                    <Input
                      id="regFee"
                      type="number"
                      value={hospitalSettings.registrationFee}
                      onChange={(e) => setHospitalSettings({ ...hospitalSettings, registrationFee: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minDeposit">Minimum Initial Deposit (₦)</Label>
                    <Input
                      id="minDeposit"
                      type="number"
                      value={hospitalSettings.minimumDeposit}
                      onChange={(e) => setHospitalSettings({ ...hospitalSettings, minimumDeposit: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="hero" onClick={handleSaveHospital} className="gap-2" disabled={isSavingHospital}>
                {isSavingHospital ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSavingHospital ? "Saving..." : "Save Hospital Settings"}
              </Button>
            </div>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  User Profile
                </CardTitle>
                <CardDescription>
                  Manage your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">IT</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={userSettings.fullName}
                      onChange={(e) => setUserSettings({ ...userSettings, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="userPhone">Phone</Label>
                    <Input
                      id="userPhone"
                      value={userSettings.phone}
                      onChange={(e) => setUserSettings({ ...userSettings, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={userSettings.role}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Department
                  </Label>
                  <Input
                    id="department"
                    value={userSettings.department}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="hero" onClick={handleSaveUser} className="gap-2" disabled={isSavingUser}>
                {isSavingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSavingUser ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                    />
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <h4 className="font-medium">Alert Types</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Low Balance Alerts</p>
                      <p className="text-sm text-muted-foreground">Alert when patient wallet is low</p>
                    </div>
                    <Switch
                      checked={notifications.lowBalanceAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, lowBalanceAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Appointment Reminders</p>
                      <p className="text-sm text-muted-foreground">Upcoming appointment alerts</p>
                    </div>
                    <Switch
                      checked={notifications.appointmentReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, appointmentReminders: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Lab Results Ready</p>
                      <p className="text-sm text-muted-foreground">Notify when results are available</p>
                    </div>
                    <Switch
                      checked={notifications.labResultsReady}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, labResultsReady: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-muted-foreground">System maintenance and updates</p>
                    </div>
                    <Switch
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="hero" onClick={handleSaveNotifications} className="gap-2" disabled={isSavingNotifications}>
                {isSavingNotifications ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSavingNotifications ? "Saving..." : "Save Notifications"}
              </Button>
            </div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how the application looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={appearance.theme} onValueChange={(value) => setAppearance({ ...appearance, theme: value })}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select value={appearance.fontSize} onValueChange={(value) => setAppearance({ ...appearance, fontSize: value })}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compact Mode</p>
                      <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                    </div>
                    <Switch
                      checked={appearance.compactMode}
                      onCheckedChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Animations</p>
                      <p className="text-sm text-muted-foreground">Enable UI animations</p>
                    </div>
                    <Switch
                      checked={appearance.showAnimations}
                      onCheckedChange={(checked) => setAppearance({ ...appearance, showAnimations: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="hero" onClick={handleSaveAppearance} className="gap-2" disabled={isSavingAppearance}>
                {isSavingAppearance ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSavingAppearance ? "Saving..." : "Save Appearance"}
              </Button>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button variant="hero" className="gap-2" onClick={handleSavePassword} disabled={isSavingPassword}>
                  {isSavingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                  {isSavingPassword ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>

            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Session Management
                </CardTitle>
                <CardDescription>
                  Manage your active sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-muted-foreground">Windows • Chrome • Dutse, Nigeria</p>
                    <p className="text-xs text-muted-foreground">Started: Today at 9:00 AM</p>
                  </div>
                  <span className="badge-success">Active</span>
                </div>
                <Button variant="outline" className="text-destructive hover:text-destructive gap-2" onClick={handleSignOutAll} disabled={isSigningOut}>
                  {isSigningOut && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSigningOut ? "Signing Out..." : "Sign Out All Other Sessions"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
