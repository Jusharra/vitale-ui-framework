
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Transport } from '@/components/admin/care-teams/useCareTeamsData';
import { TransportFormValues } from './TransportBookingForm';

interface TransportPaymentSummaryProps {
  selectedProvider: Transport;
  formValues: TransportFormValues;
  membershipTier: string | null;
  onBack: () => void;
  onPayment: () => void;
}

const TransportPaymentSummary: React.FC<TransportPaymentSummaryProps> = ({
  selectedProvider,
  formValues,
  membershipTier,
  onBack,
  onPayment
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Complete your booking by making a payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium text-lg">Booking Summary</h3>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider:</span>
                <span className="font-medium">{selectedProvider.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{format(formValues.date, "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{formValues.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transport Type:</span>
                <span className="font-medium">{formValues.transportType}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Price:</span>
                <span className="font-medium">
                  {membershipTier === "vip" ? (
                    <span className="flex items-center gap-1">
                      <s>$75.00</s> <span className="text-green-600">$0.00 (VIP Benefit)</span>
                    </span>
                  ) : (
                    "$75.00"
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border p-4 rounded-md bg-white">
              <h3 className="font-medium mb-2">Payment Method</h3>
              <p className="text-sm text-muted-foreground">
                This would connect to Stripe for secure payment processing in a real implementation.
                {membershipTier === "vip" && " As a VIP member, your transport is complimentary."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4 justify-end">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onPayment}>
          {membershipTier === "vip" ? "Confirm Booking" : "Complete Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransportPaymentSummary;
