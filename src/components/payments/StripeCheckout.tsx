
import React from 'react';
import { Button } from '@/components/ui/button';

interface StripeCheckoutProps {
  amount?: number;
  description?: string;
  buttonText?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  tier?: "smart" | "core" | "vip";
  variant?: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  amount = 0,
  description = 'Payment',
  buttonText = 'Pay Now',
  onSuccess,
  onCancel,
  tier,
  variant = 'default'
}) => {
  const handleClick = () => {
    console.log(`Stripe checkout would open here for tier: ${tier}`);
    // In a real implementation, this would open the Stripe checkout
  };

  return (
    <Button 
      onClick={handleClick} 
      variant={variant as any}
      className="w-full"
    >
      {buttonText} {tier && tier.charAt(0).toUpperCase() + tier.slice(1)}
    </Button>
  );
};

export default StripeCheckout;
