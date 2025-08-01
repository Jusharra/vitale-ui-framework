import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, CreditCard, Users, Star, ArrowRight, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import GuestAccountCreation from '@/components/payments/GuestAccountCreation';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshSubscription, subscription } = useAuth();
  const { toast } = useToast();
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  const success = queryParams.get('success') === 'true';
  const canceled = queryParams.get('canceled') === 'true';
  const tier = queryParams.get('tier') || subscription?.tier || 'Premium';
  
  useEffect(() => {
    const fetchSessionDetails = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    };

    fetchSessionDetails();

    // Refresh subscription data when the component mounts for authenticated users
    if (refreshSubscription && user) {
      refreshSubscription().then(() => {
        if (success) {
          toast({
            title: 'Subscription Activated!',
            description: `Welcome to your ${tier} membership. You now have access to all premium features.`,
          });
        }
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
  
  // For authenticated users, show enhanced success page
  const Layout = user ? MemberPageLayout : MainLayout;
  const layoutProps = user ? {
    title: "Welcome to Your Premium Membership!",
    description: "Your subscription has been successfully activated"
  } : {};

  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextBillingDate = subscription?.current_period_end 
    ? formatDate(typeof subscription.current_period_end === 'string' ? subscription.current_period_end : subscription.current_period_end.toString())
    : 'Processing...';

  if (isLoading) {
    return (
      <Layout {...layoutProps}>
        <div className="max-w-4xl mx-auto py-16 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Processing your subscription...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout {...layoutProps}>
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🎉 Welcome to {tier} Membership!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your subscription has been successfully activated. You now have access to all premium features and benefits.
          </p>
        </div>

        {/* Subscription Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Your Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">{tier} Plan</p>
                <p className="text-sm text-muted-foreground">Premium Healthcare</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Next Billing</p>
                <p className="text-sm text-muted-foreground">{nextBillingDate}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Status</p>
                <p className="text-sm text-green-600 font-medium">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => navigate('/dashboard')}
                className="h-auto p-4 flex flex-col items-start space-y-2"
                variant="outline"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <ArrowRight className="h-4 w-4" />
                  Access Your Dashboard
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Explore all your premium features and start managing your healthcare
                </p>
              </Button>
              
              <Button
                onClick={() => navigate('/dashboard/membership')}
                className="h-auto p-4 flex flex-col items-start space-y-2"
                variant="outline"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Settings className="h-4 w-4" />
                  Manage Subscription
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Update payment methods, billing details, and subscription preferences
                </p>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Highlight */}
        <Card>
          <CardHeader>
            <CardTitle>Your Premium Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">24/7 Concierge Support</p>
                  <p className="text-muted-foreground">Personal healthcare concierge available around the clock</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Priority Appointments</p>
                  <p className="text-muted-foreground">Fast-track scheduling with partner providers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Medical Transport</p>
                  <p className="text-muted-foreground">Complimentary transportation to appointments</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Prescription Delivery</p>
                  <p className="text-muted-foreground">Free delivery and medication management</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Health Insights</p>
                  <p className="text-muted-foreground">Personalized health analytics and recommendations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Exclusive Offers</p>
                  <p className="text-muted-foreground">Special discounts on partner services and products</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <h3 className="font-semibold mb-2">Need Help Getting Started?</h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you make the most of your membership.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/concierge')}
            >
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SubscriptionSuccess;