import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Plus, Minus, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import MembershipBadge from '@/components/common/MembershipBadge';
import { MembershipTier } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MembershipTierData } from './MembershipTierCard';

interface FamilyMembershipCardProps {
  tier: MembershipTierData;
  isCurrent: boolean;
  hasSubscription: boolean;
}

const FamilyMembershipCard: React.FC<FamilyMembershipCardProps> = ({ 
  tier, 
  isCurrent,
  hasSubscription
}) => {
  const [additionalMembers, setAdditionalMembers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const basePriceMonthly = parseInt(tier.price.replace(/[^0-9]/g, ''));
  const familyMemberPrice = tier.familyMemberPrice ? parseInt(tier.familyMemberPrice.replace(/[^0-9]/g, '')) : 50;
  const totalMonthlyPrice = basePriceMonthly + (additionalMembers * familyMemberPrice);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          tier: tier.id,
          interval: 'month',
          trial: true,
          additionalMembers
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription failed',
        description: 'Failed to create subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      className={`relative overflow-hidden h-full flex flex-col ${tier.popular ? 'border-primary shadow-md' : ''} ${isCurrent ? 'border-green-500 shadow-md' : ''}`}
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
      
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <MembershipBadge type={tier.id} />
          <Badge variant="secondary" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            Family Plan
          </Badge>
        </div>
        <CardTitle>{tier.name} - Family</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
        
        <div className="mt-4 space-y-3">
          <div>
            <span className="text-3xl font-bold">${totalMonthlyPrice.toLocaleString()}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Primary member: {tier.price}/month</div>
            {additionalMembers > 0 && (
              <div>
                {additionalMembers} additional member{additionalMembers > 1 ? 's' : ''}: 
                ${(additionalMembers * familyMemberPrice).toLocaleString()}/month
              </div>
            )}
          </div>
          
          <div className="border rounded-lg p-3 bg-muted/50">
            <label className="text-sm font-medium mb-2 block">Additional Family Members</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdditionalMembers(Math.max(0, additionalMembers - 1))}
                disabled={additionalMembers === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[2rem] text-center font-medium">{additionalMembers}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdditionalMembers(additionalMembers + 1)}
                disabled={additionalMembers >= 5}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${familyMemberPrice}/month per additional member (max 5)
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-grow">
        <p className="font-medium text-sm">Family benefits include:</p>
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex gap-2 items-start">
              <CircleCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        {additionalMembers > 0 && (
          <>
            <Separator />
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Family Group Benefits
              </p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 mt-1 space-y-1">
                <li>• Shared family dashboard</li>
                <li>• Coordinated care plans</li>
                <li>• Family health insights</li>
                <li>• Group appointment scheduling</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter>
        {isCurrent ? (
          <Button variant="outline" className="w-full" disabled>
            <span>Current Plan</span>
          </Button>
        ) : (
          <Button 
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Processing...' : `Subscribe - $${totalMonthlyPrice.toLocaleString()}/month`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FamilyMembershipCard;