import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FleetLayout from "./components/fleet/FleetLayout";
import Dashboard from "./pages/Dashboard";
import LeadSubmit from "./pages/LeadSubmit";
import Leads from "./pages/Leads";
import WalletPage from "./pages/WalletPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<FleetLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/submit" element={<LeadSubmit />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/wallet" element={<WalletPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
