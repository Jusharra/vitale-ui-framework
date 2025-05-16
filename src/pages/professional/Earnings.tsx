import React from 'react';
import Layout from '@/components/layout/Layout';
import EarningsContent from '@/components/professional/EarningsContent';
import { useAuth } from '@/context/AuthContext';

const EarningsPage = () => {
  const { userRole } = useAuth();
  const layoutRole = userRole === 'partner' ? 'partner' : 'professional';
  
  return (
    <Layout role={layoutRole}>
      <EarningsContent />
    </Layout>
  );
};

export default EarningsPage;