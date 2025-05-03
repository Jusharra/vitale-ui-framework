
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import TelehealthContent from '@/components/member/TelehealthContent';

const Telehealth = () => {
  return (
    <MemberPageLayout 
      title="Telehealth Services" 
      description="Schedule and manage your virtual healthcare sessions"
    >
      <TelehealthContent />
    </MemberPageLayout>
  );
};

export default Telehealth;
