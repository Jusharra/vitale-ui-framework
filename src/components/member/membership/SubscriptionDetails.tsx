
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Calendar, Loader2 } from 'lucide-react';
import MembershipBadge from '@/components/common/MembershipBadge';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  membership_tier?: string;
  trial_end_date?: string;
}

interface SubscriptionData {
  subscription?: {
    current_period_end: number;
    status: string;
    cancel_at_period_end: boolean;
  };
}

interface SubscriptionDetailsProps {
  profile: UserProfile | null;
  isTrialing: boolean;
  membershipTiers: any[];
  subscriptionData: SubscriptionData | null;
  isLoading: boolean;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({ 
  profile, 
  isTrialing, 
  membershipTiers,
  subscriptionData,
  isLoading 
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Your Membership</CardTitle>
            <CardDescription>Current plan and membership benefits</CardDescription>
          </div>
          <MembershipBadge type="premium" size="lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="font-medium">{membershipTiers.find(t => t.id === profile?.membership_tier)?.name || 'Smart Access'}</p>
          </div>
          {isTrialing && profile?.trial_end_date && (
            <div>
              <p className="text-sm text-muted-foreground">Trial Ends On</p>
              <p className="font-medium">{new Date(profile.trial_end_date).toLocaleDateString()}</p>
              <Badge variant="outline" className="mt-1">Trial Active</Badge>
            </div>
          )}
          {subscriptionData?.subscription && (
            <>
              <div>
                <p className="text-sm text-muted-foreground">Billing Cycle</p>
                <p className="font-medium">Monthly</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Billing Date</p>
                <p className="font-medium">{new Date(subscriptionData.subscription.current_period_end * 1000).toLocaleDateString()}</p>
              </div>
            </>
          )}
        </div>
        
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
            <span>Loading subscription details...</span>
          </div>
        )}
        
        {!isLoading && subscriptionData?.subscription && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
            <div className="flex">
              <CircleCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">Active Subscription</p>
                <p className="text-sm text-green-700">Your {profile?.membership_tier} membership is currently active and will renew automatically.</p>
              </div>
            </div>
          </div>
        )}
        
        {!isLoading && isTrialing && !subscriptionData?.subscription && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
            <div className="flex">
              <Calendar className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">Trial Period Active</p>
                <p className="text-sm text-yellow-700">You're currently on a free trial. Please select a plan below to continue after your trial ends.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row gap-2">
        {subscriptionData?.subscription ? (
          <Button variant="outline" onClick={async () => {
            try {
              const { data } = await supabase.functions.invoke('customer-portal');
              if (data?.url) window.location.href = data.url;
            } catch (error) {
              console.error('Error accessing customer portal:', error);
            }
          }}>
            Manage Subscription
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">Choose a plan below to upgrade your membership</p>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionDetails;
