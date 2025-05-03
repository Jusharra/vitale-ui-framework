
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import AppointmentsContent from '@/components/member/AppointmentsContent';

const Appointments = () => {
  return (
    <MemberPageLayout 
      title="Appointments & Bookings" 
      description="Manage your healthcare appointments and service bookings"
    >
      <AppointmentsContent />
    </MemberPageLayout>
  );
};

export default Appointments;
