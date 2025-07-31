
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRegionalPricing } from '@/hooks/useRegionalPricing';
import { useAuth } from '@/context/AuthContext';
import StripeCheckout from '@/components/payments/StripeCheckout';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, MapPinIcon, TagIcon, TimerIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { MembershipTier } from '@/types/auth';

interface VacationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacation: {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    destination: string;
    amenities: string[];
    region: string;
    package_type: string;
    image_url: string;
  } | null;
}

const VacationDetailsModal: React.FC<VacationDetailsModalProps> = ({
  isOpen,
  onClose,
  vacation,
}) => {
  const { formatCurrency } = useRegionalPricing();
  const { userRole, membershipTier } = useAuth();
  const { toast } = useToast();

  if (!vacation) {
    return null;
  }

  // Determine discount based on membership tier
  const getDiscountedPrice = () => {
    // Check if user is authenticated and has a role
    if (userRole === 'admin') {
      return vacation.price * 0.7; // 30% discount for admins
    }
    
    // Apply membership tier discounts
    if (membershipTier === 'premium') {
      return vacation.price * 0.8; // 20% discount for Premium members
    }
    
    return vacation.price; // No discount for basic tier or non-authenticated users
  };

  const discountedPrice = getDiscountedPrice();
  const hasDiscount = discountedPrice < vacation.price;
  
  // Calculate savings if there's a discount
  const savings = vacation.price - discountedPrice;
  
  const handleBookNowClick = () => {
    // In a real app, this would initiate the booking process
    toast({
      title: "Booking Initiated",
      description: `Your booking for ${vacation.title} is being processed.`,
    });
  };

  // Default to 'smart' tier if no membership tier is available
  const userTier = membershipTier || 'smart' as MembershipTier;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center mb-2">
            <DialogTitle className="text-2xl">{vacation.title}</DialogTitle>
            <Badge>{vacation.package_type}</Badge>
          </div>
          <DialogDescription className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{vacation.destination}</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center">
              <TimerIcon className="h-4 w-4 mr-1" />
              <span>{vacation.duration}</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center">
              <TagIcon className="h-4 w-4 mr-1" />
              <span>{vacation.region}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
          <img
            src={vacation.image_url || "/placeholder.svg"}
            alt={vacation.title}
            className="w-full h-64 object-cover rounded-md"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{vacation.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {vacation.amenities && vacation.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 space-y-4">
            <div className="text-center pb-2 border-b">
              <h3 className="font-semibold">Price Details</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Base Price:</span>
                <span>{formatCurrency(vacation.price)}</span>
              </div>
              
              {hasDiscount && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Member Discount:</span>
                  <span>-{formatCurrency(savings)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center font-bold">
                <span>Total Price:</span>
                <span>{formatCurrency(discountedPrice)}</span>
              </div>
              
              {hasDiscount && (
                <div className="text-center text-sm text-green-600 mt-2">
                  You save {formatCurrency(savings)} with your {membershipTier?.toUpperCase()} membership!
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleBookNowClick} 
              className="w-full"
            >
              Book Now
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Secure payment processed by Stripe
            </p>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VacationDetailsModal;
