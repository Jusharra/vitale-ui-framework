
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProfessionalCalendar from '@/components/professional/ProfessionalCalendar';

const CalendarPage: React.FC = () => {
  return (
    <Layout role="professional">
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
