import React from 'react';
import Layout from '@/components/layout/Layout';
import AdminEarnings from '@/components/admin/AdminEarnings';

const AdminEarningsPage = () => {
  return (
    <Layout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage all revenue streams including memberships, payments, and partner revenue
          </p>
        </div>
        <AdminEarnings />
      </div>
    </Layout>
  );
};

export default AdminEarningsPage;