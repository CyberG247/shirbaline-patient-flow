import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/contexts/TenantContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";

// Animated Wave Particle Component
const WaveParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient background - Healthcare Green theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(152,69%,31%)] via-[hsl(152,60%,35%)] to-[hsl(152,75%,22%)]" />
      
      {/* Animated diagonal lines/particles */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="lineGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Animated diagonal lines */}
        <g className="animate-wave-float">
          <rect x="-50" y="300" width="200" height="12" rx="6" fill="url(#lineGradient1)" transform="rotate(-45)" className="animate-pulse" />
          <rect x="0" y="350" width="150" height="10" rx="5" fill="url(#lineGradient2)" transform="rotate(-45)" style={{ animationDelay: "0.5s" }} />
          <rect x="-30" y="400" width="180" height="8" rx="4" fill="url(#lineGradient1)" transform="rotate(-45)" className="animate-pulse" style={{ animationDelay: "1s" }} />
          <rect x="20" y="450" width="120" height="10" rx="5" fill="url(#lineGradient3)" transform="rotate(-45)" style={{ animationDelay: "1.5s" }} />
        </g>
        
        <g className="animate-wave-float-delayed">
          <rect x="-80" y="500" width="160" height="14" rx="7" fill="url(#lineGradient2)" transform="rotate(-45)" />
          <rect x="-40" y="550" width="200" height="10" rx="5" fill="url(#lineGradient1)" transform="rotate(-45)" className="animate-pulse" style={{ animationDelay: "0.3s" }} />
          <rect x="-10" y="600" width="140" height="8" rx="4" fill="url(#lineGradient3)" transform="rotate(-45)" style={{ animationDelay: "0.8s" }} />
        </g>
        
        {/* Floating circles/dots */}
        <circle cx="10%" cy="20%" r="4" fill="rgba(255,255,255,0.3)" className="animate-float" />
        <circle cx="25%" cy="70%" r="6" fill="rgba(255,255,255,0.2)" className="animate-float" style={{ animationDelay: "1s" }} />
        <circle cx="40%" cy="40%" r="3" fill="rgba(255,255,255,0.4)" className="animate-float" style={{ animationDelay: "2s" }} />
        <circle cx="15%" cy="85%" r="5" fill="rgba(255,255,255,0.25)" className="animate-float" style={{ animationDelay: "0.5s" }} />
        <circle cx="50%" cy="15%" r="4" fill="rgba(255,255,255,0.3)" className="animate-float" style={{ animationDelay: "1.5s" }} />
      </svg>
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const { tenants, switchTenant } = useTenant();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [accountType, setAccountType] = useState<"hospital" | "saas">("hospital");
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id ?? "");
  const [role, setRole] = useState<"Staff" | "HospitalAdmin">("Staff");

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    if (accountType === "hospital" && selectedTenantId) {
      switchTenant(selectedTenantId);
    }

    const success = await login(email, password, {
      tenantId: accountType === "hospital" ? selectedTenantId : null,
      role: accountType === "saas" ? "SaaSOwner" : role,
      name: accountType === "saas" ? "SaaS Owner" : "Hospital User",
      department: accountType === "saas" ? "SaaS Operations" : "Hospital Operations",
    });
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate(accountType === "saas" ? "/saas-admin" : "/");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding with Particles */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <WaveParticles />
        
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">SHIMS</h2>
              <p className="text-white/70 text-sm">FirstGrade Hospital Management System</p>
            </div>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Welcome to<br />
            <span className="text-[#86efac]">FirstGrade Hospital Management System</span>
          </h1>
          
          <p className="text-lg text-white/80 max-w-md leading-relaxed">
            Streamline patient care, manage appointments, track billing, and access comprehensive reports all in one secure platform.
          </p>
          
          <div className="mt-12 flex items-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">1,247</p>
              <p className="text-white/60 text-sm">Patients</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-white/60 text-sm">Support</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">99.9%</p>
              <p className="text-white/60 text-sm">Uptime</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold">SHIMS</h2>
              <p className="text-muted-foreground text-xs">FirstGrade Hospital Management System</p>
            </div>
          </div>
          
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-foreground">Sign In</h2>
            <p className="text-muted-foreground mt-2">
              Select account type and enter your credentials
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select value={accountType} onValueChange={(value) => setAccountType(value as "hospital" | "saas")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Hospital Staff</SelectItem>
                  <SelectItem value="saas">SaaS Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {accountType === "hospital" && (
              <>
                <div className="space-y-2">
                  <Label>Hospital</Label>
                  <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as "Staff" | "HospitalAdmin")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="HospitalAdmin">Hospital Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer">
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            
            <Button
              type="submit"
              variant="hero"
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <div className="space-y-1">
              <p>
                Demo credentials: <span className="font-medium text-foreground">any email & password</span>
              </p>
              <p>
                New hospital?{" "}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  Create an account
                </Link>
                {" · "}
                <Link to="/saas" className="text-primary font-medium hover:underline">
                  View plans
                </Link>
              </p>
            </div>
          </div>
          
          <p className="mt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} FirstGrade Hospital Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
