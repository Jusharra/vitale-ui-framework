import React, { ReactNode, useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeProviderProps {
  children: ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      const stripe = await stripePromise;
      setStripeInstance(stripe);
    };
    
    initializeStripe();
  }, []);

  if (!stripeInstance) {
    return <div>Loading payment system...</div>;
  }

  return (
    <Elements stripe={stripeInstance}>
      {children}
    </Elements>
  );
};

export default StripeProvider;