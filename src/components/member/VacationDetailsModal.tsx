
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  Gift,
  User
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

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
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .single();
      
      // Map role to membership_tier
      let membership_tier = 'smart';
      if (data?.role === 'vip' || data?.role === 'professional') {
        membership_tier = 'vip';
      } else if (data?.role === 'member') {
        membership_tier = 'core';
      }
      
      return { id: data?.id || user.id, membership_tier };
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-0">
          {/* Image Carousel */}
          <Carousel className="w-full">
            <CarouselContent>
              {mockImages.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[16/9] w-full relative">
                    <img 
                      src={img} 
                      alt={`${vacation.destination_name} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Main content - 2/3 width on desktop */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{vacation.destination_name}</h2>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {vacation.package_type}
                  </Badge>
                </div>

                <div className="flex items-center mt-1 text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{vacation.region}</span>
                  {vacation.duration && (
                    <>
                      <span className="mx-1">•</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{vacation.duration}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-b py-6">
                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="dates">Available Dates</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <p className="text-muted-foreground">
                      {vacation.description_full || vacation.description_short}
                    </p>
                    
                    <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-primary p-1.5 bg-primary/10 rounded-full" />
                        <div>
                          <h3 className="font-medium">Hosted by Wellness Concierge</h3>
                          <p className="text-sm text-muted-foreground">Our team will guide you through the entire experience</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="amenities">
                    <div className="grid grid-cols-2 gap-2">
                      {vacation.amenities && vacation.amenities.length > 0 ? (
                        vacation.amenities.map((amenity, i) => (
                          <div key={i} className="flex items-center p-2">
                            <Check className="h-4 w-4 text-primary mr-2 shrink-0" />
                            <span>{amenity}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground col-span-2">Amenities information not available</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dates">
                    {vacation.available_dates && (vacation.available_dates.start_date || vacation.available_dates.end_date) ? (
                      <div className="space-y-4">
                        <p className="font-medium">Available booking window:</p>
                        <div className="bg-muted p-4 rounded-md text-center">
                          <p className="text-lg">{vacation.available_dates.start_date ? 
                            new Date(vacation.available_dates.start_date).toLocaleDateString() : 'Open start date'} 
                            {' '} to {' '}
                            {vacation.available_dates.end_date ? 
                            new Date(vacation.available_dates.end_date).toLocaleDateString() : 'Open end date'}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">Contact your concierge for custom date arrangements</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p>Dates are flexible for this package.</p>
                        <p className="text-sm text-muted-foreground mt-2">Contact your concierge to arrange your preferred dates.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <div className="md:hidden">
                <Button 
                  className="w-full mb-3"
                  onClick={handleBooking}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
                
                <Button 
                  className="w-full"
                  variant="outline"
                  disabled={!hasEnoughPoints || isRedeeming}
                  onClick={handlePointsRedemption}
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Redeem with Points ({pointsNeeded})
                </Button>
              </div>

              <div>
                <Button variant="ghost" className="flex items-center gap-2 text-primary">
                  <MessageCircle className="h-4 w-4" />
                  Chat with Concierge for Details
                </Button>
              </div>
            </div>

            {/* Booking sidebar - 1/3 width on desktop */}
            <div className="md:col-span-1">
              <div className="border rounded-lg shadow-sm p-4 sticky top-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-lg font-semibold">
                      ${discountedPrice.toLocaleString()}
                    </p>
                    {hasDiscount && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground line-through">${vacation.price.toLocaleString()}</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {userData?.membership_tier === 'core' ? '15% Off' : '20% Off'}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Badge>{vacation.duration || 'Flexible'}</Badge>
                </div>

                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground border-t border-b py-3">
                    <p>* Price is per package. Additional fees may apply.</p>
                    <p>* Taxes and local charges not included.</p>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleBooking}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Book Now
                  </Button>
                  
                  <Button 
                    className="w-full"
                    variant="outline"
                    disabled={!hasEnoughPoints || isRedeeming}
                    onClick={handlePointsRedemption}
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Redeem with Points ({pointsNeeded})
                  </Button>
                  
                  {!hasEnoughPoints && (
                    <p className="text-sm text-muted-foreground">
                      You need {pointsNeeded} points to redeem this package.
                      Current balance: {pointsData?.current_balance || 0} points.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VacationDetailsModal;
