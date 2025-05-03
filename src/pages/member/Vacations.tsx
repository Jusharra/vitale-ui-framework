
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import VacationsContent from '@/components/member/VacationsContent';

const Vacations = () => {
  return (
    <MemberPageLayout 
      title="Vacation Marketplace" 
      description="Exclusive vacation packages available for our members with special tier-based pricing."
    >
      <VacationsContent />
    </MemberPageLayout>
  );
};

export default Vacations;
