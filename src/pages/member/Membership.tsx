
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, CircleX, Heart, Calendar } from 'lucide-react';
import MembershipBadge from '@/components/common/MembershipBadge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const membershipData = {
  currentPlan: "smart",
  renewalDate: "June 15, 2025",
  billingCycle: "Monthly",
  amount: "$29.99",
  nextPayment: "May 15, 2025",
  paymentMethod: "Visa ending in 4242",
  transactions: [
    { id: 1, date: "April 15, 2025", description: "Monthly subscription", amount: "$29.99", status: "completed" },
    { id: 2, date: "March 15, 2025", description: "Monthly subscription", amount: "$29.99", status: "completed" },
    { id: 3, date: "February 15, 2025", description: "Monthly subscription", amount: "$29.99", status: "completed" }
  ]
};

const membershipTiers = [
  {
    id: "smart",
    name: "Smart Access",
    price: "$29.99",
    interval: "month",
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
    ],
    isCurrent: true
  },
  {
    id: "core",
    name: "Core Concierge",
    price: "$89.99",
    interval: "month",
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
    price: "$249.99",
    interval: "month",
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
                  <MembershipBadge type={membershipData.currentPlan as "smart" | "core" | "vip"} size="lg" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Plan</p>
                    <p className="font-medium">{membershipTiers.find(t => t.id === membershipData.currentPlan)?.name || 'Smart Access'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Renewal Date</p>
                    <p className="font-medium">{membershipData.renewalDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Billing Cycle</p>
                    <p className="font-medium">{membershipData.billingCycle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Fee</p>
                    <p className="font-medium">{membershipData.amount}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row gap-2">
                <Button variant="outline">Manage Plan</Button>
                <Button>Upgrade Membership</Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {membershipTiers.map((tier) => (
                <Card 
                  key={tier.id}
                  className={`relative overflow-hidden ${tier.popular ? 'border-primary shadow-md' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      Most Popular
                    </div>
                  )}
                  {tier.isCurrent && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-medium">
                      Current Plan
                    </div>
                  )}
                  <CardHeader>
                    <MembershipBadge type={tier.id as "smart" | "core" | "vip"} className="mb-2" />
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">/{tier.interval}</span>
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
                    {tier.isCurrent ? (
                      <Button variant="outline" className="w-full">Current Plan</Button>
                    ) : (
                      <Button className={tier.id === "core" ? "w-full" : "w-full"} variant={tier.id === "core" ? "default" : "outline"}>
                        {tier.id === "vip" ? "Upgrade to VIP" : "Upgrade to Core"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{membershipData.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Payment</p>
                    <p className="font-medium">{membershipData.nextPayment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Billing Cycle</p>
                    <p className="font-medium">{membershipData.billingCycle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">{membershipData.amount}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline">Update Payment Method</Button>
                <Button variant="outline">Change Billing Cycle</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>Your recent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {membershipData.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between pb-4 border-b last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{transaction.amount}</p>
                        <Badge variant={transaction.status === "completed" ? "outline" : "destructive"} className="ml-auto">
                          {transaction.status === "completed" ? "Completed" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Download Invoice History</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default Membership;
