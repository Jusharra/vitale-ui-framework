
import React, { useState, useEffect } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { CopyIcon, FacebookIcon, Share2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRewards } from '@/hooks/useRewards';

// Adjust the Reward type to match useRewards.ts
interface Reward {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  value: number | null;
  status: string; // Changed from literal type to string to match useRewards
  expires_at: string | null;
  created_at: string | null;
  terms_conditions: string | null;
  reward_type: string;
  claimed: boolean;
  redeemed: boolean;
  profile_id: string | null;
  renewal_date: string;
}

const ShareAndEarn: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { rewards } = useRewards();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralUrl, setReferralUrl] = useState<string>('');
  const [referralRewards, setReferralRewards] = useState<Reward[]>([]);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('share');

  // Mock data for demonstration
  useEffect(() => {
    // Generate a fake referral code based on user ID
    if (user?.id) {
      const code = `REF-${user.id.substring(0, 6).toUpperCase()}`;
      setReferralCode(code);
      setReferralUrl(`https://vitale.health/join?ref=${code}`);
      
      // Mock points earned
      setPointsEarned(350);
      
      // Filter rewards that are referral-related
      if (rewards && rewards.length) {
        const referralRelated = rewards.filter(
          reward => reward.reward_type.includes('referral')
        );
        setReferralRewards(referralRelated);
      }
    }
  }, [user, rewards]);

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl);
    toast({
      title: "Link copied!",
      description: "The referral link has been copied to your clipboard.",
    });
  };

  const handleShareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareViaWhatsApp = () => {
    const text = `Join me on Vitale Health and get exclusive benefits! Sign up with my referral link: ${referralUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareViaSMS = () => {
    const text = `Join me on Vitale Health and get exclusive benefits! Sign up with my referral link: ${referralUrl}`;
    const url = `sms:?body=${encodeURIComponent(text)}`;
    window.location.href = url;
  };

  return (
    <MemberPageLayout 
      title="Share & Earn" 
      description="Invite friends and family to Vitale Health and earn rewards"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="share">Share Your Link</TabsTrigger>
          <TabsTrigger value="rewards">Your Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="share" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>
                Share this link with friends and family. For each person who signs up and becomes a member, you'll earn points!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={referralUrl} readOnly className="flex-1" />
                <Button variant="outline" onClick={handleCopyReferralLink}>
                  <CopyIcon className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Your referral code: <strong>{referralCode}</strong></p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Share via</h4>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleShareViaFacebook}>
                    <FacebookIcon className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" onClick={handleShareViaWhatsApp}>
                    <Share2Icon className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" onClick={handleShareViaSMS}>
                    <Share2Icon className="h-4 w-4 mr-2" />
                    SMS
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Share your unique link</h3>
                    <p className="text-muted-foreground">Send your personalized referral link to friends and family</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">They sign up</h3>
                    <p className="text-muted-foreground">When they create an account using your link, they get a special discount</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">You earn rewards</h3>
                    <p className="text-muted-foreground">Get 500 points for each friend who subscribes to a membership plan</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rewards" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Rewards</CardTitle>
              <CardDescription>
                Track your progress and see the rewards you've earned from referrals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div>
                  <h4 className="font-medium">Total points earned from referrals</h4>
                  <p className="text-sm text-muted-foreground">Keep referring to earn more</p>
                </div>
                <div className="text-3xl font-bold">{pointsEarned}</div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Available Rewards</h4>
                
                {referralRewards.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {referralRewards.map(reward => (
                      <Card key={reward.id}>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">{reward.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm">{reward.description}</p>
                          {reward.value && (
                            <p className="font-semibold mt-2">{reward.value} points</p>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button size="sm" disabled={reward.claimed}>
                            {reward.claimed ? "Claimed" : "Claim Reward"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No referral rewards available at the moment.</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
              <CardDescription>
                People who have signed up using your referral link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-3 p-4 font-medium">
                  <div>Name</div>
                  <div>Date</div>
                  <div>Status</div>
                </div>
                <div className="grid grid-cols-3 p-4 border-t">
                  <div>Jane Smith</div>
                  <div>Apr 12, 2025</div>
                  <div><span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Subscribed</span></div>
                </div>
                <div className="grid grid-cols-3 p-4 border-t">
                  <div>Mike Johnson</div>
                  <div>Apr 02, 2025</div>
                  <div><span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">Registered</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default ShareAndEarn;
