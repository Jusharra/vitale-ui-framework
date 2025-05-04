
import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import MembershipPage from '@/pages/member/Membership';
import HealthToolsPage from '@/pages/member/HealthTools';
import TelehealthPage from '@/pages/member/Telehealth';
import AppointmentsPage from '@/pages/member/Appointments';
import PharmacyPage from '@/pages/member/Pharmacy';
import MessagesPage from '@/pages/member/Messages';
import MedicalTransportPage from '@/pages/member/MedicalTransport';
import VacationsPage from '@/pages/member/Vacations';
import PromotionsPage from '@/pages/member/Promotions';
import ConciergePagePage from '@/pages/member/Concierge';
import ServiceBookingPage from '@/pages/member/ServiceBooking';
import PurchaseHistoryPage from '@/pages/member/PurchaseHistory';
import HealthInsightsPage from '@/pages/member/HealthInsights';
import ShareAndEarnPage from '@/pages/member/ShareAndEarn';
import RewardsPage from '@/pages/member/Rewards';
import SubscriptionSuccessPage from '@/pages/member/SubscriptionSuccess';
import SupportPage from '@/pages/member/Support';
import SmartHealthPage from '@/pages/member/SmartHealth';
import GlobalSettingsPage from '@/pages/member/GlobalSettingsPage';

// Member routes to be added to the App.tsx Routes component
const MemberRoutes = (
  <>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/dashboard/membership" element={<MembershipPage />} />
    <Route path="/dashboard/health-tools" element={<HealthToolsPage />} />
    <Route path="/dashboard/telehealth" element={<TelehealthPage />} />
    <Route path="/dashboard/appointments" element={<AppointmentsPage />} />
    <Route path="/dashboard/pharmacy" element={<PharmacyPage />} />
    <Route path="/dashboard/messages" element={<MessagesPage />} />
    <Route path="/dashboard/medical-transport" element={<MedicalTransportPage />} />
    <Route path="/dashboard/vacations" element={<VacationsPage />} />
    <Route path="/dashboard/promotions" element={<PromotionsPage />} />
    <Route path="/dashboard/concierge" element={<ConciergePagePage />} />
    <Route path="/dashboard/service-booking" element={<ServiceBookingPage />} />
    <Route path="/dashboard/purchase-history" element={<PurchaseHistoryPage />} />
    <Route path="/dashboard/health-insights" element={<HealthInsightsPage />} />
    <Route path="/dashboard/share-and-earn" element={<ShareAndEarnPage />} /> 
    <Route path="/dashboard/rewards" element={<RewardsPage />} />
    <Route path="/dashboard/subscription-success" element={<SubscriptionSuccessPage />} />
    <Route path="/dashboard/support" element={<SupportPage />} />
    <Route path="/dashboard/smart-health" element={<SmartHealthPage />} />
    <Route path="/dashboard/settings" element={<GlobalSettingsPage />} />
  </>
);

export default MemberRoutes;
