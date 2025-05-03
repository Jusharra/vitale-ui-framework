
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import ConciergeContent from '@/components/member/ConciergeContent';

const Concierge = () => {
  return (
    <MemberPageLayout 
      title="My Concierge Team" 
      description="Manage your healthcare provider team and preferred pharmacy"
    >
      <ConciergeContent />
    </MemberPageLayout>
  );
};

export default Concierge;
