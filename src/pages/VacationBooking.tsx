import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import VacationBookingContent from '@/components/vacation/VacationBookingContent';

const VacationBooking = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <MainLayout>
      <VacationBookingContent packageSlug={slug} />
    </MainLayout>
  );
};

export default VacationBooking;