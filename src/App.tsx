import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Placements from '@/pages/Placements';
import About from '@/pages/About';
import Financing from '@/pages/Financing';
import Contact from '@/pages/Contact';
import Partners from '@/pages/Partners';
import Membership from '@/pages/Membership';
import Blog from '@/pages/Blog';
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
import AdminBlogPostsPage from '@/pages/admin/AdminBlogPostsPage';
import AdminFacilitiesPage from '@/pages/admin/AdminFacilitiesPage';
import AdminProfessionalsPage from '@/pages/admin/AdminProfessionalsPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminServicesPage from '@/pages/admin/AdminServicesPage';
import AdminPartnerApprovalsPage from '@/pages/admin/AdminPartnerApprovalsPage';
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
import HealthToolsPage from '@/pages/member/HealthTools';
import AppointmentsPage from '@/pages/member/Appointments';
import ProfilePage from '@/pages/ProfilePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StripeProvider from '@/components/payments/StripeProvider';
import SubscriptionSuccess from '@/pages/member/SubscriptionSuccess';
import FacilityPage from '@/pages/care/[slug]';
import FamilyManagement from '@/pages/member/FamilyManagement';
import ProfessionalProfilePage from '@/pages/professional/[slug]';
import Resources from '@/pages/Resources';
import Services from '@/pages/Services';

// Blog pages
import BlogIndex from '@/pages/blog/index';
import SanMateoCountyBlog from '@/pages/blog/iv-therapy-hospice-san-mateo-county';
import MarinCountyBlog from '@/pages/blog/iv-therapy-hospice-marin-county';
import OrangeCountyBlog from '@/pages/blog/iv-therapy-hospice-orange-county';
import SantaClaraCountyBlog from '@/pages/blog/iv-therapy-hospice-santa-clara-county';
import CollinCountyBlog from '@/pages/blog/iv-therapy-hospice-collin-county';
import WestlakeTarrantCountyBlog from '@/pages/blog/iv-therapy-hospice-westlake-tarrant-county';
import LosAngelesCountyBlog from '@/pages/blog/iv-therapy-hospice-los-angeles-county';
import WilliamsonCountyBlog from '@/pages/blog/iv-therapy-hospice-williamson-county';
import TravisCountyBlog from '@/pages/blog/iv-therapy-hospice-travis-county';
import MontgomeryCountyBlog from '@/pages/blog/iv-therapy-hospice-montgomery-county';
import ContraCostaCountyBlog from '@/pages/blog/iv-therapy-hospice-contra-costa-county';
import SanDiegoCountyBlog from '@/pages/blog/iv-therapy-hospice-san-diego-county';
import VenturaCountyBlog from '@/pages/blog/iv-therapy-hospice-ventura-county';
import FortBendCountyBlog from '@/pages/blog/iv-therapy-hospice-fort-bend-county';

// Professional routes
import ProfessionalCalendarPage from '@/pages/professional/Calendar';
import ProfessionalEarningsPage from '@/pages/professional/Earnings';
import ProfessionalMemberManagerPage from '@/pages/professional/MemberManager';
import ProfessionalMessageCenterPage from '@/pages/professional/MessageCenter';
import ProfessionalPatientRequestsPage from '@/pages/professional/PatientRequests';
import ProfessionalProfileSettingsPage from '@/pages/professional/ProfileSettings';
import ProfessionalToolsOfTradePage from '@/pages/professional/ToolsOfTrade';
import ProfessionalAnalyticsPage from '@/pages/professional/Analytics';
import DashboardRouter from '@/components/DashboardRouter';

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <LanguageProvider>
          <AuthProvider>
            <ThemeProvider defaultTheme="light" storageKey="vitale-ui-theme">
              <StripeProvider>
                <Toaster />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/financing" element={<Financing />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/blog" element={<BlogIndex />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/placements" element={<Placements />} />
                  <Route path="/membership" element={<Membership />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/services" element={<Services />} />
                  
                  {/* Facility routes - order matters, more specific routes first */}
                  <Route path="/care/care-homes/:city/:slug" element={<FacilityPage />} />
                  <Route path="/care/:slug" element={<FacilityPage />} />
                  
                  {/* Professional routes */}
                  <Route path="/professional/:slug" element={<ProfessionalProfilePage />} />
                  
                  {/* Blog post routes */}
                  <Route path="/blog/iv-therapy-hospice-san-mateo-county" element={<SanMateoCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-marin-county" element={<MarinCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-orange-county" element={<OrangeCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-santa-clara-county" element={<SantaClaraCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-collin-county" element={<CollinCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-westlake-tarrant-county" element={<WestlakeTarrantCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-los-angeles-county" element={<LosAngelesCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-williamson-county" element={<WilliamsonCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-travis-county" element={<TravisCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-montgomery-county" element={<MontgomeryCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-contra-costa-county" element={<ContraCostaCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-san-diego-county" element={<SanDiegoCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-ventura-county" element={<VenturaCountyBlog />} />
                  <Route path="/blog/iv-therapy-hospice-fort-bend-county" element={<FortBendCountyBlog />} />
                  
                  {/* Dashboard router to handle role-based routing */}
                  <Route
                    path="/dashboard"
                    element={<DashboardRouter />}
                  />
                  
                  {/* Member routes */}
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
                  
                  <Route
                    path="/dashboard/health-tools"
                    element={
                      <ProtectedRoute>
                        <HealthToolsPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/dashboard/appointments"
                    element={
                      <ProtectedRoute>
                        <AppointmentsPage />
                      </ProtectedRoute>
                    }
                  />
                  
                   <Route
                     path="/dashboard/subscription-success"
                     element={
                       <ProtectedRoute>
                         <SubscriptionSuccess />
                       </ProtectedRoute>
                     }
                   />
                   
                   <Route
                     path="/dashboard/family"
                     element={
                       <ProtectedRoute>
                         <FamilyManagement />
                       </ProtectedRoute>
                     }
                   />
                  
                  {/* Admin routes */}
                  <Route
                    path="/dashboard/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin/vacations"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminVacationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin/promotions"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminPromotionsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin/leads"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminLeadsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin/care-teams"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminCareTeamsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin/health-tools"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminHealthToolsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin/settings"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminSettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin/blog"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminBlogPostsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin/facilities"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminFacilitiesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin/professionals"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminProfessionalsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin/reports"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminReportsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin/services"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminServicesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/admin/partner-approvals"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminPartnerApprovalsPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Professional/Partner routes */}
                  <Route
                    path="/dashboard/professional"
                    element={
                      <ProtectedRoute requiredRole="professional">
                        <ProfessionalPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Professional sub-routes */}
                  <Route
                    path="/dashboard/professional/calendar"
                    element={
                      <ProtectedRoute requiredRole="professional">
                        <ProfessionalCalendarPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/professional/earnings"
                    element={
                      <ProtectedRoute requiredRole="professional">
                        <ProfessionalEarningsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/professional/member-manager"
                    element={
                      <ProtectedRoute requiredRole="professional">
                        <ProfessionalMemberManagerPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/professional/message-center"
                    element={
                      <ProtectedRoute requiredRole="professional">
                        <ProfessionalMessageCenterPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/professional/requests"
                    element={
                      <ProtectedRoute requiredRole="professional">
                        <ProfessionalPatientRequestsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/professional/profile"
                    element={
                      <ProtectedRoute requiredRole="professional">
                        <ProfessionalProfileSettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/professional/tools"
                    element={
                      <ProtectedRoute requiredRole="professional">
                        <ProfessionalToolsOfTradePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/professional/analytics"
                    element={
                      <ProtectedRoute requiredRole="professional">
                        <ProfessionalAnalyticsPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </StripeProvider>
            </ThemeProvider>
          </AuthProvider>
        </LanguageProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;