
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRegionalPricing } from '@/hooks/useRegionalPricing';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

interface VacationCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  destination: string;
  packageType: string;
  onViewDetailsClick: (id: string) => void;
  featured?: boolean;
}

const VacationCard: React.FC<VacationCardProps> = ({
  id,
  imageUrl,
  title,
  description,
  price,
  duration,
  destination,
  packageType,
  onViewDetailsClick,
  featured = false,
}) => {
  const { formatCurrency } = useRegionalPricing();
  const { userRole, membershipTier } = useAuth();

  // Determine discount based on membership tier and role
  const getDiscountedPrice = () => {
    // Check if user is authenticated and has a role
    if (userRole === 'admin') {
      return price * 0.7; // 30% discount for admins
    }
    
    // Apply membership tier discounts
    if (membershipTier === 'vip') {
      return price * 0.8; // 20% discount for VIP members
    } else if (membershipTier === 'core') {
      return price * 0.9; // 10% discount for Core members
    }
    
    return price; // No discount for basic tier or non-authenticated users
  };

  const discountedPrice = getDiscountedPrice();
  const hasDiscount = discountedPrice < price;

  return (
    <Card className={`overflow-hidden h-full flex flex-col ${featured ? 'border-primary' : ''}`}>
      <div className="relative">
        <img 
          src={imageUrl || '/placeholder.svg'} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        {featured && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription className="flex justify-between items-center">
          <span>{destination}</span>
          <span className="text-sm">{duration}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
          {description}
        </p>
        <div className="bg-muted/50 px-2 py-1 rounded inline-block text-xs">
          {packageType}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-2">
        <div>
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-xl font-semibold">{formatCurrency(discountedPrice)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatCurrency(price)}</span>
            </div>
          ) : (
            <span className="text-xl font-semibold">{formatCurrency(price)}</span>
          )}
        </div>
        <Button onClick={() => onViewDetailsClick(id)}>View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default VacationCard;
