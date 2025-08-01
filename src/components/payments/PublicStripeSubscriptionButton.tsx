import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Minus, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MembershipTier } from '@/types/auth';

interface PublicStripeSubscriptionButtonProps {
  tier: MembershipTier;
  interval?: 'monthly' | 'yearly';
  buttonText?: string;
  className?: string;
  showFamilySelector?: boolean;
}

const PublicStripeSubscriptionButton: React.FC<PublicStripeSubscriptionButtonProps> = ({
  tier,
  interval = 'monthly',
  buttonText = 'Get Started',
  className,
  showFamilySelector = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [additionalMembers, setAdditionalMembers] = useState(0);
  const { toast } = useToast();

  const basePriceMonthly = 1297;
  const familyMemberPrice = 50; // $50 per additional family member
  const yearlyDiscount = 0.20; // 20% discount for yearly billing
  
  const basePrice = interval === 'yearly' ? Math.round(basePriceMonthly * 12 * (1 - yearlyDiscount)) : basePriceMonthly;
  const familyPrice = interval === 'yearly' ? Math.round(familyMemberPrice * 12 * (1 - yearlyDiscount)) : familyMemberPrice;
  const totalPrice = basePrice + (additionalMembers * familyPrice);
  
  const displayInterval = interval === 'yearly' ? '/year' : '/month';

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      // Call Supabase Edge Function for guest checkout
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          tier,
          interval: interval === 'yearly' ? 'year' : 'month',
          trial: true,
          additionalMembers,
          isGuestCheckout: true, // Flag for guest checkout
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open Stripe checkout in the same tab for better UX
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription failed',
        description: error.message || 'An error occurred during subscription process.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {showFamilySelector && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">Family Members</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Additional family members: ${familyMemberPrice.toLocaleString()}{displayInterval} each
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAdditionalMembers(Math.max(0, additionalMembers - 1))}
                disabled={additionalMembers === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[2rem] text-center font-medium">{additionalMembers}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAdditionalMembers(additionalMembers + 1)}
                disabled={additionalMembers >= 5}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {additionalMembers > 0 && (
            <div className="pt-2 border-t text-sm">
              <div className="flex justify-between">
                <span>Primary member:</span>
                <span>${basePrice.toLocaleString()}{displayInterval}</span>
              </div>
              <div className="flex justify-between">
                <span>{additionalMembers} additional member{additionalMembers > 1 ? 's' : ''}:</span>
                <span>${(additionalMembers * familyPrice).toLocaleString()}{displayInterval}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total:</span>
                <span>${totalPrice.toLocaleString()}{displayInterval}</span>
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Maximum 5 additional family members. Each family member gets full access to all premium benefits.
          </p>
        </div>
      )}

      <Button
        className={className}
        onClick={handleSubscribe}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {buttonText}
            {showFamilySelector && additionalMembers > 0 && (
              <span className="ml-2">- ${totalPrice.toLocaleString()}{displayInterval}</span>
            )}
          </>
        )}
      </Button>
    </div>
  );
};

export default PublicStripeSubscriptionButton;