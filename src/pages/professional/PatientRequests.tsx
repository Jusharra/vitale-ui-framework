import React from 'react';
import Layout from '@/components/layout/Layout';
import PatientRequestsList from '@/components/professional/PatientRequestsList';
import { useAuth } from '@/context/AuthContext';

const PatientRequestsPage: React.FC = () => {
  const { userRole } = useAuth();
  const layoutRole = userRole === 'partner' ? 'partner' : 'professional';
  
  return (
    <Layout role={layoutRole}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Requests</h1>
          <p className="text-muted-foreground">
            Manage prescription refills and symptom alerts
          </p>
        </div>
        <PatientRequestsList />
      </div>
    </Layout>
  );
};

export default PatientRequestsPage;