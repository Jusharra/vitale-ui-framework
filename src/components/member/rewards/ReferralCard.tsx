import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheck, Share, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface ReferralCardProps {
  referralCode: string;
  successfulReferrals?: number;
  referralCount?: number; // Added for backward compatibility
  isLoading?: boolean;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ 
  referralCode,
  successfulReferrals = 0,
  referralCount, // Backward compatibility
  isLoading = false
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const referralLink = `https://vitale.health/refer/${referralCode}`;
  
  // Use either successfulReferrals or referralCount, whichever is provided
  const referrals = referralCount !== undefined ? referralCount : successfulReferrals;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    toast({
      title: "Link copied!",
      description: "Your referral link has been copied to clipboard"
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = "Join me on Vitale Health Concierge";
    const body = `I thought you might be interested in Vitale Health Concierge. Sign up using my referral link: ${referralLink}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareViaSms = () => {
    // Only works on mobile devices with SMS capability
    const message = `Join me on Vitale Health Concierge: ${referralLink}`;
    window.location.href = `sms:?&body=${encodeURIComponent(message)}`;
  };

  const shareViaOther = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Vitale Health Concierge',
          text: 'Check out this health concierge service I\'m using',
          url: referralLink,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      copyToClipboard();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
          <CardDescription>Share Vitale with friends and family</CardDescription>
        </CardHeader>
        <CardContent className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
          <div className="flex">
            <div className="h-10 flex-1 bg-gray-200 rounded-l"></div>
            <div className="h-10 w-20 bg-gray-200 rounded-r"></div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="h-10 w-full bg-gray-200 rounded"></div>
          <div className="flex gap-2 w-full">
            <div className="h-10 flex-1 bg-gray-200 rounded"></div>
            <div className="h-10 flex-1 bg-gray-200 rounded"></div>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
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
        
        <p className="text-sm font-medium mb-2">Your progress: {referrals}/5 referrals</p>
        <Progress value={(referrals / 5) * 100} className="h-2 mb-4" />
        
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
        <Button className="w-full" onClick={shareViaEmail}>
          <Share className="mr-2 h-4 w-4" />
          Share via Email
        </Button>
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1" onClick={shareViaSms}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Text
          </Button>
          <Button variant="outline" className="flex-1" onClick={shareViaOther}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReferralCard;
