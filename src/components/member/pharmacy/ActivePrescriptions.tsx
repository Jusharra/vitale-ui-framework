
import React from 'react';
import { Medication } from './types';
import MedicationCard from './MedicationCard';
import EmptyStateCard from './EmptyStateCard';

interface ActivePrescriptionsProps {
  medications: Medication[];
  isLoading: boolean;
}

const ActivePrescriptions: React.FC<ActivePrescriptionsProps> = ({ medications, isLoading }) => {
  if (isLoading) {
    return <div>Loading prescriptions...</div>;
  }

  if (medications.length === 0) {
    return (
      <EmptyStateCard
        title="No Active Prescriptions"
        description="You don't have any active prescriptions."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {medications.map((medication) => (
        <MedicationCard key={medication.id} medication={medication} />
      ))}
    </div>
  );
};

export default ActivePrescriptions;
