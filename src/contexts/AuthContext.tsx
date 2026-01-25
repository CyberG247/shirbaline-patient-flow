import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type UserRole = "Staff" | "HospitalAdmin" | "SaaSOwner";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  tenantId: string | null;
}

interface LoginOptions {
  tenantId?: string | null;
  role?: UserRole;
  name?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, options?: LoginOptions) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: "USR-001",
  name: "IT Desk Officer",
  email: "it.desk@shirbaline.com",
  role: "Staff",
  department: "Reception",
  tenantId: "TEN-001",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("shirbaline_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, options?: LoginOptions): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (email && password) {
      const role = options?.role ?? "Staff";
      const loggedInUser: User = {
        id: `USR-${Date.now()}`,
        name: options?.name ?? DEFAULT_USER.name,
        email,
        role,
        department: options?.department ?? DEFAULT_USER.department,
        tenantId: role === "SaaSOwner" ? null : options?.tenantId ?? DEFAULT_USER.tenantId,
      };
      setUser(loggedInUser);
      localStorage.setItem("shirbaline_user", JSON.stringify(loggedInUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shirbaline_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
