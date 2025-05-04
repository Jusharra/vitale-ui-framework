
import React from 'react';
import PrescriptionManagement from '@/components/member/PrescriptionManagement';
import PharmacySearchBar from './PharmacySearchBar';

const PharmacyPrescriptionsTab: React.FC = () => {
  return (
    <div className="space-y-4 mt-4">
      <PharmacySearchBar placeholder="Search medications..." />
      <PrescriptionManagement />
    </div>
  );
};

export default PharmacyPrescriptionsTab;
