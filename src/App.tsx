
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
import Vacations from "./pages/member/Vacations";
import MedicalTransport from "./pages/member/MedicalTransport";
import Calendar from "./pages/professional/Calendar";
import PatientRequests from "./pages/professional/PatientRequests";
import ToolsOfTrade from "./pages/professional/ToolsOfTrade";
import Earnings from "./pages/professional/Earnings";
import ProfileSettings from "./pages/professional/ProfileSettings";
import MemberManager from "./pages/professional/MemberManager";
import MessageCenter from "./pages/professional/MessageCenter";
import AdminRoutes from "./routes/adminRoutes";
import Auth from "./pages/Auth";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SubscriptionSuccess from "./pages/member/SubscriptionSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Member routes */}
            <Route path="/dashboard" element={<ProtectedRoute requiredRole="member"><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/appointments" element={<ProtectedRoute requiredRole="member"><Appointments /></ProtectedRoute>} />
            <Route path="/dashboard/health-tools" element={<ProtectedRoute requiredRole="member"><HealthTools /></ProtectedRoute>} />
            <Route path="/dashboard/health-insights" element={<ProtectedRoute requiredRole="member"><HealthInsights /></ProtectedRoute>} />
            <Route path="/dashboard/messages" element={<ProtectedRoute requiredRole="member"><Messages /></ProtectedRoute>} />
            <Route path="/dashboard/pharmacy" element={<ProtectedRoute requiredRole="member"><Pharmacy /></ProtectedRoute>} />
            <Route path="/dashboard/rewards" element={<ProtectedRoute requiredRole="member"><Rewards /></ProtectedRoute>} />
            <Route path="/dashboard/promotions" element={<ProtectedRoute requiredRole="member"><Promotions /></ProtectedRoute>} />
            <Route path="/dashboard/membership" element={<ProtectedRoute requiredRole="member"><Membership /></ProtectedRoute>} />
            <Route path="/dashboard/support" element={<ProtectedRoute requiredRole="member"><Support /></ProtectedRoute>} />
            <Route path="/dashboard/telehealth" element={<ProtectedRoute requiredRole="member" requiredTier="vip"><Telehealth /></ProtectedRoute>} />
            <Route path="/dashboard/service-booking" element={<ProtectedRoute requiredRole="member"><ServiceBooking /></ProtectedRoute>} />
            <Route path="/dashboard/concierge" element={<ProtectedRoute requiredRole="member"><Concierge /></ProtectedRoute>} />
            <Route path="/dashboard/purchase-history" element={<ProtectedRoute requiredRole="member"><PurchaseHistory /></ProtectedRoute>} />
            <Route path="/dashboard/vacations" element={<ProtectedRoute requiredRole="member"><Vacations /></ProtectedRoute>} />
            <Route path="/dashboard/medical-transport" element={<ProtectedRoute requiredRole="member"><MedicalTransport /></ProtectedRoute>} />
            <Route path="/subscription-success" element={<ProtectedRoute requiredRole="member"><SubscriptionSuccess /></ProtectedRoute>} />
            
            {/* Protected Professional routes */}
            <Route path="/dashboard/professional" element={<ProtectedRoute requiredRole="professional"><ProfessionalDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/professional/calendar" element={<ProtectedRoute requiredRole="professional"><Calendar /></ProtectedRoute>} />
            <Route path="/dashboard/professional/requests" element={<ProtectedRoute requiredRole="professional"><PatientRequests /></ProtectedRoute>} />
            <Route path="/dashboard/professional/tools" element={<ProtectedRoute requiredRole="professional"><ToolsOfTrade /></ProtectedRoute>} />
            <Route path="/dashboard/professional/earnings" element={<ProtectedRoute requiredRole="professional"><Earnings /></ProtectedRoute>} />
            <Route path="/dashboard/professional/profile" element={<ProtectedRoute requiredRole="professional"><ProfileSettings /></ProtectedRoute>} />
            <Route path="/dashboard/professional/member-manager" element={<ProtectedRoute requiredRole="professional"><MemberManager /></ProtectedRoute>} />
            <Route path="/dashboard/professional/message-center" element={<ProtectedRoute requiredRole="professional"><MessageCenter /></ProtectedRoute>} />
            
            {/* Protected Admin routes */}
            <Route path="/dashboard/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            
            {/* Include the admin routes with protection */}
            {AdminRoutes}
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
