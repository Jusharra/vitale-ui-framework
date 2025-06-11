
import { supabase } from '@/integrations/supabase/client';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'KES' | 'NGN' | 'ZAR' | 'JPY';
export type Region = 'North America' | 'Europe' | 'Africa' | 'Asia' | 'Latin America' | 'Middle East';

interface RegionalPricing {
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

const convertPrice = (
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

const formatPrice = (
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
const getUserRegionalSettings = async (userId: string | null): Promise<{
  region: Region;
  currency: Currency;
  multiplier: number;
}> => {
  // Default values if user is not logged in or no custom settings
  const defaultSettings = {
    region: 'North America' as Region,
    currency: 'USD' as Currency,
    multiplier: 1.0,
  };
  
  if (!userId) {
    return defaultSettings;
  }
  
  try {
    // Since the user_preferences table doesn't have region and currency columns yet,
    // we'll return default values instead of trying to query them
    
    // Find the appropriate pricing details based on region
    const pricingDetails = defaultRegionalPricing.find(
      pricing => pricing.region === defaultSettings.region
    ) || defaultRegionalPricing[0];
    
    return {
      region: defaultSettings.region,
      currency: defaultSettings.currency,
      multiplier: pricingDetails.baseMultiplier,
    };
  } catch (error) {
    console.error('Error fetching user regional settings:', error);
    return defaultSettings;
  }
};
