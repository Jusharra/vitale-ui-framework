
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";

interface BillingInformationProps {
  isLoading: boolean;
  subscriptionData: any;
}

const BillingInformation: React.FC<BillingInformationProps> = ({ isLoading, subscriptionData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>Manage your payment methods and billing details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
            <span>Loading billing information...</span>
          </div>
        ) : subscriptionData?.subscription ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Billing Cycle</p>
              <p className="font-medium">
                {subscriptionData.subscription.interval === 'year' ? 'Yearly' : 'Monthly'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Billing Date</p>
              <p className="font-medium">
                {new Date(subscriptionData.subscription.current_period_end * 1000).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subscription Status</p>
              <div className="flex items-center space-x-2">
                <p className="font-medium capitalize">{subscriptionData.subscription.status}</p>
                {subscriptionData.subscription.status === 'active' && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                )}
                {subscriptionData.subscription.status === 'past_due' && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Past Due
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Auto-Renewal</p>
              <p className="font-medium">{subscriptionData.subscription.cancel_at_period_end ? 'Off' : 'On'}</p>
            </div>
            
            {subscriptionData.subscription.cancel_at && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Cancellation</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-1">
                  <p className="text-sm text-yellow-800">
                    Your subscription will be canceled on {new Date(subscriptionData.subscription.cancel_at * 1000).toLocaleDateString()}.
                    You'll continue to have access until this date.
                  </p>
                </div>
              </div>
            )}
            
            {subscriptionData.subscription.trial_end && new Date(subscriptionData.subscription.trial_end * 1000) > new Date() && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Trial Period</p>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-1">
                  <p className="text-sm text-blue-800">
                    Your trial ends on {new Date(subscriptionData.subscription.trial_end * 1000).toLocaleDateString()}.
                    Payment will begin after this date unless canceled.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4">
            <p className="text-center text-muted-foreground">No active subscription found. Select a plan to subscribe.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {subscriptionData?.subscription && (
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
            Manage Payment Methods
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BillingInformation;
