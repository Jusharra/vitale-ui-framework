import React from 'react';
import Layout from '@/components/layout/Layout';
import ProfessionalPagesManager from '@/components/admin/professionals/ProfessionalPagesManager';

const AdminProfessionalsPage = () => {
  return (
    <Layout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Professional Pages</h1>
          <p className="text-muted-foreground">
            Create, edit, and publish SEO-optimized landing pages for healthcare professionals
          </p>
        </div>
        <ProfessionalPagesManager />
      </div>
    </Layout>
  );
};

export default AdminProfessionalsPage;