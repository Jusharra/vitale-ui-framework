
import React, { useEffect, useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const { userRole } = useAuth();

  useEffect(() => {
    const verifySubscription = async () => {
      if (!sessionId) {
        setIsVerifying(false);
        return;
      }
      
      try {
        // Check subscription status
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          throw error;
        }
        
        setSubscriptionDetails(data);
        
        toast({
          title: "Subscription activated",
          description: `Your ${data.membership_tier} membership is now active`,
        });
        
      } catch (error: any) {
        console.error('Error verifying subscription:', error);
        toast({
          title: "Verification error",
          description: "There was a problem verifying your subscription. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifySubscription();
  }, [sessionId, toast]);

  const redirectToDashboard = () => {
    if (userRole === 'member') {
      navigate('/dashboard');
    } else if (userRole === 'professional') {
      navigate('/dashboard/professional');
    } else if (userRole === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <MemberPageLayout 
      title="Subscription Successful" 
      description="Thank you for joining Vitale Health Concierge"
    >
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Subscription Confirmed!</CardTitle>
            <CardDescription>
              Your premium membership has been successfully activated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isVerifying ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>Verifying your subscription...</span>
              </div>
            ) : (
              <>
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium mb-2">Subscription Details</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Membership Tier</p>
                      <p className="font-medium capitalize">{subscriptionDetails?.membership_tier || "Smart Access"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{subscriptionDetails?.subscription?.status || "Active"}</p>
                    </div>
                    {subscriptionDetails?.subscription?.current_period_end && (
                      <div>
                        <p className="text-sm text-muted-foreground">Next Billing Date</p>
                        <p className="font-medium">
                          {new Date(subscriptionDetails.subscription.current_period_end).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Next Steps</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 bg-primary/10 text-primary flex items-center justify-center rounded-full">
                        1
                      </div>
                      <span>Explore your personalized dashboard and available health tools</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 bg-primary/10 text-primary flex items-center justify-center rounded-full">
                        2
                      </div>
                      <span>Complete your health profile to get personalized recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 bg-primary/10 text-primary flex items-center justify-center rounded-full">
                        3
                      </div>
                      <span>Book your first appointment with a healthcare professional</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button onClick={redirectToDashboard} size="lg">
                    Go to Dashboard
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MemberPageLayout>
  );
};

export default SubscriptionSuccess;
