
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefillRequest, Medication } from './types';

interface RefillRequestCardProps {
  request: RefillRequest;
  medication?: Medication;
}

const RefillRequestCard: React.FC<RefillRequestCardProps> = ({ request, medication }) => {
  return (
    <Card key={request.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{medication?.name}</CardTitle>
            <CardDescription>{medication?.dosage}</CardDescription>
          </div>
          <div>
            {request.status === 'pending' && (
              <Badge variant="outline">Pending</Badge>
            )}
            {request.status === 'approved' && (
              <Badge variant="default">Approved</Badge>
            )}
            {request.status === 'denied' && (
              <Badge variant="destructive">Denied</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-medium">Requested</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(request.request_date), "PPP")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Delivery Method</p>
            <p className="text-sm text-muted-foreground capitalize">
              {request.delivery_type}
            </p>
          </div>
        </div>
        {request.notes && (
          <div className="mt-2">
            <p className="text-sm font-medium">Notes</p>
            <p className="text-sm text-muted-foreground">{request.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        {request.status === 'approved' && (
          <Button variant="outline" className="w-full sm:w-auto">
            Track Delivery
          </Button>
        )}
        {request.status === 'pending' && (
          <Button variant="outline" className="w-full sm:w-auto" disabled>
            Awaiting Approval
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RefillRequestCard;
