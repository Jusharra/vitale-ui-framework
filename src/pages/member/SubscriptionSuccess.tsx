import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import GuestAccountCreation from '@/components/payments/GuestAccountCreation';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshSubscription } = useAuth();
  const { toast } = useToast();
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  const success = queryParams.get('success') === 'true';
  const canceled = queryParams.get('canceled') === 'true';
  const tier = queryParams.get('tier') || 'membership';
  
  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (sessionId) {
        try {
          // Check if this was a guest checkout by looking at session metadata
          const { data, error } = await supabase.functions.invoke('verify-checkout-session', {
            body: { sessionId }
          });
          
          if (!error && data) {
            setSessionDetails(data);
            setIsGuestCheckout(data.is_guest_checkout === 'true' && !user);
          }
        } catch (error) {
          console.error('Error fetching session details:', error);
        }
      }
    };

    fetchSessionDetails();

    // Refresh subscription data when the component mounts for authenticated users
    if (success && refreshSubscription && user) {
      refreshSubscription();
      
      toast({
        title: 'Subscription successful',
        description: `Your ${tier} subscription has been activated.`,
      });
    }
  }, [sessionId, success, refreshSubscription, tier, toast, user]);
  
  if (canceled) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-16 px-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="mb-4">
                You've canceled the subscription process. No charges have been made.
              </p>
              <Button onClick={() => navigate('/membership')}>
                Return to Membership
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Show guest account creation if this was a guest checkout
  if (isGuestCheckout && sessionDetails) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-16 px-4">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-lg text-gray-600">
              Your subscription has been activated. Complete your account setup below.
            </p>
          </div>
          <GuestAccountCreation
            sessionId={sessionId!}
            customerEmail={sessionDetails.customer_email}
            onAccountCreated={() => {
              navigate('/dashboard');
            }}
          />
        </div>
      </MainLayout>
    );
  }
  
  // For authenticated users, show success page
  const Layout = user ? MemberPageLayout : MainLayout;
  const layoutProps = user ? {
    title: "Subscription Successful",
    description: "Your subscription has been activated"
  } : {};

  return (
    <Layout {...layoutProps}>
      <div className="max-w-2xl mx-auto py-16 px-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Subscription Activated</h3>
            <p className="text-gray-600 mb-6">
              Thank you for subscribing to our {tier} plan. Your subscription is now active and you can enjoy all the benefits.
            </p>
            <Button onClick={() => navigate(user ? '/dashboard' : '/auth')}>
              {user ? 'Go to Dashboard' : 'Login to Access Benefits'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SubscriptionSuccess;