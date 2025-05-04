
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import MedicalTransportContent from '@/components/member/MedicalTransportContent';

const MedicalTransport = () => {
  return (
    <MemberPageLayout 
      title="Medical Transport Services" 
      description="Book medical transport for medical tourism, appointments, and other healthcare needs"
    >
      <MedicalTransportContent />
    </MemberPageLayout>
  );
};

export default MedicalTransport;
