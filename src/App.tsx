import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndexPage from '@/pages/IndexPage';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import AdminPage from '@/pages/AdminDashboard';
import AdminVacationsPage from '@/pages/admin/AdminVacationsPage';
import AdminPromotionsPage from '@/pages/admin/AdminPromotionsPage';
import AdminLeadsPage from '@/pages/admin/AdminLeadsPage';
import AdminCareTeamsPage from '@/pages/admin/AdminCareTeamsPage';
import AdminHealthToolsPage from '@/pages/admin/AdminHealthToolsPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import ProfessionalPage from '@/pages/ProfessionalDashboard';
import MemberConciergePage from '@/pages/member/MemberConciergePage';
import MemberPharmacyPage from '@/pages/member/MemberPharmacyPage';
import MemberMedicalTransportPage from '@/pages/member/MemberMedicalTransportPage';
import MemberServiceBookingPage from '@/pages/member/MemberServiceBookingPage';
import MemberVacationsPage from '@/pages/member/MemberVacationsPage';
import MemberHealthInsightsPage from '@/pages/member/MemberHealthInsightsPage';
import MemberMessagesPage from '@/pages/member/MemberMessagesPage';
import MemberMembershipPage from '@/pages/member/MemberMembershipPage';
import MemberPromotionsPage from '@/pages/member/Promotions';
import ShareAndEarn from '@/pages/member/ShareAndEarn';
import { AuthProvider } from '@/context/AuthContext';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vitale-ui-theme">
          <Toaster />
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/auth" element={<Auth />} />
            
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
            
            {/* Admin routes */}
            <Route
              path="/dashboard/admin/promotions"
              element={
                <ProtectedRoute role="admin">
                  <AdminPromotionsPage />
                </ProtectedRoute>
              }
            />
            
            <Route path="/dashboard/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
            <Route path="/dashboard/admin/vacations" element={<ProtectedRoute role="admin"><AdminVacationsPage /></ProtectedRoute>} />
            <Route path="/dashboard/admin/leads" element={<ProtectedRoute role="admin"><AdminLeadsPage /></ProtectedRoute>} />
            <Route path="/dashboard/admin/care-teams" element={<ProtectedRoute role="admin"><AdminCareTeamsPage /></ProtectedRoute>} />
            <Route path="/dashboard/admin/health-tools" element={<ProtectedRoute role="admin"><AdminHealthToolsPage /></ProtectedRoute>} />
            <Route path="/dashboard/admin/settings" element={<ProtectedRoute role="admin"><AdminSettingsPage /></ProtectedRoute>} />
            
            {/* Professional routes */}
            <Route path="/dashboard/professional" element={<ProtectedRoute role="professional"><ProfessionalPage /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
