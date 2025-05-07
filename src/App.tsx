
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import AdminPage from '@/pages/AdminDashboard';
import AdminVacationsPage from '@/pages/admin/AdminVacationsPage';
import AdminPromotionsPage from '@/pages/admin/AdminPromotionsPage';
import AdminLeadsPage from '@/pages/admin/AdminLeadsPage';
import AdminCareTeamsPage from '@/pages/admin/AdminCareTeamsPage';
import AdminHealthToolsPage from '@/pages/admin/AdminHealthToolsPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import ProfessionalPage from '@/pages/ProfessionalDashboard';
import MemberConciergePage from '@/pages/member/Concierge';
import MemberPharmacyPage from '@/pages/member/Pharmacy';
import MemberMedicalTransportPage from '@/pages/member/MedicalTransport';
import MemberServiceBookingPage from '@/pages/member/ServiceBooking';
import MemberVacationsPage from '@/pages/member/Vacations';
import MemberHealthInsightsPage from '@/pages/member/HealthInsights';
import MemberMessagesPage from '@/pages/member/Messages';
import MemberMembershipPage from '@/pages/member/Membership';
import MemberPromotionsPage from '@/pages/member/Promotions';
import ShareAndEarn from '@/pages/member/ShareAndEarn';
import GlobalSettingsPage from '@/pages/member/GlobalSettingsPage';
import ResetPassword from '@/pages/ResetPassword';
import { AuthProvider } from '@/context/AuthContext';
import LanguageProvider from '@/components/i18n/LanguageProvider';

const App: React.FC = () => {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="vitale-ui-theme">
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Member routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* Add the Share & Earn route */}
              <Route
                path="/dashboard/share-and-earn"
                element={
                  <ProtectedRoute>
                    <ShareAndEarn />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard/concierge"
                element={
                  <ProtectedRoute>
                    <MemberConciergePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/pharmacy"
                element={
                  <ProtectedRoute>
                    <MemberPharmacyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/medical-transport"
                element={
                  <ProtectedRoute>
                    <MemberMedicalTransportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/service-booking"
                element={
                  <ProtectedRoute>
                    <MemberServiceBookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/vacations"
                element={
                  <ProtectedRoute>
                    <MemberVacationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/health-insights"
                element={
                  <ProtectedRoute>
                    <MemberHealthInsightsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/messages"
                element={
                  <ProtectedRoute>
                    <MemberMessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/membership"
                element={
                  <ProtectedRoute>
                    <MemberMembershipPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/promotions"
                element={
                  <ProtectedRoute>
                    <MemberPromotionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <GlobalSettingsPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin routes */}
              <Route
                path="/dashboard/admin/promotions"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPromotionsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route path="/dashboard/admin" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/vacations" element={<ProtectedRoute requiredRole="admin"><AdminVacationsPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/leads" element={<ProtectedRoute requiredRole="admin"><AdminLeadsPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/care-teams" element={<ProtectedRoute requiredRole="admin"><AdminCareTeamsPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/health-tools" element={<ProtectedRoute requiredRole="admin"><AdminHealthToolsPage /></ProtectedRoute>} />
              <Route path="/dashboard/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettingsPage /></ProtectedRoute>} />
              
              {/* Professional routes */}
              <Route path="/dashboard/professional" element={<ProtectedRoute requiredRole="professional"><ProfessionalPage /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;
