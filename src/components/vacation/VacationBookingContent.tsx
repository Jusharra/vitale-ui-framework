import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRegionalPricing } from '@/hooks/useRegionalPricing';
import { supabase } from '@/integrations/supabase/client';
import TravelDatePicker from './TravelDatePicker';
import SocialShareButton from './SocialShareButton';
import { generateSlug } from '@/utils/stringUtils';
import { MapPin, Users, Star, Wifi, Car, Coffee, Utensils, Calendar, DollarSign } from 'lucide-react';

interface VacationPackage {
  id: string;
  destination_name: string;
  region: string;
  description_short: string;
  description_full: string;
  price: number;
  duration: string;
  package_type: string;
  image_url: string;
  amenities: string[];
  available_dates: {
    start_date: string;
    end_date: string;
  };
  featured: boolean;
}

interface BookingForm {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numberOfGuests: number;
  specialRequests: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
}

const amenityIcons: Record<string, React.ComponentType<any>> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Breakfast': Coffee,
  'Restaurant': Utensils,
};

const VacationBookingContent: React.FC<{ packageSlug?: string }> = ({ packageSlug }) => {
  const [vacationPackage, setVacationPackage] = useState<VacationPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { formatCurrency } = useRegionalPricing();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<BookingForm>({
    guestName: user?.user_metadata?.full_name || '',
    guestEmail: user?.email || '',
    guestPhone: '',
    numberOfGuests: 1,
    specialRequests: '',
    checkInDate: null,
    checkOutDate: null,
  });

  useEffect(() => {
    const fetchPackage = async () => {
      if (!packageSlug) {
        setLoading(false);
        return;
      }

      try {
        // Generate slug from destination name for matching
        const { data, error } = await supabase
          .from('vacation_packages')
          .select('*')
          .ilike('status', 'active');

        if (error) throw error;

        // Find package by matching generated slug
        const matchedPackage = data?.find(pkg => {
          const generatedSlug = generateSlug(pkg.destination_name);
          return generatedSlug === packageSlug;
        });

        if (matchedPackage) {
          setVacationPackage({
            ...matchedPackage,
            amenities: Array.isArray(matchedPackage.amenities) ? matchedPackage.amenities : [],
            available_dates: typeof matchedPackage.available_dates === 'object' && matchedPackage.available_dates !== null 
              ? matchedPackage.available_dates as { start_date: string; end_date: string }
              : { start_date: '', end_date: '' }
          });
        }
      } catch (error) {
        console.error('Error fetching vacation package:', error);
        toast({
          title: "Error",
          description: "Failed to load vacation package",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageSlug, toast]);

  const calculateTotalPrice = () => {
    if (!vacationPackage || !form.checkInDate || !form.checkOutDate) return 0;
    
    const nights = Math.ceil((form.checkOutDate.getTime() - form.checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = vacationPackage.price * nights;
    
    // Apply membership discount if user is logged in
    if (user) {
      const membershipTier = user.user_metadata?.membership_tier;
      if (membershipTier === 'vip') {
        return basePrice * 0.8; // 20% discount for VIP
      } else if (membershipTier === 'premium') {
        return basePrice * 0.9; // 10% discount for Premium
      }
    }
    
    return basePrice;
  };

  const getDiscountAmount = () => {
    if (!vacationPackage || !form.checkInDate || !form.checkOutDate || !user) return 0;
    
    const nights = Math.ceil((form.checkOutDate.getTime() - form.checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = vacationPackage.price * nights;
    const membershipTier = user.user_metadata?.membership_tier;
    
    if (membershipTier === 'vip') {
      return basePrice * 0.2; // 20% discount
    } else if (membershipTier === 'premium') {
      return basePrice * 0.1; // 10% discount
    }
    
    return 0;
  };

  const handleInputChange = (field: keyof BookingForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!vacationPackage || !form.checkInDate || !form.checkOutDate) {
      toast({
        title: "Error",
        description: "Please select travel dates",
        variant: "destructive",
      });
      return;
    }

    if (!form.guestName || !form.guestEmail) {
      toast({
        title: "Error",
        description: "Please fill in guest information",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const totalAmount = calculateTotalPrice();
      const originalAmount = vacationPackage.price * Math.ceil((form.checkOutDate.getTime() - form.checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const discountAmount = getDiscountAmount();

      const bookingData = {
        packageId: vacationPackage.id,
        packageName: vacationPackage.destination_name,
        checkInDate: form.checkInDate.toISOString().split('T')[0],
        checkOutDate: form.checkOutDate.toISOString().split('T')[0],
        numberOfGuests: form.numberOfGuests,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone,
        specialRequests: form.specialRequests,
        totalAmount,
        originalAmount,
        discountAmount,
        membershipTier: user?.user_metadata?.membership_tier,
      };

      const { data, error } = await supabase.functions.invoke('create-vacation-booking', {
        body: bookingData,
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "Unable to process your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!vacationPackage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Package Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The vacation package you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/member/vacations')}>
                Browse All Packages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const discountAmount = getDiscountAmount();
  const originalPrice = vacationPackage.price * (form.checkInDate && form.checkOutDate ? Math.ceil((form.checkOutDate.getTime() - form.checkInDate.getTime()) / (1000 * 60 * 60 * 24)) : 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Package Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{vacationPackage.destination_name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{vacationPackage.region}</span>
                    {vacationPackage.featured && (
                      <Badge variant="secondary" className="ml-2">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(vacationPackage.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">per night</div>
                  <SocialShareButton
                    packageName={vacationPackage.destination_name}
                    packageDescription={vacationPackage.description_short}
                    packagePrice={vacationPackage.price}
                    packageImage={vacationPackage.image_url}
                    bookingUrl={window.location.href}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {vacationPackage.image_url && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={vacationPackage.image_url} 
                    alt={vacationPackage.destination_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{vacationPackage.description_full}</p>
              </div>

              {vacationPackage.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {vacationPackage.amenities.map((amenity, index) => {
                      const IconComponent = amenityIcons[amenity];
                      return (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {IconComponent && <IconComponent className="w-4 h-4 text-primary" />}
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Book Your Stay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TravelDatePicker
                checkInDate={form.checkInDate}
                checkOutDate={form.checkOutDate}
                onDateChange={(checkIn, checkOut) => {
                  handleInputChange('checkInDate', checkIn);
                  handleInputChange('checkOutDate', checkOut);
                }}
                availableDates={vacationPackage.available_dates}
              />

              <div>
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  value={form.numberOfGuests}
                  onChange={(e) => handleInputChange('numberOfGuests', parseInt(e.target.value) || 1)}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="guestName">Guest Name</Label>
                <Input
                  id="guestName"
                  value={form.guestName}
                  onChange={(e) => handleInputChange('guestName', e.target.value)}
                  placeholder="Full name"
                />
              </div>

              <div>
                <Label htmlFor="guestEmail">Email</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={form.guestEmail}
                  onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="guestPhone">Phone (Optional)</Label>
                <Input
                  id="guestPhone"
                  value={form.guestPhone}
                  onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                  placeholder="Phone number"
                />
              </div>

              <div>
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea
                  id="specialRequests"
                  value={form.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special requirements or requests..."
                  rows={3}
                />
              </div>

              {(form.checkInDate && form.checkOutDate) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Base Price</span>
                      <span>{formatCurrency(originalPrice)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-sm text-green-600">
                        <span>Member Discount</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                </>
              )}

              <Button 
                onClick={handleSubmit} 
                disabled={submitting || !form.checkInDate || !form.checkOutDate}
                className="w-full"
                size="lg"
              >
                {submitting ? 'Processing...' : 'Book Now'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Secure payment powered by Stripe. You'll be redirected to complete your booking.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VacationBookingContent;