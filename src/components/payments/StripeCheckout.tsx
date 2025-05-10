
import React from 'react';
import { Button } from "@/components/ui/button";
import { MembershipTier } from '@/types/auth';

interface StripeCheckoutProps {
  tier: MembershipTier;
  buttonText: string;
  variant?: "default" | "outline";
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ 
  tier, 
  buttonText, 
  variant = "default" 
}) => {
  const handleCheckout = () => {
    // This would normally connect to Stripe
    console.log(`Checkout initiated for ${tier} tier`);
    // Mock implementation - in real app, this would redirect to Stripe
    window.location.href = `/dashboard/subscription-success?tier=${tier}`;
  };

  return (
    <Button 
      onClick={handleCheckout} 
      className="w-full" 
      variant={variant}
    >
      {buttonText} {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </Button>
  );
};

export default StripeCheckout;
