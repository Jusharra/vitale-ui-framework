
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medication } from './types';

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
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium">No Active Prescriptions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You don't have any active prescriptions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {medications.map((medication) => (
        <Card key={medication.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-lg">{medication.name}</CardTitle>
                <CardDescription>{medication.dosage}</CardDescription>
              </div>
              <div>
                {medication.is_controlled && (
                  <Badge variant="destructive">Controlled</Badge>
                )}
                {medication.refills_remaining > 0 ? (
                  <Badge variant="secondary" className="ml-2">
                    {medication.refills_remaining} refills left
                  </Badge>
                ) : (
                  <Badge variant="outline" className="ml-2">No refills</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm">{medication.instructions}</p>
            {medication.last_filled && (
              <p className="text-xs text-muted-foreground mt-2">
                Last filled: {format(new Date(medication.last_filled), "PPP")}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActivePrescriptions;
