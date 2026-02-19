import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import FleetLayout from "./components/fleet/FleetLayout";
import ProtectedRoute from "./components/fleet/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import LeadSubmit from "./pages/LeadSubmit";
import Leads from "./pages/Leads";
import WalletPage from "./pages/WalletPage";
import CompareLoan from "./pages/CompareLoan";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<FleetLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/submit" element={<LeadSubmit />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/wallet" element={<WalletPage />} />
              </Route>
            </Route>
            <Route path="/compare-loan" element={<CompareLoan />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
