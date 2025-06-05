import React from 'react';
import Layout from '@/components/layout/Layout';
import FacilityPagesManager from '@/components/admin/facilities/FacilityPagesManager';

const AdminFacilitiesPage = () => {
  return (
    <Layout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Care Facility Pages</h1>
          <p className="text-muted-foreground">
            Create, edit, and publish SEO-optimized landing pages for care facilities
          </p>
        </div>
        <FacilityPagesManager />
      </div>
    </Layout>
  );
};

export default AdminFacilitiesPage;