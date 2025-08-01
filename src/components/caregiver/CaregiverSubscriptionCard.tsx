import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface CaregiverSubscription {
  id: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export default function CaregiverSubscriptionCard() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<CaregiverSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (user && profile?.role === 'caregiver') {
      fetchSubscription();
    }
  }, [user, profile]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('caregiver_subscriptions')
        .select('*')
        .eq('caregiver_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching caregiver subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) return;
    
    setIsCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-caregiver-checkout');
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'past_due':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Past Due</Badge>;
      case 'canceled':
        return <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Inactive</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  // Check if caregiver is approved
  const isApproved = profile?.vetting_status === 'approved';
  const isPending = profile?.vetting_status === 'pending';
  const isRejected = profile?.vetting_status === 'rejected';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Directory Listing Subscription
          {subscription && getStatusBadge(subscription.status)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isApproved && (
          <div className="bg-muted p-4 rounded-lg">
            {isPending && (
              <div className="flex items-center space-x-2 text-amber-600">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="font-medium">Application Under Review</p>
                  <p className="text-sm text-muted-foreground">
                    Your caregiver application is being reviewed. You'll be able to subscribe once approved.
                  </p>
                </div>
              </div>
            )}
            {isRejected && (
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">Application Not Approved</p>
                  <p className="text-sm text-muted-foreground">
                    Your application was not approved. Please contact support for more information.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {isApproved && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Monthly Cost</h4>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold">$25.00</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              
              {subscription && subscription.current_period_end && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Next Billing Date</h4>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>{new Date(subscription.current_period_end).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">What you get:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Visible in public caregiver directory</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Direct contact from families seeking care</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Professional profile showcasing your skills</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Access to scheduling and communication tools</span>
                </li>
              </ul>
            </div>

            {!subscription || subscription.status !== 'active' ? (
              <Button 
                onClick={handleSubscribe} 
                className="w-full" 
                size="lg"
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : 'Subscribe for $25/month'}
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">You're listed in the directory!</span>
                </div>
                {subscription.cancel_at_period_end && (
                  <p className="text-sm text-amber-600">
                    Your subscription will end on {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}