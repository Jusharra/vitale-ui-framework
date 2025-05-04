
import React from 'react';
import PharmacyFinder from '@/components/member/PharmacyFinder';
import PharmacySearchBar from './PharmacySearchBar';

const PharmacyFinderTab: React.FC = () => {
  return (
    <div className="space-y-4 mt-4">
      <PharmacySearchBar placeholder="Search by location..." />
      <PharmacyFinder />
    </div>
  );
};

export default PharmacyFinderTab;
