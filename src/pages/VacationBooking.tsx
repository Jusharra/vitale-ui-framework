import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import VacationBookingContent from '@/components/vacation/VacationBookingContent';

const VacationBooking = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <Layout>
      <VacationBookingContent packageSlug={slug} />
    </Layout>
  );
};

export default VacationBooking;