
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Currency, 
  Region, 
  convertPrice, 
  formatPrice, 
  getUserRegionalSettings 
} from '@/utils/currencyUtils';

interface RegionalPricingHook {
  isLoading: boolean;
  region: Region;
  currency: Currency;
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (price: number) => string;
  fullPrice: (priceInUSD: number) => string;
  updateRegion: (region: Region) => void;
  updateCurrency: (currency: Currency) => void;
}

export const useRegionalPricing = (): RegionalPricingHook => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [region, setRegion] = useState<Region>('North America');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [multiplier, setMultiplier] = useState<number>(1.0);
  
  useEffect(() => {
    const loadRegionalSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await getUserRegionalSettings(user?.id || null);
        setRegion(settings.region);
        setCurrency(settings.currency);
        setMultiplier(settings.multiplier);
      } catch (error) {
        console.error('Error loading regional settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRegionalSettings();
  }, [user?.id]);
  
  const convert = (priceInUSD: number): number => {
    return convertPrice(priceInUSD, currency, multiplier);
  };
  
  const format = (price: number): string => {
    return formatPrice(price, currency);
  };
  
  const fullPrice = (priceInUSD: number): string => {
    return formatPrice(convert(priceInUSD), currency);
  };
  
  const updateRegion = async (newRegion: Region) => {
    // Here we would update the user's preference in the database
    // For now, just update local state
    setRegion(newRegion);
    // In a real implementation, we would save this to user_preferences
  };
  
  const updateCurrency = async (newCurrency: Currency) => {
    // Here we would update the user's preference in the database
    setCurrency(newCurrency);
    // In a real implementation, we would save this to user_preferences
  };
  
  return {
    isLoading,
    region,
    currency,
    convertPrice: convert,
    formatPrice: format,
    fullPrice,
    updateRegion,
    updateCurrency,
  };
};
