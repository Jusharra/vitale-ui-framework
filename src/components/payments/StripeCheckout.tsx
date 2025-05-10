
import React from 'react';
import { Button } from "@/components/ui/button";
import { MembershipTier } from '@/types/auth';

interface StripeCheckoutProps {
  tier?: MembershipTier;
  amount?: number;
  description?: string;
  buttonText: string;
  variant?: "default" | "outline";
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ 
  tier, 
  amount,
  description,
  buttonText, 
  variant = "default" 
}) => {
  const handleCheckout = () => {
    // This would normally connect to Stripe
    if (tier) {
      console.log(`Subscription checkout initiated for ${tier} tier`);
      // Mock implementation - in real app, this would redirect to Stripe
      window.location.href = `/dashboard/subscription-success?tier=${tier}`;
    } else if (amount) {
      console.log(`One-time payment checkout initiated for $${amount/100}`);
      // Mock implementation for one-time payments
      window.location.href = `/dashboard/purchase-success?amount=${amount}`;
    }
  };

  // Create a single string for the button text
  const displayText = tier 
    ? `${buttonText} ${tier.charAt(0).toUpperCase() + tier.slice(1)}` 
    : buttonText;

  return (
    <Button 
      onClick={handleCheckout} 
      className="w-full" 
      variant={variant}
    >
      <span>{displayText}</span>
    </Button>
  );
};

export default StripeCheckout;
