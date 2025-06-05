import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Phone, Mail, Clock, CheckCircle, Globe, Calendar } from 'lucide-react';
import PlacementRequestButton from '@/components/placement/PlacementRequestButton';
import { useToast } from '@/hooks/use-toast';

interface Facility {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  care_type: string;
  price_range: string;
  spots_available: number;
  amenities?: string[];
  image_url?: string;
  images?: string[];
  videos?: string[];
  status: string;
  featured?: boolean;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  virtual_tour_url?: string;
  seo_keywords?: string[];
}

const FacilityPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFacility = async () => {
      setIsLoading(true);
      try {
        if (!slug) {
          throw new Error('No slug provided');
        }

        const { data, error } = await supabase
          .from('care_facilities')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'active')
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Facility not found');

        setFacility(data);
      } catch (error: any) {
        console.error('Error fetching facility:', error);
        setError(error.message);
        toast({
          title: 'Error',
          description: 'Failed to load facility information',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacility();
  }, [slug, toast]);

  const handleCallFacility = () => {
    if (facility?.phone) {
      window.location.href = `tel:${facility.phone}`;
    } else {
      toast({
        title: "No phone number available",
        description: "This facility hasn't provided a phone number.",
        variant: "destructive",
      });
    }
  };

  const handleEmailFacility = () => {
    if (facility?.email) {
      window.location.href = `mailto:${facility.email}`;
    } else {
      toast({
        title: "No email available",
        description: "This facility hasn't provided an email address.",
        variant: "destructive",
      });
    }
  };

  const handleVisitWebsite = () => {
    if (facility?.website) {
      window.open(facility.website, '_blank');
    } else {
      toast({
        title: "No website available",
        description: "This facility hasn't provided a website URL.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !facility) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Facility Not Found</h1>
            <p className="mt-4 text-lg text-gray-600">
              The facility you're looking for doesn't exist or is no longer available.
            </p>
            <Button 
              className="mt-6" 
              onClick={() => navigate('/placements')}
            >
              View All Facilities
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Prepare SEO metadata
  const metaDescription = facility.description.substring(0, 150) + (facility.description.length > 150 ? '...' : '');
  const metaKeywords = facility.seo_keywords ? facility.seo_keywords.join(', ') : '';
  
  // Prepare image URLs
  const imageUrls = facility.images?.length ? facility.images : (facility.image_url ? [facility.image_url] : []);

  return (
    <MainLayout>
      <Helmet>
        <title>{facility.name} | Premium Care Services</title>
        <meta name="description" content={metaDescription} />
        {metaKeywords && <meta name="keywords\" content={metaKeywords} />}
        <meta property="og:title" content={`${facility.name} | Premium Care Services`} />
        <meta property="og:description" content={metaDescription} />
        {facility.image_url && <meta property="og:image\" content={facility.image_url} />}
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/care/${facility.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": facility.name,
            "description": metaDescription,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": facility.location
            },
            "telephone": facility.phone,
            "email": facility.email,
            "url": facility.website,
            "image": facility.image_url,
            "priceRange": facility.price_range
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{facility.name}</h1>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-600" />
            <span className="text-gray-600">{facility.location}</span>
            <Badge variant="outline">{facility.care_type}</Badge>
          </div>
        </div>

        {/* Featured Image */}
        {imageUrls.length > 0 && (
          <div className="mb-8">
            <div className="relative w-full max-w-[1200px] mx-auto overflow-hidden rounded-lg bg-black">
              <Carousel className="w-full">
                <CarouselContent>
                  {imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full flex items-center justify-center">
                        <div className="w-full h-[400px] flex items-center justify-center">
                          <img 
                            src={url} 
                            alt={`${facility.name} - Image ${index + 1}`} 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {imageUrls.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </>
                )}
              </Carousel>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="prose max-w-none">
              <h2>About {facility.name}</h2>
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: facility.description }} />
            </div>

            {facility.amenities && facility.amenities.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Amenities & Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {facility.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Facility Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Price Range</p>
                  <p className="text-lg font-semibold">{facility.price_range}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Availability</p>
                  <p className="text-lg font-semibold">
                    {facility.spots_available > 0 
                      ? `${facility.spots_available} spots available` 
                      : "Currently full"}
                  </p>
                </div>
                
                {facility.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-lg font-semibold">{facility.phone}</p>
                  </div>
                )}
                
                {facility.email && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg font-semibold">{facility.email}</p>
                  </div>
                )}
                
                {facility.hours && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hours</p>
                    <p className="text-lg font-semibold">{facility.hours}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 space-y-3">
                <Button className="w-full" onClick={handleCallFacility}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Facility
                </Button>
                
                <Button variant="outline" className="w-full" onClick={handleEmailFacility}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email Facility
                </Button>
                
                {facility.website && (
                  <Button variant="outline" className="w-full" onClick={handleVisitWebsite}>
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                )}
                
                {facility.virtual_tour_url && (
                  <Button variant="outline" className="w-full" onClick={() => window.open(facility.virtual_tour_url, '_blank')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Virtual Tour
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <PlacementRequestButton 
                facilityId={facility.id}
                facilityName={facility.name}
                className="w-full"
                size="lg"
              >
                Request Placement Assistance
              </PlacementRequestButton>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FacilityPage;