import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshSubscription } = useAuth();
  const { toast } = useToast();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get('success') === 'true';
  const canceled = queryParams.get('canceled') === 'true';
  const tier = queryParams.get('tier') || 'membership';
  
  useEffect(() => {
    // Refresh subscription data when the component mounts
    if (success && refreshSubscription) {
      refreshSubscription();
      
      toast({
        title: 'Subscription successful',
        description: `Your ${tier} subscription has been activated.`,
      });
    }
  }, [success, refreshSubscription, tier, toast]);
  
  if (canceled) {
    return (
      <MemberPageLayout
        title="Subscription Canceled"
        description="Your subscription process was canceled"
      >
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="mb-4">
              You've canceled the subscription process. No charges have been made.
            </p>
            <Button onClick={() => navigate('/dashboard/membership')}>
              Return to Membership
            </Button>
          </CardContent>
        </Card>
      </MemberPageLayout>
    );
  }
  
  return (
    <MemberPageLayout
      title="Subscription Successful"
      description="Your subscription has been activated"
    >
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Subscription Activated</h3>
          <p className="text-gray-600 mb-6">
            Thank you for subscribing to our {tier} plan. Your subscription is now active and you can enjoy all the benefits.
          </p>
          <Button onClick={() => navigate('/dashboard/membership')}>
            View Membership Details
          </Button>
        </CardContent>
      </Card>
    </MemberPageLayout>
  );
};

export default SubscriptionSuccess;