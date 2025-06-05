import React from 'react';
import { Button } from "@/components/ui/button";
import { MembershipTier } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface StripeCheckoutProps {
  tier?: MembershipTier;
  amount?: number;
  description?: string;
  buttonText: string;
  variant?: "default" | "outline";
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ 
  tier, 
  amount,
  description,
  buttonText, 
  variant = "default",
  className,
  size = "default"
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Call the Supabase Edge Function to create a Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          tier,
          amount,
          description,
          trial: true // Enable trial for new subscriptions
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
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout failed',
        description: error.message || 'An error occurred during the checkout process.',
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
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
};

export default StripeCheckout;