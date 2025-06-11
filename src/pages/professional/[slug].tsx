import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, Calendar, CheckCircle, MessageSquare, Star, User, FileText, Video } from 'lucide-react';
import PlacementRequestButton from '@/components/placement/PlacementRequestButton';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Professional {
  id: string;
  name: string;
  first_name?: string;
  credentials?: string;
  email?: string;
  phone?: string;
  practice_name?: string;
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
  slug?: string;
}

const ProfessionalPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfessional = async () => {
      setIsLoading(true);
      try {
        if (!slug) {
          throw new Error('No slug provided');
        }

        // First try to fetch by exact slug
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'active')
          .maybeSingle();

        if (error) {
          console.error('Error fetching professional by slug:', error);
          // If there's an error with the exact slug query, try a more flexible approach
          const { data: alternativeData, error: alternativeError } = await supabase
            .from('partners')
            .select('*')
            .eq('status', 'active')
            .ilike('slug', `%${slug}%`)
            .limit(1)
            .maybeSingle();
            
          if (alternativeError) {
            throw alternativeError;
          }
          
          if (alternativeData) {
            setProfessional(alternativeData);
          } else {
            throw new Error('Professional not found');
          }
        } else if (data) {
          setProfessional(data);
        } else {
          throw new Error('Professional not found');
        }
      } catch (error: any) {
        console.error('Error fetching professional:', error);
        setError(error.message);
        toast({
          title: 'Error',
          description: 'Failed to load professional information',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessional();
  }, [slug, toast]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleCallProfessional = () => {
    if (professional?.phone) {
      window.location.href = `tel:${professional.phone}`;
    } else {
      toast({
        title: "No phone number available",
        description: "This professional hasn't provided a phone number.",
        variant: "destructive",
      });
    }
  };

  const handleEmailProfessional = () => {
    if (professional?.email) {
      window.location.href = `mailto:${professional.email}`;
    } else {
      toast({
        title: "No email available",
        description: "This professional hasn't provided an email address.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      toast({
        title: "Message sent",
        description: "Your message has been sent to the professional.",
      });
      setMessageText('');
    } else {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
    }
  };

  const handleBookAppointment = () => {
    toast({
      title: "Booking initiated",
      description: "You'll be redirected to the appointment booking page.",
    });
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

  if (error || !professional) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Professional Not Found</h1>
            <p className="mt-4 text-lg text-gray-600">
              The healthcare professional you're looking for doesn't exist or is no longer available.
            </p>
            <Button 
              className="mt-6" 
              onClick={() => navigate('/placements')}
            >
              View All Professionals
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Prepare SEO metadata
  const metaDescription = professional.bio?.substring(0, 150) + (professional.bio && professional.bio.length > 150 ? '...' : '') || 
    `${professional.name} is a healthcare professional specializing in ${professional.specialties?.join(', ') || 'healthcare services'}.`;
  
  return (
    <MainLayout>
      <Helmet>
        <title>{professional.name} | Healthcare Professional</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={`${professional.name} | Healthcare Professional`} />
        <meta property="og:description" content={metaDescription} />
        {professional.profile_image && <meta property="og:image" content={professional.profile_image} />}
        <meta property="og:type" content="profile" />
        <link rel="canonical" href={`${window.location.origin}/professional/${professional.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": professional.name,
            "description": metaDescription,
            "jobTitle": professional.credentials,
            "telephone": professional.phone,
            "email": professional.email,
            "workLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressRegion": professional.service_area
              }
            },
            "image": professional.profile_image
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={professional.profile_image} alt={professional.name} />
                <AvatarFallback className="text-2xl">{getInitials(professional.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">{professional.name}</h1>
                  {professional.verified && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xl text-gray-600">{professional.credentials}</p>
                {professional.practice_name && (
                  <p className="text-gray-600">{professional.practice_name}</p>
                )}
                {professional.service_area && (
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{professional.service_area}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {professional.rating && (
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-md">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">{professional.rating}</span>
                </div>
              )}
              {professional.accepting_new_patients !== undefined && (
                <Badge variant={professional.accepting_new_patients ? "outline" : "secondary"} className={professional.accepting_new_patients ? "border-green-500 text-green-700" : ""}>
                  {professional.accepting_new_patients ? 'Accepting New Patients' : 'Not Accepting New Patients'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About {professional.first_name || professional.name.split(' ')[0]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="bio">
                  <TabsList>
                    <TabsTrigger value="bio">Biography</TabsTrigger>
                    <TabsTrigger value="specialties">Specialties</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bio" className="pt-4">
                    <div className="prose max-w-none">
                      <p>{professional.bio}</p>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {professional.languages && professional.languages.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">Languages</h3>
                          <div className="flex flex-wrap gap-2">
                            {professional.languages.map((language, idx) => (
                              <Badge key={idx} variant="outline">{language}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {professional.hourly_rate && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">Rate</h3>
                          <p>{professional.hourly_rate}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="specialties" className="pt-4">
                    <div className="space-y-6">
                      {professional.specialties && professional.specialties.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Specialties</h3>
                          <div className="flex flex-wrap gap-2">
                            {professional.specialties.map((specialty, idx) => (
                              <Badge key={idx} variant="secondary">{specialty}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {professional.specializations && professional.specializations.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Specializations</h3>
                          <div className="flex flex-wrap gap-2">
                            {professional.specializations.map((specialization, idx) => (
                              <Badge key={idx} variant="outline">{specialization}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="services" className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Available Services</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>In-person consultations</span>
                          </div>
                          {professional.telehealth_enabled && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Telehealth appointments</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Medical evaluations</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Follow-up appointments</span>
                          </div>
                          {professional.specializations?.includes('Chronic Disease Management') && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Chronic disease management</span>
                            </div>
                          )}
                          {professional.specializations?.includes('Preventive Care') && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Preventive care</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Patient Reviews</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < Math.floor(professional.rating || 5) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="ml-2 text-lg font-medium">{professional.rating || 5.0}</span>
                      <span className="ml-2 text-gray-500">(24 reviews)</span>
                    </div>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Jane Doe</p>
                            <p className="text-sm text-gray-500">May 15, 2025</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < 5 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Dr. {professional.first_name || professional.name.split(' ')[0]} is an excellent healthcare provider. Very knowledgeable and takes the time to listen to concerns. Highly recommend!
                      </p>
                    </div>
                    
                    <div className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>RS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Robert Smith</p>
                            <p className="text-sm text-gray-500">April 28, 2025</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">
                        I've been seeing {professional.first_name || professional.name.split(' ')[0]} for several months now and have been very pleased with the care I've received. The office staff is also very friendly and efficient.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="outline">View All Reviews</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {professional.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-indigo-600" />
                    <span>{professional.phone}</span>
                  </div>
                )}
                {professional.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    <span>{professional.email}</span>
                  </div>
                )}
                {professional.practice_name && (
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-600" />
                    <span>{professional.practice_name}</span>
                  </div>
                )}
                {professional.service_area && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    <span>{professional.service_area}</span>
                  </div>
                )}
                {professional.telehealth_enabled && (
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-indigo-600" />
                    <span>Telehealth Available</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button className="w-full" onClick={handleBookAppointment}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Message {professional.name}</DialogTitle>
                      <DialogDescription>
                        Send a message to inquire about services or schedule a consultation.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea 
                        placeholder="Type your message here..."
                        className="min-h-[150px]"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSendMessage}>Send Message</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="w-full" onClick={handleCallProfessional}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                
                <Button variant="outline" className="w-full" onClick={handleEmailProfessional}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                
                <PlacementRequestButton 
                  professionalId={professional.id}
                  professionalName={professional.name}
                  className="w-full"
                />
              </CardFooter>
            </Card>
            
            {professional.specialties && professional.specialties.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {professional.languages && professional.languages.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.languages.map((language, idx) => (
                      <Badge key={idx} variant="outline">{language}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfessionalPage;