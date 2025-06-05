import React from 'react';
import Layout from '@/components/layout/Layout';
import AdminReports from '@/components/admin/AdminReports';

const AdminReportsPage = () => {
  return (
    <Layout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            View and manage call reports and analytics
          </p>
        </div>
        <AdminReports />
      </div>
    </Layout>
  );
};

export default AdminReportsPage;