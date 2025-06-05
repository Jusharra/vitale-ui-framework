import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { MembershipTier } from '@/types/auth';

interface StripeSubscriptionButtonProps {
  tier: MembershipTier;
  interval?: 'monthly' | 'yearly';
  buttonText?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onSuccess?: () => void;
}

const StripeSubscriptionButton: React.FC<StripeSubscriptionButtonProps> = ({
  tier,
  interval = 'monthly',
  buttonText = 'Subscribe',
  variant = 'default',
  size = 'default',
  className,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to continue with subscription.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call Supabase Edge Function to create a Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          tier,
          interval: interval === 'yearly' ? 'year' : 'month',
          trial: true, // Enable trial for new subscriptions
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
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
    <Button
      variant={variant}
      size={size}
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
        `${buttonText} ${tier.charAt(0).toUpperCase() + tier.slice(1)}`
      )}
    </Button>
  );
};

export default StripeSubscriptionButton;