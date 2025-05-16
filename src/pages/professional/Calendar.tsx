import React from 'react';
import Layout from '@/components/layout/Layout';
import ProfessionalCalendar from '@/components/professional/ProfessionalCalendar';
import { useAuth } from '@/context/AuthContext';

const CalendarPage: React.FC = () => {
  const { userRole } = useAuth();
  const layoutRole = userRole === 'partner' ? 'partner' : 'professional';
  
  return (
    <Layout role={layoutRole}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your availability and appointments
          </p>
        </div>
        <ProfessionalCalendar />
      </div>
    </Layout>
  );
};

export default CalendarPage;