
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Region, Currency, defaultRegionalPricing, currencySymbols } from '@/utils/currencyUtils';
import { useRegionalPricing } from '@/hooks/useRegionalPricing';

interface RegionalSettingsProps {
  compact?: boolean;
  className?: string;
}

const RegionalSettings: React.FC<RegionalSettingsProps> = ({ compact = false, className = '' }) => {
  const { region, currency, updateRegion, updateCurrency } = useRegionalPricing();
  
  // Get unique regions and currencies
  const regions = Array.from(new Set(defaultRegionalPricing.map(p => p.region)));
  const currencies = Object.keys(currencySymbols) as Currency[];
  
  const handleRegionChange = (value: string) => {
    updateRegion(value as Region);
  };
  
  const handleCurrencyChange = (value: string) => {
    updateCurrency(value as Currency);
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Select value={region} onValueChange={handleRegionChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map(r => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map(c => (
              <SelectItem key={c} value={c}>{c} ({currencySymbols[c]})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Regional Settings</CardTitle>
        <CardDescription>
          Customize your region and currency preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Region</label>
          <Select value={region} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Currency</label>
          <Select value={currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(c => (
                <SelectItem key={c} value={c}>{c} ({currencySymbols[c]})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalSettings;
