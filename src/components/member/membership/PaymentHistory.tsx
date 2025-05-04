
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface PaymentHistoryProps {
  hasSubscription: boolean;
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  status: string;
  description: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ hasSubscription }) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (hasSubscription) {
      fetchPaymentHistory();
    }
  }, [hasSubscription]);

  const fetchPaymentHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('payment-history');
      
      if (error) throw error;
      
      if (data?.payments) {
        setPayments(data.payments);
      }
    } catch (error: any) {
      console.error('Error fetching payment history:', error);
      toast({
        title: "Error",
        description: "Failed to load payment history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!hasSubscription) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Your recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
            <span>Loading payment history...</span>
          </div>
        ) : payments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>${(payment.amount / 100).toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{payment.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-6">
            No payment records found. View your complete payment history in the Stripe Customer Portal.
          </p>
        )}
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
