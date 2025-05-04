
import React from 'react';
import { Route } from 'react-router-dom';
import AdminPage from '@/pages/AdminDashboard';
import AdminVacationsPage from '@/pages/admin/AdminVacationsPage';
import AdminPromotionsPage from '@/pages/admin/AdminPromotionsPage';
import AdminLeadsPage from '@/pages/admin/AdminLeadsPage';
import AdminCareTeamsPage from '@/pages/admin/AdminCareTeamsPage';
import AdminHealthToolsPage from '@/pages/admin/AdminHealthToolsPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';

// Admin routes to be added to the App.tsx Routes component
const AdminRoutes = (
  <>
    <Route path="/dashboard/admin" element={<AdminPage />} />
    <Route path="/dashboard/admin/vacations" element={<AdminVacationsPage />} />
    <Route path="/dashboard/admin/promotions" element={<AdminPromotionsPage />} />
    <Route path="/dashboard/admin/leads" element={<AdminLeadsPage />} />
    <Route path="/dashboard/admin/care-teams" element={<AdminCareTeamsPage />} />
    <Route path="/dashboard/admin/health-tools" element={<AdminHealthToolsPage />} />
    <Route path="/dashboard/admin/settings" element={<AdminSettingsPage />} />
  </>
);

export default AdminRoutes;
