import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  partnerMobile: string | null;
  login: (mobile: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("fleet_auth") === "true";
  });
  const [partnerMobile, setPartnerMobile] = useState<string | null>(() => {
    return localStorage.getItem("fleet_mobile");
  });

  const login = (mobile: string) => {
    localStorage.setItem("fleet_auth", "true");
    localStorage.setItem("fleet_mobile", mobile);
    setIsAuthenticated(true);
    setPartnerMobile(mobile);
  };

  const logout = () => {
    localStorage.removeItem("fleet_auth");
    localStorage.removeItem("fleet_mobile");
    setIsAuthenticated(false);
    setPartnerMobile(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, partnerMobile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
