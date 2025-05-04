
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

interface PaymentHistoryProps {
  hasSubscription: boolean;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ hasSubscription }) => {
  if (!hasSubscription) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Your recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground py-6">
          View your payment history in the Stripe Customer Portal
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={async () => {
            try {
              const { data } = await supabase.functions.invoke('customer-portal');
              if (data?.url) window.location.href = data.url;
            } catch (error) {
              console.error('Error accessing customer portal:', error);
            }
          }}
        >
          View Billing History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentHistory;
