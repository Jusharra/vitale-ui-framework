import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Phone, Mail, Clock, CheckCircle, Globe, Calendar, User, Video, Instagram, Linkedin, Facebook, Youtube, BookText } from 'lucide-react';
import PlacementRequestButton from '@/components/placement/PlacementRequestButton';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SafeHtmlRenderer } from '@/components/common/SafeHtmlRenderer';

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
  services?: string[];
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

interface Partner {
  id: string;
  name: string;
  slug: string;
  first_name?: string;
  credentials?: string;
  email?: string;
  phone?: string;
  practice_name?: string;
  practice_address?: any;
  specialties?: string[];
  languages?: string[];
  specializations?: string[];
  service_area?: string;
  hourly_rate?: string;
  bio?: string;
  accepting_new_patients?: boolean;
  telehealth_enabled?: boolean;
  status: string;
  profile_image?: string;
  rating?: number;
  verified?: boolean;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
}

const FacilityPage = () => {
  const { slug } = useParams<{ slug: string; city?: string }>();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!slug) {
          throw new Error('No slug provided');
        }

        // First try to fetch facility by exact slug
        const { data: facilityData, error: facilityError } = await (supabase as any)
          .from('care_facilities')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'active')
          .maybeSingle();

        // If facility is found, use it
        if (facilityData) {
          setFacility(facilityData as any);
          setIsLoading(false);
          return;
        }

        // If no facility found, try to fetch partner by slug
        const { data: partnerData, error: partnerError } = await (supabase as any)
          .from('partners')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'active')
          .maybeSingle();

        if (partnerData) {
          setPartner(partnerData as any);
          setIsLoading(false);
          return;
        }

        // If neither found, try more flexible approaches
        if (!facilityData && !partnerData) {
          // Try a more flexible facility search
          const { data: altFacilityData, error: altFacilityError } = await (supabase as any)
            .from('care_facilities')
            .select('*')
            .eq('status', 'active')
            .ilike('slug', `%${slug}%`)
            .limit(1)
            .maybeSingle();
            
          if (altFacilityData) {
            setFacility(altFacilityData as any);
            setIsLoading(false);
            return;
          }
          
          // Try a more flexible partner search
          const { data: altPartnerData, error: altPartnerError } = await (supabase as any)
            .from('partners')
            .select('*')
            .eq('status', 'active')
            .ilike('slug', `%${slug}%`)
            .limit(1)
            .maybeSingle();
            
          if (altPartnerData) {
            setPartner(altPartnerData as any);
            setIsLoading(false);
            return;
          }
          
          // If still nothing found, throw error
          throw new Error('No matching facility or professional found');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message);
        toast({
          title: 'Error',
          description: 'Failed to load information',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, toast]);

  const handleCallContact = () => {
    const phone = facility?.phone || partner?.phone;
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      toast({
        title: "No phone number available",
        description: "No phone number has been provided.",
        variant: "destructive",
      });
    }
  };

  const handleEmailContact = () => {
    const email = facility?.email || partner?.email;
    if (email) {
      window.location.href = `mailto:${email}`;
    } else {
      toast({
        title: "No email available",
        description: "No email address has been provided.",
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
        description: "No website URL has been provided.",
        variant: "destructive",
      });
    }
  };

  // Map service IDs to human-readable labels
  const getServiceLabel = (serviceId: string) => {
    const serviceMap: Record<string, string> = {
      "24h_care": "24/7 Care",
      "memory_care": "Memory Care",
      "medication_management": "Medication Management",
      "physical_therapy": "Physical Therapy",
      "occupational_therapy": "Occupational Therapy",
      "speech_therapy": "Speech Therapy",
      "skilled_nursing": "Skilled Nursing",
      "hospice": "Hospice Care",
      "respite_care": "Respite Care",
      "transportation": "Transportation",
      "meals": "Meals & Nutrition",
      "housekeeping": "Housekeeping",
      "laundry": "Laundry Services",
      "social_activities": "Social Activities",
      "wellness_programs": "Wellness Programs",
      "personal_care": "Personal Care Assistance",
      "bathing_assistance": "Bathing Assistance",
      "dressing_assistance": "Dressing Assistance",
      "mobility_assistance": "Mobility Assistance",
      "incontinence_care": "Incontinence Care",
    };
    
    return serviceMap[serviceId] || serviceId;
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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

  if (error || (!facility && !partner)) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Not Found</h1>
            <p className="mt-4 text-lg text-gray-600">
              The page you're looking for doesn't exist or is no longer available.
            </p>
            <Button 
              className="mt-6" 
              onClick={() => navigate('/marketplace')}
            >
              View All Options
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Render facility details
  if (facility) {
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
          {metaKeywords && <meta name="keywords" content={metaKeywords} />}
          <meta property="og:title" content={`${facility.name} | Premium Care Services`} />
          <meta property="og:description" content={metaDescription} />
          {facility.image_url && <meta property="og:image" content={facility.image_url} />}
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
                <SafeHtmlRenderer 
                  htmlContent={facility.description}
                  className="rich-content"
                  showFallback={true}
                  fallbackText="No description available for this facility."
                />
              </div>

              <div className="mt-8">
                <Tabs defaultValue="amenities">
                  <TabsList className="w-full">
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="amenities" className="pt-4">
                    {facility.amenities && facility.amenities.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {facility.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No amenities listed for this facility.</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="services" className="pt-4">
                    {facility.services && facility.services.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {facility.services.map((service, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>{getServiceLabel(service)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No services listed for this facility.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
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
                  <Button className="w-full" onClick={handleCallContact}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Facility
                  </Button>
                  
                  <Button variant="outline" className="w-full" onClick={handleEmailContact}>
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
  }

  // Render partner details
  if (partner) {
    // Prepare SEO metadata
    const metaDescription = partner.bio?.substring(0, 150) + (partner.bio && partner.bio.length > 150 ? '...' : '') || 
      `${partner.name} is a healthcare professional specializing in ${partner.specialties?.join(', ') || 'various areas'}.`;
    
    // Check if partner has any social media links
    const hasSocialMedia = partner.instagram_url || partner.facebook_url || 
                           partner.linkedin_url || partner.youtube_url || 
                           partner.tiktok_url;

    return (
      <MainLayout>
        <Helmet>
          <title>{partner.name} | Healthcare Professional</title>
          <meta name="description" content={metaDescription} />
          <meta property="og:title" content={`${partner.name} | Healthcare Professional`} />
          <meta property="og:description" content={metaDescription} />
          {partner.profile_image && <meta property="og:image" content={partner.profile_image} />}
          <meta property="og:type" content="profile" />
          <link rel="canonical" href={`${window.location.origin}/care/${partner.slug}`} />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Physician",
              "name": partner.name,
              "description": metaDescription,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": partner.service_area
              },
              "telephone": partner.phone,
              "email": partner.email,
              "image": partner.profile_image,
              "medicalSpecialty": partner.specialties
            })}
          </script>
        </Helmet>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={partner.profile_image} />
                <AvatarFallback className="text-xl bg-indigo-100 text-indigo-600">
                  {getInitials(partner.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{partner.name}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-indigo-600 mr-1" />
                    <span className="text-gray-600">{partner.service_area || 'Service area not specified'}</span>
                  </div>
                  {partner.verified && (
                    <Badge className="bg-green-600">Verified</Badge>
                  )}
                  {partner.telehealth_enabled && (
                    <Badge variant="outline">Telehealth Available</Badge>
                  )}
                  {partner.accepting_new_patients && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">Accepting New Patients</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="prose max-w-none">
                <h2>About {partner.first_name || partner.name.split(' ')[0]}</h2>
                <SafeHtmlRenderer 
                  htmlContent={partner.bio || `${partner.name} is a healthcare professional serving patients in ${partner.service_area || 'the local area'}.`}
                  className="rich-content"
                  showFallback={true}
                  fallbackText="No biography available for this professional."
                />
              </div>

              <div className="mt-8">
                <Tabs defaultValue="specialties">
                  <TabsList className="w-full">
                    <TabsTrigger value="specialties">Specialties</TabsTrigger>
                    <TabsTrigger value="languages">Languages</TabsTrigger>
                    {partner.specializations && partner.specializations.length > 0 && (
                      <TabsTrigger value="specializations">Specializations</TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="specialties" className="pt-4">
                    {partner.specialties && partner.specialties.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {partner.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline">{specialty}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No specialties listed for this professional.</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="languages" className="pt-4">
                    {partner.languages && partner.languages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {partner.languages.map((language, index) => (
                          <Badge key={index} variant="outline">{language}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No languages listed for this professional.</p>
                    )}
                  </TabsContent>
                  
                  {partner.specializations && partner.specializations.length > 0 && (
                    <TabsContent value="specializations" className="pt-4">
                      <div className="flex flex-wrap gap-2">
                        {partner.specializations.map((specialization, index) => (
                          <Badge key={index} variant="outline">{specialization}</Badge>
                        ))}
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                
                <div className="space-y-4">
                  {partner.practice_name && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Practice</p>
                      <p className="text-lg font-semibold">{partner.practice_name}</p>
                    </div>
                  )}
                  
                  {partner.hourly_rate && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rate</p>
                      <p className="text-lg font-semibold">{partner.hourly_rate}</p>
                    </div>
                  )}
                  
                  {partner.phone && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-lg font-semibold">{partner.phone}</p>
                    </div>
                  )}
                  
                  {partner.email && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg font-semibold">{partner.email}</p>
                    </div>
                  )}
                  
                  {partner.rating && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rating</p>
                      <div className="flex items-center">
                        <p className="text-lg font-semibold">{partner.rating}</p>
                        <span className="text-yellow-500 ml-1">★</span>
                      </div>
                    </div>
                  )}

                  {/* Social Media Links */}
                  {hasSocialMedia && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Social Media</p>
                      <div className="flex flex-wrap gap-2">
                        {partner.instagram_url && (
                          <a href={partner.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile">
                            <Button variant="outline" size="icon">
                              <Instagram className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {partner.linkedin_url && (
                          <a href={partner.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                            <Button variant="outline" size="icon">
                              <Linkedin className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {partner.facebook_url && (
                          <a href={partner.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook Profile">
                            <Button variant="outline" size="icon">
                              <Facebook className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {partner.youtube_url && (
                          <a href={partner.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube Channel">
                            <Button variant="outline" size="icon">
                              <Youtube className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {partner.tiktok_url && (
                          <a href={partner.tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok Profile">
                            <Button variant="outline" size="icon">
                              <BookText className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button className="w-full" onClick={handleCallContact}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Provider
                  </Button>
                  
                  <Button variant="outline" className="w-full" onClick={handleEmailContact}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Provider
                  </Button>
                  
                  {partner.telehealth_enabled && (
                    <Button variant="outline" className="w-full">
                      <Video className="mr-2 h-4 w-4" />
                      Schedule Telehealth
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </Button>
                </div>
              </div>
              
              <div className="mt-6">
                <PlacementRequestButton 
                  facilityId={partner.id}
                  facilityName={partner.name}
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
  }

  // This should never happen due to the error check above, but TypeScript requires a return
  return null;
};

export default FacilityPage;