
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface VacationCardProps {
  vacation: {
    id: string;
    destination_name: string;
    region: string;
    description_short: string;
    price: number;
    duration: string | null;
    package_type: string;
    image_url: string | null;
    featured: boolean;
  };
  onViewDetails: () => void;
}

const VacationCard: React.FC<VacationCardProps> = ({ vacation, onViewDetails }) => {
  // Get current user's membership tier to apply appropriate discount
  const { data: userData } = useQuery({
    queryKey: ['currentUserMembership'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { membership_tier: 'smart' };

      const { data, error } = await supabase
        .from('users')
        .select('membership_tier')
        .eq('id', user.id)
        .single();
      
      if (error || !data) return { membership_tier: 'smart' };
      return data;
    },
  });

  // Calculate discounted price based on membership tier
  const calculatePrice = () => {
    const tier = userData?.membership_tier || 'smart';
    const basePrice = vacation.price;
    
    switch(tier) {
      case 'core':
        return basePrice * 0.85; // 15% off for Core members
      case 'vip':
        return basePrice * 0.80; // 20% off for VIP members
      default:
        return basePrice; // No discount for Smart members
    }
  };

  const discountedPrice = calculatePrice();
  const hasDiscount = discountedPrice < vacation.price;

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="relative">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${vacation.image_url || '/placeholder.svg'})` }}
        />
        {vacation.featured && (
          <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>
        )}
      </div>
      <CardContent className="pt-6 flex-grow">
        <h3 className="font-semibold text-lg mb-1">{vacation.destination_name}</h3>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{vacation.region}</span>
          {vacation.duration && (
            <>
              <span className="mx-1">•</span>
              <CalendarDays className="w-3 h-3 mr-1" />
              <span>{vacation.duration}</span>
            </>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{vacation.description_short}</p>
        <div className="mt-4">
          <div className="flex items-center">
            <Tag className="w-4 h-4 text-primary mr-1.5" />
            <span className="text-sm font-medium">{vacation.package_type}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div>
          {hasDiscount && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground line-through">${vacation.price.toLocaleString()}</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {userData?.membership_tier === 'core' ? '15% Off' : '20% Off'}
              </Badge>
            </div>
          )}
          <div className="text-lg font-semibold">${discountedPrice.toLocaleString()}</div>
        </div>
        <Button onClick={onViewDetails}>View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default VacationCard;
