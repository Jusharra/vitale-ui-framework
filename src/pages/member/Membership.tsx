
import React, { useEffect, useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, CircleX, Heart, Calendar, Loader2 } from 'lucide-react';
import MembershipBadge from '@/components/common/MembershipBadge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import StripeCheckout from '@/components/payments/StripeCheckout';

// Membership tiers data
const membershipTiers = [
  {
    id: "smart",
    name: "Smart Access",
    price: "$497",
    interval: "month",
    yearlyPrice: "$5,964",
    description: "Basic healthcare access and digital tools",
    features: [
      "Basic healthcare access",
      "Digital health assessment",
      "Symptom checker tool",
      "Medication tracking",
      "Basic rewards program"
    ],
    notIncluded: [
      "Priority appointment scheduling",
      "Specialist referral coordination",
      "Medical concierge services",
      "24/7 provider access"
    ]
  },
  {
    id: "core",
    name: "Core Concierge",
    price: "$997",
    interval: "month",
    yearlyPrice: "$10,764",
    description: "Enhanced care coordination and priority access",
    features: [
      "Everything in Smart Access",
      "Priority appointment scheduling",
      "Specialist referral coordination",
      "Prescription delivery service",
      "Advanced health monitoring tools",
      "Enhanced rewards program"
    ],
    notIncluded: [
      "24/7 dedicated concierge",
      "Travel medical support",
      "Executive health services"
    ],
    popular: true
  },
  {
    id: "vip",
    name: "VIP Executive",
    price: "$1,297",
    interval: "month",
    yearlyPrice: "$15,564",
    description: "Premium healthcare experience with concierge services",
    features: [
      "Everything in Core Concierge",
      "24/7 dedicated healthcare concierge",
      "Same-day appointments guaranteed",
      "Executive health assessments",
      "Global travel medical support",
      "Premium wellness services",
      "VIP membership perks"
    ],
    notIncluded: []
  }
];

const Membership = () => {
  const { profile, isTrialing, isAuthenticated } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) throw error;
        setSubscriptionData(data);
        
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSubscription();
  }, [isAuthenticated]);

  return (
    <MemberPageLayout 
      title="Membership" 
      description="Manage your membership plan and billing"
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">Your Membership</CardTitle>
                    <CardDescription>Current plan and membership benefits</CardDescription>
                  </div>
                  <MembershipBadge type={profile?.membership_tier as "smart" | "core" | "vip" || "smart"} size="lg" />
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
                        <p className="font-medium">{new Date(subscriptionData.subscription.current_period_end).toLocaleDateString()}</p>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {membershipTiers.map((tier) => {
                const isCurrent = tier.id === profile?.membership_tier;
                return (
                <Card 
                  key={tier.id}
                  className={`relative overflow-hidden ${tier.popular ? 'border-primary shadow-md' : ''} ${isCurrent ? 'border-green-500 shadow-md' : ''}`}
                >
                  {tier.popular && !isCurrent && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      Most Popular
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-medium">
                      Current Plan
                    </div>
                  )}
                  <CardHeader>
                    <MembershipBadge type={tier.id as "smart" | "core" | "vip"} className="mb-2" />
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <div className="mt-4 space-y-1">
                      <div>
                        <span className="text-3xl font-bold">{tier.price}</span>
                        <span className="text-muted-foreground">/{tier.interval}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">or {tier.yearlyPrice}/year (save 16%)</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-medium text-sm">Includes:</p>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex gap-2 items-start">
                          <CircleCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {tier.notIncluded.length > 0 && (
                      <>
                        <Separator />
                        <p className="font-medium text-sm">Not included:</p>
                        <ul className="space-y-2">
                          {tier.notIncluded.map((feature, index) => (
                            <li key={index} className="flex gap-2 items-start">
                              <CircleX className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    ) : (
                      <StripeCheckout 
                        tier={tier.id as "smart" | "core" | "vip"} 
                        buttonText={subscriptionData?.subscription ? "Switch to" : "Upgrade to"} 
                        variant={tier.id === "core" || tier.id === "vip" ? "default" : "outline"}
                      />
                    )}
                  </CardFooter>
                </Card>
              )})}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="billing" className="mt-6">
          <div className="space-y-6">
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
                      <p className="font-medium">Monthly</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Billing Date</p>
                      <p className="font-medium">{new Date(subscriptionData.subscription.current_period_end).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Subscription Status</p>
                      <p className="font-medium capitalize">{subscriptionData.subscription.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Auto-Renewal</p>
                      <p className="font-medium">{subscriptionData.subscription.cancel_at_period_end ? 'Off' : 'On'}</p>
                    </div>
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
            
            {subscriptionData?.subscription && (
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
            )}
          </div>
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default Membership;
