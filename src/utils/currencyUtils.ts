
import { supabase } from '@/integrations/supabase/client';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'KES' | 'NGN' | 'ZAR' | 'JPY';
export type Region = 'North America' | 'Europe' | 'Africa' | 'Asia' | 'Latin America' | 'Middle East';

export interface RegionalPricing {
  region: Region;
  currency: Currency;
  baseMultiplier: number; // Multiplier applied to base USD price
}

export const defaultRegionalPricing: RegionalPricing[] = [
  { region: 'North America', currency: 'USD', baseMultiplier: 1.0 },
  { region: 'Europe', currency: 'EUR', baseMultiplier: 0.92 },
  { region: 'Africa', currency: 'KES', baseMultiplier: 0.75 }, // Example adjustment for Kenya
  { region: 'Asia', currency: 'JPY', baseMultiplier: 0.85 },
  { region: 'Latin America', currency: 'USD', baseMultiplier: 0.8 },
  { region: 'Middle East', currency: 'USD', baseMultiplier: 0.95 },
];

export const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  KES: 'KSh',
  NGN: '₦',
  ZAR: 'R',
  JPY: '¥',
};

// Mock exchange rates - in production this would come from an API
const mockExchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  KES: 129.5,
  NGN: 1450,
  ZAR: 18.5,
  JPY: 150.2,
};

export const convertPrice = (
  priceInUSD: number,
  targetCurrency: Currency = 'USD',
  regionMultiplier = 1.0
): number => {
  const exchangeRate = mockExchangeRates[targetCurrency] || 1;
  const adjustedPrice = priceInUSD * regionMultiplier * exchangeRate;
  
  // Round to 2 decimal places for most currencies, 0 for JPY
  return targetCurrency === 'JPY' 
    ? Math.round(adjustedPrice) 
    : Math.round(adjustedPrice * 100) / 100;
};

export const formatPrice = (
  price: number,
  currency: Currency = 'USD',
  includeSymbol = true
): string => {
  const symbol = currencySymbols[currency] || '$';
  
  // Format number based on currency conventions
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(price);
  
  return includeSymbol ? `${symbol}${formattedNumber}` : formattedNumber;
};

// Function to get regional settings for a user
export const getUserRegionalSettings = async (userId: string | null): Promise<{
  region: Region;
  currency: Currency;
  multiplier: number;
}> => {
  if (!userId) {
    return {
      region: 'North America',
      currency: 'USD',
      multiplier: 1.0,
    };
  }
  
  try {
    // In a real implementation, this would fetch from a user_preferences table
    const { data, error } = await supabase
      .from('user_preferences')
      .select('region, currency')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      return {
        region: 'North America',
        currency: 'USD',
        multiplier: 1.0,
      };
    }
    
    // Find the appropriate pricing details based on region
    const pricingDetails = defaultRegionalPricing.find(
      pricing => pricing.region === data.region
    ) || defaultRegionalPricing[0];
    
    return {
      region: data.region as Region,
      currency: data.currency as Currency || pricingDetails.currency,
      multiplier: pricingDetails.baseMultiplier,
    };
  } catch (error) {
    console.error('Error fetching user regional settings:', error);
    return {
      region: 'North America',
      currency: 'USD',
      multiplier: 1.0,
    };
  }
};
