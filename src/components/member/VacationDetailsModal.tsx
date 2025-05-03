
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Tag, 
  MessageCircle,
  CreditCard,
  Gift
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface VacationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacation: {
    id: string;
    destination_name: string;
    region: string;
    description_short: string;
    description_full: string | null;
    price: number;
    duration: string | null;
    package_type: string;
    image_url: string | null;
    amenities: string[];
    available_dates: {
      start_date: string | null;
      end_date: string | null;
    };
  };
}

const queryClient = new QueryClient();

const VacationDetailsModal: React.FC<VacationDetailsModalProps> = ({
  isOpen,
  onClose,
  vacation
}) => {
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // For demo purposes, we'll pretend we have multiple images
  // In a real app, you'd have a relation table with multiple images
  const mockImages = [
    vacation.image_url || '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];

  // Get user and reward points data
  const { data: userData } = useQuery({
    queryKey: ['userForVacation'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { id: null, membership_tier: 'smart' };

      const { data, error } = await supabase
        .from('users')
        .select('id, membership_tier')
        .eq('id', user.id)
        .single();
      
      if (error || !data) return { id: null, membership_tier: 'smart' };
      return data;
    }
  });

  const { data: pointsData } = useQuery({
    queryKey: ['userPoints', userData?.id],
    enabled: !!userData?.id,
    queryFn: async () => {
      if (!userData?.id) return { current_balance: 0 };

      const { data, error } = await supabase
        .from('reward_points')
        .select('current_balance')
        .eq('profile_id', userData.id)
        .single();
      
      if (error || !data) return { current_balance: 0 };
      return data;
    }
  });

  // Calculate points needed (rough estimate - 100 points per $100)
  const pointsNeeded = Math.round(vacation.price * 0.8);
  const hasEnoughPoints = (pointsData?.current_balance || 0) >= pointsNeeded;

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

  // Handle redemption with points
  const redeemMutation = useMutation({
    mutationFn: async () => {
      if (!userData?.id || !hasEnoughPoints) throw new Error('Cannot redeem');
      
      const { error } = await supabase.from('reward_redemptions').insert({
        profile_id: userData.id,
        points_used: pointsNeeded,
        status: 'pending',
        notes: `Vacation package redemption: ${vacation.destination_name}`
      });
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPoints', userData?.id] });
      toast({
        title: 'Redemption Requested',
        description: 'Your vacation package redemption has been submitted. Our team will contact you shortly to confirm your booking.',
      });
      onClose();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Redemption Failed',
        description: 'There was a problem processing your redemption. Please try again later.',
      });
      setIsRedeeming(false);
    }
  });

  // Handle booking
  const handleBooking = () => {
    toast({
      title: 'Booking Started',
      description: 'You will be redirected to complete your booking process.',
    });
    // In a real app, you would redirect to a checkout page or open a checkout modal
    onClose();
  };

  // Handle redeeming with points
  const handlePointsRedemption = () => {
    setIsRedeeming(true);
    redeemMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{vacation.destination_name}</DialogTitle>
          <DialogDescription className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {vacation.region}
            {vacation.duration && (
              <>
                <span className="mx-1">•</span>
                <Calendar className="w-4 h-4 mr-1" />
                {vacation.duration}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mt-2">
          <div className="aspect-video bg-muted relative overflow-hidden rounded-lg">
            <img 
              src={mockImages[currentImageIndex]} 
              alt={vacation.destination_name} 
              className="w-full h-full object-cover"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? mockImages.length - 1 : prev - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              onClick={() => setCurrentImageIndex((prev) => (prev === mockImages.length - 1 ? 0 : prev + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-center mt-2 space-x-1">
            {mockImages.map((_, i) => (
              <button 
                key={i} 
                className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-primary' : 'bg-muted'}`}
                onClick={() => setCurrentImageIndex(i)}
              />
            ))}
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="booking">Booking Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-4">{vacation.description_full || vacation.description_short}</p>
              
              <div className="flex items-center mb-2">
                <Tag className="w-4 h-4 text-primary mr-1.5" />
                <span className="text-sm font-medium">{vacation.package_type}</span>
              </div>
              
              {vacation.available_dates && (
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p className="font-medium">Available Dates:</p>
                  <p className="mt-1">
                    {vacation.available_dates.start_date && vacation.available_dates.end_date ? (
                      <>From {new Date(vacation.available_dates.start_date).toLocaleDateString()} to {new Date(vacation.available_dates.end_date).toLocaleDateString()}</>
                    ) : (
                      <>Contact us for availability</>
                    )}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="amenities">
            <div className="grid grid-cols-2 gap-2">
              {vacation.amenities && vacation.amenities.length > 0 ? (
                vacation.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>{amenity}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground col-span-2">Amenities information not available</p>
              )}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={() => window.open('#', '_blank')}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat with Concierge for Details
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="booking">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Package Price:</span>
                  <div className="flex items-center">
                    {hasDiscount && (
                      <>
                        <span className="text-sm text-muted-foreground line-through mr-2">${vacation.price.toLocaleString()}</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {userData?.membership_tier === 'core' ? '15% Off' : '20% Off'}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-lg font-semibold mb-4">
                  <span>Total:</span>
                  <span>${discountedPrice.toLocaleString()}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>* Price is per package. Additional fees may apply.</p>
                  <p>* Taxes and local charges not included.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  className="flex-1" 
                  onClick={handleBooking}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
                
                <Button 
                  className="flex-1" 
                  variant="outline"
                  disabled={!hasEnoughPoints || isRedeeming}
                  onClick={handlePointsRedemption}
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Redeem with Points ({pointsNeeded})
                </Button>
              </div>
              
              {!hasEnoughPoints && (
                <p className="text-sm text-muted-foreground">
                  You need {pointsNeeded} points to redeem this package. 
                  Current balance: {pointsData?.current_balance || 0} points.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VacationDetailsModal;
