
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/member/Appointments";
import HealthTools from "./pages/member/HealthTools";
import Messages from "./pages/member/Messages";
import Pharmacy from "./pages/member/Pharmacy";
import Rewards from "./pages/member/Rewards";
import Promotions from "./pages/member/Promotions";
import Membership from "./pages/member/Membership";
import Support from "./pages/member/Support";
import Telehealth from "./pages/member/Telehealth";
import ServiceBooking from "./pages/member/ServiceBooking";
import Concierge from "./pages/member/Concierge";
import PurchaseHistory from "./pages/member/PurchaseHistory";
import HealthInsights from "./pages/member/HealthInsights";
import Calendar from "./pages/professional/Calendar";
import PatientRequests from "./pages/professional/PatientRequests";
import ToolsOfTrade from "./pages/professional/ToolsOfTrade";
import Earnings from "./pages/professional/Earnings";
import ProfileSettings from "./pages/professional/ProfileSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/appointments" element={<Appointments />} />
          <Route path="/dashboard/health-tools" element={<HealthTools />} />
          <Route path="/dashboard/health-insights" element={<HealthInsights />} />
          <Route path="/dashboard/messages" element={<Messages />} />
          <Route path="/dashboard/pharmacy" element={<Pharmacy />} />
          <Route path="/dashboard/rewards" element={<Rewards />} />
          <Route path="/dashboard/promotions" element={<Promotions />} />
          <Route path="/dashboard/membership" element={<Membership />} />
          <Route path="/dashboard/support" element={<Support />} />
          <Route path="/dashboard/telehealth" element={<Telehealth />} />
          <Route path="/dashboard/service-booking" element={<ServiceBooking />} />
          <Route path="/dashboard/concierge" element={<Concierge />} />
          <Route path="/dashboard/purchase-history" element={<PurchaseHistory />} />
          <Route path="/dashboard/professional" element={<ProfessionalDashboard />} />
          <Route path="/dashboard/professional/calendar" element={<Calendar />} />
          <Route path="/dashboard/professional/requests" element={<PatientRequests />} />
          <Route path="/dashboard/professional/tools" element={<ToolsOfTrade />} />
          <Route path="/dashboard/professional/earnings" element={<Earnings />} />
          <Route path="/dashboard/professional/profile" element={<ProfileSettings />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
