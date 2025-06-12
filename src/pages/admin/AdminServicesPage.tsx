import React from 'react';
import Layout from '@/components/layout/Layout';
import AdminServices from '@/components/admin/AdminServices';

const AdminServicesPage = () => {
  return (
    <Layout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage services that members can book
          </p>
        </div>
        <AdminServices />
      </div>
    </Layout>
  );
};

export default AdminServicesPage;