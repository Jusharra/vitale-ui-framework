
// Add the formatCurrency function to the useRegionalPricing hook

import { useState } from 'react';

export interface RegionalPricingHook {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount: number) => string;
  region: string;
  setRegion: (region: string) => void;
}

export const useRegionalPricing = (): RegionalPricingHook => {
  const [currency, setCurrency] = useState<string>('USD');
  const [region, setRegion] = useState<string>('US');
  
  // Format currency based on region and currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(region === 'US' ? 'en-US' : region === 'UK' ? 'en-GB' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return {
    currency,
    setCurrency,
    formatCurrency,
    region,
    setRegion
  };
};
