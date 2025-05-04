
import React from 'react';
import { RefillRequest, Medication } from './types';
import RefillRequestCard from './RefillRequestCard';
import EmptyStateCard from './EmptyStateCard';

interface RefillRequestsProps {
  refillRequests: RefillRequest[];
  getMedicationById: (id: string) => Medication | undefined;
  isLoading: boolean;
  onRequestRefill: () => void;
}

const RefillRequests: React.FC<RefillRequestsProps> = ({ 
  refillRequests, 
  getMedicationById, 
  isLoading,
  onRequestRefill
}) => {
  if (isLoading) {
    return <div>Loading refill requests...</div>;
  }

  if (refillRequests.length === 0) {
    return (
      <EmptyStateCard
        title="No Refill Requests"
        description="You don't have any pending or completed refill requests."
        actionLabel="Request a Refill"
        onAction={onRequestRefill}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {refillRequests.map((request) => {
        const medication = getMedicationById(request.medication_id);
        return (
          <RefillRequestCard 
            key={request.id} 
            request={request} 
            medication={medication} 
          />
        );
      })}
    </div>
  );
};

export default RefillRequests;
