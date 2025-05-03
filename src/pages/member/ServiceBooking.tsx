
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import ServiceBookingContent from '@/components/member/ServiceBookingContent';

const ServiceBooking = () => {
  return (
    <MemberPageLayout 
      title="Service Booking" 
      description="Book specialist and aesthetic services with your membership discount"
    >
      <ServiceBookingContent />
    </MemberPageLayout>
  );
};

export default ServiceBooking;
