
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, CircleX } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import MembershipBadge from '@/components/common/MembershipBadge';
import StripeCheckout from '@/components/payments/StripeCheckout';
import { MembershipTier } from '@/types/auth';

export interface MembershipTierData {
  id: MembershipTier;
  name: string;
  price: string;
  interval: string;
  yearlyPrice: string;
  description: string;
  features: string[];
  notIncluded: string[];
  popular?: boolean;
}

interface MembershipTierCardProps {
  tier: MembershipTierData;
  isCurrent: boolean;
  hasSubscription: boolean;
}

const MembershipTierCard: React.FC<MembershipTierCardProps> = ({ 
  tier, 
  isCurrent,
  hasSubscription
}) => {
  return (
    <Card 
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
        <MembershipBadge type={tier.id} className="mb-2" />
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
          <Button variant="outline" className="w-full" disabled>
            Current Plan
          </Button>
        ) : (
          <StripeCheckout 
            tier={tier.id}
            buttonText={hasSubscription ? "Switch to" : "Upgrade to"}
            variant={tier.id === "core" || tier.id === "vip" ? "default" : "outline"}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default MembershipTierCard;
