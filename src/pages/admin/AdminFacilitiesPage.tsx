import React from 'react';
import Layout from '@/components/layout/Layout';
import FacilityManagement from '@/components/admin/care-teams/FacilityManagement';

const AdminFacilitiesPage = () => {
  return (
    <Layout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Care Facilities</h1>
          <p className="text-muted-foreground">
            Manage care facilities for placement services
          </p>
        </div>
        <FacilityManagement />
      </div>
    </Layout>
  );
};

export default AdminFacilitiesPage;