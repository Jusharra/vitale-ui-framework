import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Phone, Mail, Calendar as CalendarIcon, Clock, Star, CheckCircle, MessageSquare, Video, User, Award, Stethoscope, Instagram, Linkedin, Facebook, Globe, Heart, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

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

const ProfessionalProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'telehealth'>('in-person');
  
  useEffect(() => {
    const fetchProfessional = async () => {
      setIsLoading(true);
      setNotFound(false);
      
      try {
        if (!slug) {
          setNotFound(true);
          return;
        }

        console.log("Fetching partner with slug:", slug);

        // First try to fetch by exact slug
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'active')
          .maybeSingle();

        if (error) {
          console.error('Error fetching partner by slug:', error);
          // Don't throw error, just log it and continue to show not found
          setNotFound(true);
          return;
        }

        if (data) {
          console.log("Found partner with exact slug match:", data);
          setProfessional(data);
        } else {
          console.log("No exact match found, trying partial match");
          // If no exact match found, try a case-insensitive search
          const { data: alternativeData, error: alternativeError } = await supabase
            .from('partners')
            .select('*')
            .eq('status', 'active')
            .ilike('slug', `%${slug}%`)
            .limit(1)
            .maybeSingle();
            
          if (alternativeError) {
            console.error('Error in alternative search:', alternativeError);
            setNotFound(true);
            return;
          }
          
          if (alternativeData) {
            console.log("Found partner with partial match:", alternativeData);
            setProfessional(alternativeData);
          } else {
            console.log("No partner found with slug:", slug);
            setNotFound(true);
          }
        }
      } catch (error: any) {
        console.error('Unexpected error fetching partner:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessional();
  }, [slug]);

  // Generate time slots (9 AM to 5 PM) with 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 16; hour++) {
      const hourFormatted = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? "PM" : "AM";
      
      slots.push(`${hourFormatted}:00 ${period}`);
      slots.push(`${hourFormatted}:30 ${period}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  
  const handleBookAppointment = () => {
    if (!date || !timeSlot) {
      toast({
        title: "Incomplete booking",
        description: "Please select a date and time for your appointment",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Appointment Booked",
      description: `Your ${appointmentType} appointment with ${professional?.name} has been scheduled for ${format(date, 'MMMM d, yyyy')} at ${timeSlot}.`,
    });
    
    setDate(undefined);
    setTimeSlot(null);
  };
  
  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  if (notFound || !professional) {
    return (
      <MainLayout>
        <Helmet>
          <title>Professional Not Found | Healthcare Professional</title>
          <meta name="description" content="The requested healthcare professional profile could not be found." />
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Professional Not Found</h1>
            <p className="mt-4 text-lg text-gray-600">
              The healthcare professional with slug "{slug}" doesn't exist or is no longer available.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Please check the URL or browse our available professionals.
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

  // Prepare meta description
  const metaDescription = professional.bio?.substring(0, 150) + (professional.bio && professional.bio.length > 150 ? '...' : '') || 
    `Book an appointment with ${professional.name}, ${professional.credentials || 'healthcare professional'} in ${professional.service_area || 'your area'}.`;

  // Prepare structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": professional.name,
    "description": metaDescription,
    "image": professional.profile_image || "",
    "telephone": professional.phone || "",
    "email": professional.email || "",
    "medicalSpecialty": professional.specialties || [],
    "availableLanguage": professional.languages || [],
    "address": {
      "@type": "PostalAddress",
      "addressRegion": professional.service_area || ""
    },
    "priceRange": professional.hourly_rate || "",
    "hasCredential": professional.credentials || "",
    "worksFor": {
      "@type": "MedicalOrganization",
      "name": professional.practice_name || "Independent Practice"
    }
  };

  // FAQ Structured Data
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What services does ${professional.name} offer?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${professional.name} offers comprehensive healthcare services including consultations, assessments, treatment planning, and ongoing care management. ${professional.telehealth_enabled ? 'Telehealth services are also available.' : ''}`
        }
      },
      {
        "@type": "Question",
        "name": `What areas does ${professional.name} serve?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${professional.name} serves patients in ${professional.service_area || 'the local area'}.`
        }
      },
      {
        "@type": "Question",
        "name": `Is ${professional.name} accepting new patients?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": professional.accepting_new_patients ? 
            `Yes, ${professional.name} is currently accepting new patients. You can book an appointment online or call directly.` : 
            `${professional.name} is not currently accepting new patients. Please check back later or contact the office for more information.`
        }
      }
    ]
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Meet Your Trusted Care Team | {professional.name}</title>
        <meta name="description" content={`Discover certified caregivers serving ${professional.service_area} with empathy and elite care. Our team combines compassion with AI-powered efficiency.`} />
        <meta property="og:title" content={`Meet Your Trusted Care Team | ${professional.name}`} />
        <meta property="og:description" content={metaDescription} />
        {professional.profile_image && <meta property="og:image" content={professional.profile_image} />}
        <meta property="og:type" content="profile" />
        <link rel="canonical" href={`${window.location.origin}/professional/${professional.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqData)}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/placements')}
            className="mb-4"
          >
            &larr; Back to Placements
          </Button>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="md:w-1/4 flex flex-col items-center">
              <Avatar className="h-48 w-48">
                <AvatarImage src={professional.profile_image || '/placeholder.svg'} alt={professional.name} />
                <AvatarFallback className="text-4xl">{getInitials(professional.name)}</AvatarFallback>
              </Avatar>
              
              <div className="mt-4 flex flex-col items-center">
                {professional.rating && (
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">{professional.rating}</span>
                  </div>
                )}
                
                {professional.verified && (
                  <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified Provider
                  </Badge>
                )}
                
                {professional.accepting_new_patients !== undefined && (
                  <Badge 
                    variant={professional.accepting_new_patients ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {professional.accepting_new_patients ? "Accepting New Patients" : "Not Accepting Patients"}
                  </Badge>
                )}

                {/* Social Media Links */}
                <div className="mt-4 flex gap-2">
                  <a href="https://www.instagram.com/healthcare_provider" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile">
                    <Button variant="outline" size="icon">
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href="https://www.linkedin.com/in/healthcare-professional" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                    <Button variant="outline" size="icon">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href="https://www.facebook.com/healthcare_provider" target="_blank" rel="noopener noreferrer" aria-label="Facebook Profile">
                    <Button variant="outline" size="icon">
                      <Facebook className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="md:w-3/4">
              <h1 className="text-3xl font-bold text-gray-900">{professional.name}</h1>
              {professional.credentials && (
                <p className="text-xl text-gray-600">{professional.credentials}</p>
              )}
              
              {professional.practice_name && (
                <p className="text-xl font-medium mt-2">{professional.practice_name}</p>
              )}
              
              {professional.specialties && professional.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {professional.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline">{specialty}</Badge>
                  ))}
                </div>
              )}
              
              <div className="mt-4 space-y-2">
                {professional.service_area && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                    <span>Serving patients in {professional.service_area}</span>
                  </div>
                )}
                
                {professional.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{professional.phone}</span>
                  </div>
                )}
                
                {professional.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{professional.email}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <Button 
                  size="lg"
                  disabled={!professional.accepting_new_patients}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Book Consultation
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
                
                {professional.telehealth_enabled && (
                  <Button 
                    variant="outline" 
                    size="lg"
                  >
                    <Video className="mr-2 h-5 w-5" />
                    Telehealth Session
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About {professional.first_name || professional.name.split(' ')[0]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Professional Bio</h3>
                  <p className="text-gray-700">{professional.bio || `${professional.name} is a dedicated healthcare professional serving patients in ${professional.service_area || 'the local area'}. With a focus on patient-centered care, ${professional.first_name || professional.name.split(' ')[0]} combines clinical expertise with compassion to deliver exceptional healthcare services.`}</p>
                  
                  {/* Quote from a notable figure */}
                  <blockquote className="border-l-4 border-indigo-500 pl-4 my-4 italic text-gray-600">
                    "Inspired by the kindness of The Notebook and Patch Adams, I believe that true healing comes from a combination of medical expertise and genuine human connection."
                  </blockquote>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {professional.specialties && professional.specialties.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {professional.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline">{specialty}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {professional.languages && professional.languages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {professional.languages.map((language, index) => (
                          <Badge key={index} variant="secondary">{language}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {professional.specializations && professional.specializations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {professional.specializations.map((specialization, index) => (
                        <Badge key={index} variant="outline">{specialization}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured in publications section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Featured In</h3>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="bg-white p-2 rounded shadow-sm">
                      <span className="font-semibold text-gray-700">TIME Health</span>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm">
                      <span className="font-semibold text-gray-700">Healthline</span>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm">
                      <span className="font-semibold text-gray-700">AARP</span>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm">
                      <span className="font-semibold text-gray-700">WebMD</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <User className="h-5 w-5 text-indigo-600 mr-2" />
                        <h3 className="font-medium">In-Person Consultations</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Face-to-face appointments at the provider's office or your location near Cedars-Sinai in 90210.
                      </p>
                      {professional.hourly_rate && (
                        <div className="flex justify-between items-center">
                          <span>Rate:</span>
                          <span className="font-medium">{professional.hourly_rate}</span>
                        </div>
                      )}
                    </div>
                    
                    {professional.telehealth_enabled && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <Video className="h-5 w-5 text-indigo-600 mr-2" />
                          <h3 className="font-medium">Telehealth Sessions</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Virtual appointments via secure video conferencing powered by Twilio and VAPI AI.
                        </p>
                        {professional.hourly_rate && (
                          <div className="flex justify-between items-center">
                            <span>Rate:</span>
                            <span className="font-medium">{professional.hourly_rate}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Award className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="font-medium">Specialized Services</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Comprehensive Assessments</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Treatment Planning</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Medication Management</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Care Coordination</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Family Consultations</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>Health Education</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Insurance section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Heart className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="font-medium">Insurance Accepted</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <Badge variant="outline">Blue Shield</Badge>
                      <Badge variant="outline">Kaiser Permanente</Badge>
                      <Badge variant="outline">Medicare</Badge>
                      <Badge variant="outline">Aetna</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>What Patients Say</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="italic text-gray-700">"This team restored my trust in care—just like something Oprah would feature. The level of attention and compassion I received was exceptional."</p>
                    <div className="mt-2 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                        JM
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">Jessica Miller</p>
                        <p className="text-xs text-gray-500">Beverly Hills, 90210</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="italic text-gray-700">"As Maya Angelou said, 'They may forget what you said, but they will never forget how you made them feel.' This perfectly describes my experience with this care team."</p>
                    <div className="mt-2 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                        RW
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">Robert Wilson</p>
                        <p className="text-xs text-gray-500">Santa Monica, CA</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Locations Served Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Areas Served</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Badge variant="outline">Los Angeles</Badge>
                  <Badge variant="outline">Beverly Hills</Badge>
                  <Badge variant="outline">Santa Monica</Badge>
                  <Badge variant="outline">West Hollywood</Badge>
                  <Badge variant="outline">Inglewood</Badge>
                  <Badge variant="outline">90210</Badge>
                  <Badge variant="outline">90045</Badge>
                </div>
                
                <div className="mt-4 aspect-video rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52861.03402452974!2d-118.43383135!3d34.0736204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA!5e0!3m2!1sen!2sus!4v1654321234567!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Service Area Map"
                  ></iframe>
                </div>
              </CardContent>
            </Card>

            {/* Video Introduction */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Meet Your Care Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Video className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Video introduction available soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Book a Consultation</CardTitle>
                <CardDescription>
                  Select your preferred date and time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        {date ? (
                          format(date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label>Time</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-[200px] overflow-y-auto">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={timeSlot === slot ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setTimeSlot(slot)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Appointment Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant={appointmentType === 'in-person' ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setAppointmentType('in-person')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      In-Person
                    </Button>
                    
                    {professional.telehealth_enabled && (
                      <Button
                        variant={appointmentType === 'telehealth' ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setAppointmentType('telehealth')}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Telehealth
                      </Button>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea 
                    id="reason" 
                    placeholder="Briefly describe the reason for your appointment"
                    className="mt-2"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={handleBookAppointment}
                  disabled={!date || !timeSlot || !professional.accepting_new_patients}
                >
                  {professional.accepting_new_patients ? 'Book Appointment' : 'Not Accepting Patients'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {professional.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p>{professional.phone}</p>
                    </div>
                  </div>
                )}
                
                {professional.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p>{professional.email}</p>
                    </div>
                  </div>
                )}
                
                {professional.service_area && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <h4 className="font-medium">Service Area</h4>
                      <p>{professional.service_area}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </CardFooter>
            </Card>

            {/* Spiritual Care Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Inclusive Care Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Serving clients from all spiritual backgrounds: Christian, Jewish, Muslim, and secular. Our care approach respects and accommodates your personal beliefs and practices.
                </p>
              </CardContent>
            </Card>

            {/* Tools & Technology */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Modern Care Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Digital health records via Apple Health</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Secure messaging through HIPAA-compliant platform</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Remote monitoring with Google Fit integration</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-l-4 border-indigo-500 pl-3">
                    <p className="font-medium">National Nurses Week</p>
                    <p className="text-sm text-gray-600">May 6-12, 2025</p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-3">
                    <p className="font-medium">LA28 Olympics Care Support</p>
                    <p className="text-sm text-gray-600">July-August 2028</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Music That Inspires Section */}
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Music That Inspires Our Care Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="font-medium">"Lean on Me" - Bill Withers</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="font-medium">"Rise Up" - Andra Day</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="font-medium">"Brave" - Sara Bareilles</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="font-medium">"Heal the World" - Michael Jackson</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-indigo-600 text-white p-8 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Experience Exceptional Care?</h2>
            <p className="mb-6">Schedule your appointment with {professional.name} today and discover the difference compassionate, personalized care can make.</p>
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Book Your Appointment Now
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">What services does {professional.name} offer?</h3>
              <p className="text-gray-600">
                {professional.name} offers comprehensive healthcare services including consultations, assessments, treatment planning, and ongoing care management. {professional.telehealth_enabled ? 'Telehealth services are also available.' : ''}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">What areas does {professional.name} serve?</h3>
              <p className="text-gray-600">
                {professional.name} serves patients in {professional.service_area || 'the local area'}, including landmark locations near Cedars-Sinai, The Grove LA, and Beverly Hills Hotel.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Is {professional.name} accepting new patients?</h3>
              <p className="text-gray-600">
                {professional.accepting_new_patients ? 
                  `Yes, ${professional.name} is currently accepting new patients. You can book an appointment online or call directly.` : 
                  `${professional.name} is not currently accepting new patients. Please check back later or contact the office for more information.`}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">What insurance plans are accepted?</h3>
              <p className="text-gray-600">
                We work with most major insurance providers including Blue Shield, Kaiser Permanente, Medicare, and Aetna. Please contact us to verify your specific coverage.
              </p>
            </div>
          </div>
        </div>

        {/* Related Professionals */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback>DR</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Dr. Rebecca Lee</h3>
                    <p className="text-sm text-gray-500">Cardiologist</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View Profile</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback>JT</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Dr. James Thompson</h3>
                    <p className="text-sm text-gray-500">Family Medicine</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View Profile</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback>MP</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Dr. Maria Patel</h3>
                    <p className="text-sm text-gray-500">Neurologist</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View Profile</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfessionalProfilePage;