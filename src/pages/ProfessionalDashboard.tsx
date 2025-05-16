import React from 'react';
import Layout from '@/components/layout/Layout';
import ProfessionalDashboard from '@/components/dashboard/ProfessionalDashboard';
import { useAuth } from '@/context/AuthContext';

const ProfessionalPage = () => {
  const { userRole } = useAuth();
  
  // Determine the role to use for the layout
  const layoutRole = userRole === 'partner' ? 'partner' : 'professional';
  
  return (
    <Layout role={layoutRole}>
      <ProfessionalDashboard />
    </Layout>
  );
};

export default ProfessionalPage;