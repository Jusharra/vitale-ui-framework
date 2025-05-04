
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StripeCheckoutProps {
  tier: 'smart' | 'core' | 'vip';
  buttonText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const tierPrices = {
  smart: {
    monthly: 497,
    yearly: 5964
  },
  core: {
    monthly: 997,
    yearly: 10764
  },
  vip: {
    monthly: 1297,
    yearly: 15564
  }
};

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ 
  tier,
  buttonText = 'Subscribe',
  variant = 'default'
}) => {
  const { user, isTrialing, refreshSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubscription = async (interval: 'monthly' | 'yearly') => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to subscribe',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This will call our edge function to create a Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          tier, 
          interval, 
          price: tierPrices[tier][interval],
          trial: isTrialing // Pass trial status to checkout function
        }
      });
      
      if (error) throw error;
      
      // After successful checkout, refresh subscription data
      window.addEventListener('focus', async () => {
        // Short delay to ensure Stripe has processed everything
        setTimeout(async () => {
          await refreshSubscription();
        }, 5000);
      }, { once: true });
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Checkout failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Button 
        onClick={() => handleSubscription('monthly')} 
        variant={variant} 
        className="flex-1"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `${buttonText} Monthly`
        )}
      </Button>
      <Button 
        onClick={() => handleSubscription('yearly')} 
        variant={variant === 'default' ? 'secondary' : variant}
        className="flex-1"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `${buttonText} Yearly (Save 16%)`
        )}
      </Button>
    </div>
  );
};

export default StripeCheckout;
