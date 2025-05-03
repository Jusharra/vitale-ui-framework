
import React, { useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheck, Heart, MessageSquare, Pill, Share, CirclePlus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Mock data
const rewardsData = {
  points: 750,
  nextReward: 1000,
  referrals: 2,
  pendingReferrals: 1,
  history: [
    { id: 1, date: "May 1, 2025", action: "Annual checkup completed", points: 250 },
    { id: 2, date: "April 15, 2025", action: "Referral: Jane Smith", points: 300 },
    { id: 3, date: "April 5, 2025", action: "Health assessment completed", points: 100 },
    { id: 4, date: "March 20, 2025", action: "Prescription refill on time", points: 50 },
    { id: 5, date: "March 1, 2025", action: "Referral: Bob Johnson", points: 300 },
  ]
};

const availableRewards = [
  { id: 1, name: "Health Store $10 Gift Card", points: 500, claimed: true },
  { id: 2, name: "Premium Health Assessment", points: 800, claimed: false },
  { id: 3, name: "Free Telemedicine Consultation", points: 1000, claimed: false },
  { id: 4, name: "Wellness Subscription - 1 Month", points: 1500, claimed: false },
];

const Rewards = () => {
  const [referralLink, setReferralLink] = useState("https://vitale.health/refer/johndoe");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercentage = (rewardsData.points / rewardsData.nextReward) * 100;

  return (
    <MemberPageLayout 
      title="Share & Rewards" 
      description="Refer friends, earn points, and redeem rewards"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Points & Referrals */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Rewards</CardTitle>
              <CardDescription>Points earned from health activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{rewardsData.points}</div>
                <p className="text-muted-foreground mb-4">Current Points</p>
                
                <div className="mb-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{rewardsData.points} points</span>
                    <span>{rewardsData.nextReward} points</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {rewardsData.nextReward - rewardsData.points} more points until your next reward
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Activity History</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>Share Vitale with friends and family</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CircleCheck className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Your referral benefits:</p>
                </div>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground ml-6">
                  <li>300 points per successful referral</li>
                  <li>$25 account credit after 3 referrals</li>
                  <li>One month free Core membership after 5 referrals</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Your personal referral link:</p>
                <div className="flex">
                  <input 
                    type="text" 
                    value={referralLink} 
                    readOnly 
                    className="flex-1 rounded-l-md border border-r-0 bg-background px-3 py-2 text-sm"
                  />
                  <Button 
                    className="rounded-l-none" 
                    onClick={copyToClipboard}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full">
                <Share className="mr-2 h-4 w-4" />
                Share via Email
              </Button>
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Text
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Column 2: Available Rewards & Activity */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Rewards</CardTitle>
              <CardDescription>Redeem your points for these rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableRewards.map((reward) => (
                  <div 
                    key={reward.id}
                    className="border rounded-lg p-4 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {reward.claimed ? (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <CircleCheck className="h-5 w-5" />
                          </div>
                        ) : reward.name.includes("Health") ? (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Heart className="h-5 w-5" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Pill className="h-5 w-5" />
                          </div>
                        )}
                        <h3 className="font-medium">{reward.name}</h3>
                      </div>
                      {reward.claimed && (
                        <Badge variant="outline" className="ml-2">Claimed</Badge>
                      )}
                    </div>
                    <div className="mt-auto pt-2 flex justify-between items-center">
                      <span className="text-sm font-medium">{reward.points} points</span>
                      <Button 
                        variant={reward.claimed ? "outline" : (rewardsData.points >= reward.points ? "default" : "outline")}
                        disabled={reward.claimed || rewardsData.points < reward.points}
                        size="sm"
                      >
                        {reward.claimed ? "Claimed" : (rewardsData.points >= reward.points ? "Redeem" : "Not Enough Points")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <CirclePlus className="mr-2 h-4 w-4" />
                View More Rewards
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Your rewards activity and points earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewardsData.history.map((item) => (
                  <div key={item.id} className="flex justify-between pb-4 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">+{item.points}</p>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Complete History</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MemberPageLayout>
  );
};

export default Rewards;
