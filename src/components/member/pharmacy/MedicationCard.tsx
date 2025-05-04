
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medication } from './types';

interface MedicationCardProps {
  medication: Medication;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication }) => {
  return (
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
  );
};

export default MedicationCard;
