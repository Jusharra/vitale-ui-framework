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
import { MapPin, Phone, Mail, Calendar as CalendarIcon, Clock, Star, CheckCircle, MessageSquare, Video, User, Award, Stethoscope } from 'lucide-react';

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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'telehealth'>('in-person');
  
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

  if (!professional) {
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

  return (
    <MainLayout>
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
                <AvatarImage src={professional.profile_image} alt={professional.name} />
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
                    <span>{professional.service_area}</span>
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
                  Book Appointment
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
                  <p className="text-gray-700">{professional.bio}</p>
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
                        Face-to-face appointments at the provider's office or your location.
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
                          Virtual appointments via secure video conferencing.
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
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfessionalProfilePage;