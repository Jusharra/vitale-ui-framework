import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, CreditCard, CheckCircle, AlertTriangle, Phone, Mail, Calendar, Home, Users, Bed, Utensils, Dumbbell } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook

// California counties
const californiaCounties = [
  "Alameda", "Contra Costa", "Los Angeles", "Marin", "Monterey", "Napa", "Orange", 
  "San Diego", "San Francisco", "San Mateo", "Santa Barbara", "Santa Clara", "Ventura"
];

// Texas counties
const texasCounties = [
  "Collin", "Dallas", "Denton", "Fort Bend", "Harris", "Montgomery", 
  "Tarrant", "Travis", "Williamson"
];

// Care types
const careTypes = [
  "Memory Care",
  "Hospice Support",
  "Respite / Short-Term",
  "Long-Term Board & Care",
  "Assisted Living",
  "Independent Living"
];

// Budget ranges
const budgetRanges = [
  "$3,000 - $5,000",
  "$5,000 - $7,000",
  "$7,000 - $10,000",
  "$10,000+"
];

// Facility interface
interface Facility {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  price: string;
  availability: number;
  availabilityStatus: 'high' | 'medium' | 'low';
  image: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  amenities: string[];
  staffRatio: string;
  yearEstablished: string;
  acceptedInsurance: string[];
  virtualTourUrl?: string;
}

const Placements = () => {
  const { toast } = useToast();
  const { user } = useAuth(); // Use the useAuth hook to get the user
  
  // Search states
  const [county, setCounty] = useState("all"); // Initialize with 'all' instead of empty string
  const [location, setLocation] = useState("");
  const [careType, setCareType] = useState("all"); // Initialize with 'all'
  const [budget, setBudget] = useState("all"); // Initialize with 'all'
  
  // Intake form states
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [intakeFormData, setIntakeFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    preferredLocation: "",
    careNeeded: "",
    placementDate: "",
    medicalConditions: "",
    referralSource: ""
  });
  
  // Payment selection states
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<string | null>(null);
  
  // Thank you state
  const [showThankYou, setShowThankYou] = useState(false);
  
  // Facility details modal state
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [showFacilityDetails, setShowFacilityDetails] = useState(false);
  
  // Sample facilities data
  const facilities: Facility[] = [
    {
      id: "1",
      name: "Sunset Gardens Memory Care",
      type: "Memory Care",
      location: "San Mateo County, CA",
      description: "Specialized memory care facility with 24/7 support, secure environment, and personalized care plans.",
      price: "$6,500/month",
      availability: 3,
      availabilityStatus: 'medium',
      image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
      address: "123 Memory Lane, San Mateo, CA 94401",
      phone: "(650) 555-1234",
      email: "info@sunsetgardens.com",
      website: "www.sunsetgardens.com",
      amenities: ["Secure Memory Care Units", "Therapeutic Gardens", "Activity Programs", "Private Rooms", "Family Lounges"],
      staffRatio: "1:5 during day, 1:8 at night",
      yearEstablished: "2010",
      acceptedInsurance: ["Medicare", "Long-term Care Insurance", "Private Pay"],
      virtualTourUrl: "https://example.com/virtual-tour"
    },
    {
      id: "2",
      name: "Oakridge Senior Living",
      type: "Long-Term Board & Care",
      location: "Orange County, CA",
      description: "Luxury senior living community with independent and assisted living options, fine dining, and resort-style amenities.",
      price: "$4,800/month",
      availability: 7,
      availabilityStatus: 'high',
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      address: "456 Oak Boulevard, Newport Beach, CA 92660",
      phone: "(949) 555-6789",
      email: "info@oakridgeliving.com",
      website: "www.oakridgeliving.com",
      amenities: ["Fine Dining", "Swimming Pool", "Fitness Center", "Movie Theater", "Concierge Services"],
      staffRatio: "1:10 during day, 1:15 at night",
      yearEstablished: "2015",
      acceptedInsurance: ["Private Pay", "Long-term Care Insurance"],
      virtualTourUrl: "https://example.com/virtual-tour"
    },
    {
      id: "3",
      name: "Serenity Hospice House",
      type: "Hospice Support",
      location: "Travis County, TX",
      description: "Compassionate end-of-life care in a peaceful setting with private rooms, family accommodations, and 24/7 medical support.",
      price: "Insurance accepted",
      availability: 1,
      availabilityStatus: 'low',
      image: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg",
      address: "789 Peaceful Way, Austin, TX 78701",
      phone: "(512) 555-9012",
      email: "care@serenityhospice.org",
      amenities: ["Private Rooms", "Family Accommodations", "24/7 Medical Support", "Spiritual Care", "Grief Counseling"],
      staffRatio: "1:3 during day, 1:4 at night",
      yearEstablished: "2008",
      acceptedInsurance: ["Medicare", "Medicaid", "Private Insurance", "VA Benefits"]
    },
    {
      id: "4",
      name: "Golden Years Assisted Living",
      type: "Assisted Living",
      location: "Los Angeles County, CA",
      description: "Upscale assisted living community with personalized care plans, luxury amenities, and a vibrant social calendar.",
      price: "$5,200/month",
      availability: 5,
      availabilityStatus: 'medium',
      image: "https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg",
      address: "567 Golden Avenue, Los Angeles, CA 90024",
      phone: "(310) 555-3456",
      email: "info@goldenyears.com",
      website: "www.goldenyears.com",
      amenities: ["24/7 Care Staff", "Restaurant-style Dining", "Wellness Programs", "Transportation Services", "Beauty Salon"],
      staffRatio: "1:8 during day, 1:12 at night",
      yearEstablished: "2012",
      acceptedInsurance: ["Long-term Care Insurance", "Private Pay"]
    },
    {
      id: "5",
      name: "Lakeside Retirement Village",
      type: "Independent Living",
      location: "Collin County, TX",
      description: "Active adult community with lakefront views, independent living cottages, and comprehensive wellness programs.",
      price: "$3,800/month",
      availability: 12,
      availabilityStatus: 'high',
      image: "https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg",
      address: "123 Lakeside Drive, Plano, TX 75024",
      phone: "(972) 555-7890",
      email: "info@lakesideretirement.com",
      website: "www.lakesideretirement.com",
      amenities: ["Independent Cottages", "Clubhouse", "Fitness Center", "Walking Trails", "Community Events"],
      staffRatio: "1:20 during day, on-call at night",
      yearEstablished: "2018",
      acceptedInsurance: ["Private Pay"]
    },
    {
      id: "6",
      name: "Harmony House Memory Care",
      type: "Memory Care",
      location: "Marin County, CA",
      description: "Boutique memory care facility with innovative therapies, garden spaces, and high staff-to-resident ratio.",
      price: "$7,200/month",
      availability: 2,
      availabilityStatus: 'low',
      image: "https://images.pexels.com/photos/3768126/pexels-photo-3768126.jpeg",
      address: "789 Harmony Lane, San Rafael, CA 94901",
      phone: "(415) 555-2345",
      email: "care@harmonyhouse.org",
      website: "www.harmonyhouse.org",
      amenities: ["Memory Care Programs", "Sensory Garden", "Private Suites", "Music Therapy", "Family Support"],
      staffRatio: "1:4 during day, 1:6 at night",
      yearEstablished: "2016",
      acceptedInsurance: ["Long-term Care Insurance", "Private Pay", "Veterans Benefits"]
    }
  ];
  
  // Handle intake form input changes
  const handleIntakeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIntakeFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle intake form submission
  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!intakeFormData.fullName || !intakeFormData.phone || !intakeFormData.email || !intakeFormData.careNeeded) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Show payment options after successful form submission
    setShowIntakeForm(false);
    setShowPaymentOptions(true);
  };
  
  // Handle payment selection
  const handlePaymentSelect = (speed: string) => {
    setSelectedSpeed(speed);
  };
  
  // Handle payment submission
  const handlePaymentSubmit = () => {
    if (!selectedSpeed) {
      toast({
        title: "Please select a placement speed",
        description: "Choose either Standard or Urgent placement",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, this would redirect to Stripe checkout
    // For demo purposes, we'll just show a success message
    
    // Simulate payment processing
    setTimeout(() => {
      setShowPaymentOptions(false);
      setShowThankYou(true);
      
      // Send confirmation email (simulated)
      console.log("Sending confirmation email to:", intakeFormData.email);
      console.log("Intake details:", intakeFormData);
      console.log("Selected speed:", selectedSpeed);
    }, 1000);
  };
  
  // Reset all forms and states
  const resetForms = () => {
    setShowIntakeForm(false);
    setShowPaymentOptions(false);
    setShowThankYou(false);
    setSelectedSpeed(null);
    setIntakeFormData({
      fullName: "",
      phone: "",
      email: "",
      preferredLocation: "",
      careNeeded: "",
      placementDate: "",
      medicalConditions: "",
      referralSource: ""
    });
  };
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would filter results based on search criteria
    console.log("Search criteria:", { county, location, careType, budget });
  };
  
  // Handle view facility details
  const handleViewFacilityDetails = (facility: Facility) => {
    setSelectedFacility(facility);
    setShowFacilityDetails(true);
  };

  return (
    <MainLayout>
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Senior Care Placement Services
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Find the perfect care facility for your loved one with our personalized placement services.
            </p>
          </div>

          {/* Search Section */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Find Care Facilities</CardTitle>
                <CardDescription>
                  Search for care facilities based on your specific needs and location preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="county">County</Label>
                      <Select value={county} onValueChange={setCounty}>
                        <SelectTrigger id="county">
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Counties</SelectItem>
                          <SelectItem value="california" disabled className="font-semibold">California</SelectItem>
                          {californiaCounties.map((county) => (
                            <SelectItem key={county} value={county}>{county} County</SelectItem>
                          ))}
                          <SelectItem value="texas" disabled className="font-semibold">Texas</SelectItem>
                          {texasCounties.map((county) => (
                            <SelectItem key={county} value={county}>{county} County</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">City or Zip Code</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          id="location" 
                          placeholder="Enter city or zip code" 
                          className="pl-9"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="careType">Type of Care</Label>
                      <Select value={careType} onValueChange={setCareType}>
                        <SelectTrigger id="careType">
                          <SelectValue placeholder="Select care type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Care Types</SelectItem>
                          {careTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select value={budget} onValueChange={setBudget}>
                        <SelectTrigger id="budget">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Budget Ranges</SelectItem>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range} value={range}>{range}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" size="lg">
                      <Search className="mr-2 h-4 w-4" />
                      Find Care Options
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    <span className="flex items-center justify-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Results powered by AI for personalized matching
                    </span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Facility Details Modal */}
          <Dialog open={showFacilityDetails} onOpenChange={setShowFacilityDetails}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedFacility && (
                <>
                  <DialogHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <DialogTitle className="text-2xl">{selectedFacility.name}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          {selectedFacility.location}
                        </DialogDescription>
                      </div>
                      <Badge>{selectedFacility.type}</Badge>
                    </div>
                  </DialogHeader>
                  
                  <div className="mt-4">
                    <img 
                      src={selectedFacility.image} 
                      alt={selectedFacility.name} 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">About {selectedFacility.name}</h3>
                        <p className="text-gray-700">{selectedFacility.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedFacility.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Facility Details</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Home className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Address:</span>
                              <span className="text-sm">{selectedFacility.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Established:</span>
                              <span className="text-sm">{selectedFacility.yearEstablished}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Staff Ratio:</span>
                              <span className="text-sm">{selectedFacility.staffRatio}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Phone:</span>
                              <span className="text-sm">{selectedFacility.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Email:</span>
                              <span className="text-sm">{selectedFacility.email}</span>
                            </div>
                            {selectedFacility.website && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">Website:</span>
                                <span className="text-sm">{selectedFacility.website}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {selectedFacility.acceptedInsurance && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Accepted Insurance</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedFacility.acceptedInsurance.map((insurance, index) => (
                              <Badge key={index} variant="outline">{insurance}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Availability</CardTitle>
                          <CardDescription>Current openings and pricing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Price:</span>
                            <span>{selectedFacility.price}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Availability:</span>
                            <Badge 
                              variant={
                                selectedFacility.availabilityStatus === 'high' ? 'default' : 
                                selectedFacility.availabilityStatus === 'medium' ? 'outline' : 
                                'secondary'
                              }
                              className={
                                selectedFacility.availabilityStatus === 'low' ? 'bg-amber-100 text-amber-800' : ''
                              }
                            >
                              {selectedFacility.availability} spots
                            </Badge>
                          </div>
                          
                          <div className="pt-4 border-t">
                            <Button 
                              className="w-full" 
                              onClick={() => {
                                setShowFacilityDetails(false);
                                setShowIntakeForm(true);
                              }}
                            >
                              Request Placement
                            </Button>
                            
                            {selectedFacility.virtualTourUrl && (
                              <Button variant="outline" className="w-full mt-2">
                                Virtual Tour
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="mt-4">
                        <CardHeader>
                          <CardTitle>Contact Facility</CardTitle>
                          <CardDescription>Send a message to the facility</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Textarea 
                            placeholder="Enter your message here..."
                            className="mb-4"
                          />
                          <Button className="w-full">Send Message</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Intake Form Dialog */}
          <Dialog open={showIntakeForm} onOpenChange={setShowIntakeForm}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Care Placement Request</DialogTitle>
                <DialogDescription>
                  Please provide the following information to help us find the best care options for your loved one.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleIntakeSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input 
                      id="fullName" 
                      name="fullName"
                      value={intakeFormData.fullName}
                      onChange={handleIntakeInputChange}
                      placeholder="Enter your full name" 
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={intakeFormData.phone}
                      onChange={handleIntakeInputChange}
                      placeholder="(555) 123-4567" 
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={intakeFormData.email}
                      onChange={handleIntakeInputChange}
                      placeholder="your@email.com" 
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preferredLocation">Preferred City or Zip Code</Label>
                    <Input 
                      id="preferredLocation" 
                      name="preferredLocation"
                      value={intakeFormData.preferredLocation}
                      onChange={handleIntakeInputChange}
                      placeholder="Enter city or zip code" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="careNeeded">Type of Care Needed *</Label>
                    <Select 
                      value={intakeFormData.careNeeded} 
                      onValueChange={(value) => setIntakeFormData(prev => ({...prev, careNeeded: value}))}
                      required
                    >
                      <SelectTrigger id="careNeeded">
                        <SelectValue placeholder="Select care type" />
                      </SelectTrigger>
                      <SelectContent>
                        {careTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="placementDate">Date of Placement Request</Label>
                    <Input 
                      id="placementDate" 
                      name="placementDate"
                      type="date"
                      value={intakeFormData.placementDate}
                      onChange={handleIntakeInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Notes/Medical Conditions</Label>
                  <Textarea 
                    id="medicalConditions" 
                    name="medicalConditions"
                    value={intakeFormData.medicalConditions}
                    onChange={handleIntakeInputChange}
                    placeholder="Please provide any relevant medical conditions or special requirements"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referralSource">How did you hear about us? (optional)</Label>
                  <Input 
                    id="referralSource" 
                    name="referralSource"
                    value={intakeFormData.referralSource}
                    onChange={handleIntakeInputChange}
                    placeholder="Google, friend, doctor, etc." 
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowIntakeForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Continue to Payment
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Payment Options Dialog */}
          <Dialog open={showPaymentOptions} onOpenChange={setShowPaymentOptions}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Select Placement Speed</DialogTitle>
                <DialogDescription>
                  Choose how quickly you need placement services for your loved one.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6">
                <RadioGroup value={selectedSpeed || ""} onValueChange={handlePaymentSelect}>
                  <div className="grid grid-cols-1 gap-6">
                    <div className={`relative flex items-start p-4 rounded-lg border ${selectedSpeed === 'standard' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                      <div className="min-w-0 flex-1 text-sm">
                        <RadioGroupItem value="standard" id="standard" className="absolute h-full w-full inset-0 opacity-0 cursor-pointer" />
                        <div className="font-medium text-gray-900 flex items-center justify-between">
                          <div>
                            <Label htmlFor="standard" className="text-base font-semibold">Standard Placement</Label>
                            <p className="text-gray-500 mt-1">72 hours turnaround time</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold">$1,500</span>
                          </div>
                        </div>
                        <div className="mt-2 text-gray-500">
                          <p>Our standard placement service includes comprehensive facility research, personalized recommendations, and coordination with up to 3 facilities.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`relative flex items-start p-4 rounded-lg border ${selectedSpeed === 'urgent' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                      <div className="min-w-0 flex-1 text-sm">
                        <RadioGroupItem value="urgent" id="urgent" className="absolute h-full w-full inset-0 opacity-0 cursor-pointer" />
                        <div className="font-medium text-gray-900 flex items-center justify-between">
                          <div>
                            <Label htmlFor="urgent" className="text-base font-semibold flex items-center">
                              Urgent Placement
                              <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">Fast-Track</Badge>
                            </Label>
                            <p className="text-gray-500 mt-1">24–48 hours turnaround time</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold">$2,500</span>
                          </div>
                        </div>
                        <div className="mt-2 text-gray-500">
                          <p>Our urgent placement service includes expedited facility research, same-day facility tours when available, and priority coordination with our network of care providers.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
                
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Need urgent placement for a loved one?</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          Choose our 24–48 hour fast-track referral for peace of mind. Our urgent placement service prioritizes your case and provides immediate assistance during this critical time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setShowPaymentOptions(false);
                  setShowIntakeForm(true);
                }}>
                  Back
                </Button>
                <Button onClick={handlePaymentSubmit}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Thank You Dialog */}
          <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">Thank You for Your Request</DialogTitle>
              </DialogHeader>
              
              <div className="py-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="mt-3">
                  <p className="text-lg font-medium text-gray-900">Your placement request has been received</p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {selectedSpeed === 'urgent' 
                        ? "Our placement specialist will contact you within the next 24 hours to discuss your needs."
                        : "Our placement specialist will contact you within the next 72 hours to discuss your needs."}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-500">
                      <p>If you need immediate assistance, please call our concierge line:</p>
                      <p className="font-medium text-gray-900 mt-1">(800) VITALE-HEALTH</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={resetForms} className="w-full">
                  Return to Placement Search
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Featured Facilities Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Care Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Facility 1 */}
              <Card className="overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img 
                    src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg" 
                    alt="Sunset Gardens Memory Care" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">Sunset Gardens Memory Care</CardTitle>
                    <Badge>Memory Care</Badge>
                  </div>
                  <CardDescription>San Mateo County, CA</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Specialized memory care facility with 24/7 support, secure environment, and personalized care plans.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Starting at $6,500/month</span>
                      <span className="text-green-600">3 spots available</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleViewFacilityDetails(facilities[0])}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Facility 2 */}
              <Card className="overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img 
                    src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg" 
                    alt="Oakridge Senior Living" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">Oakridge Senior Living</CardTitle>
                    <Badge>Long-Term Care</Badge>
                  </div>
                  <CardDescription>Orange County, CA</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Luxury senior living community with independent and assisted living options, fine dining, and resort-style amenities.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Starting at $4,800/month</span>
                      <span className="text-green-600">7 spots available</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleViewFacilityDetails(facilities[1])}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Facility 3 */}
              <Card className="overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img 
                    src="https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg" 
                    alt="Serenity Hospice House" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">Serenity Hospice House</CardTitle>
                    <Badge>Hospice Support</Badge>
                  </div>
                  <CardDescription>Travis County, TX</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Compassionate end-of-life care in a peaceful setting with private rooms, family accommodations, and 24/7 medical support.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Insurance accepted</span>
                      <span className="text-amber-600">Limited availability</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleViewFacilityDetails(facilities[2])}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Facility 4 */}
              <Card className="overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img 
                    src="https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg" 
                    alt="Golden Years Assisted Living" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">Golden Years Assisted Living</CardTitle>
                    <Badge>Assisted Living</Badge>
                  </div>
                  <CardDescription>Los Angeles County, CA</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Upscale assisted living community with personalized care plans, luxury amenities, and a vibrant social calendar.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Starting at $5,200/month</span>
                      <span className="text-green-600">5 spots available</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleViewFacilityDetails(facilities[3])}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Facility 5 */}
              <Card className="overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img 
                    src="https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg" 
                    alt="Lakeside Retirement Village" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">Lakeside Retirement Village</CardTitle>
                    <Badge>Independent Living</Badge>
                  </div>
                  <CardDescription>Collin County, TX</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Active adult community with lakefront views, independent living cottages, and comprehensive wellness programs.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Starting at $3,800/month</span>
                      <span className="text-green-600">12 spots available</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleViewFacilityDetails(facilities[4])}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Facility 6 */}
              <Card className="overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img 
                    src="https://images.pexels.com/photos/3768126/pexels-photo-3768126.jpeg" 
                    alt="Harmony House Memory Care" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">Harmony House Memory Care</CardTitle>
                    <Badge>Memory Care</Badge>
                  </div>
                  <CardDescription>Marin County, CA</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Boutique memory care facility with innovative therapies, garden spaces, and high staff-to-resident ratio.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Starting at $7,200/month</span>
                      <span className="text-amber-600">2 spots available</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleViewFacilityDetails(facilities[5])}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="mt-20">
            <div className="lg:text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900">Why Choose Our Placement Services</h2>
              <p className="mt-4 max-w-2xl text-lg text-gray-500 lg:mx-auto">
                We provide personalized care placement services to help you find the perfect solution for your loved one.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Personalized Matching</h3>
                <p className="text-gray-500">
                  Our AI-powered matching system considers over 50 factors to find the perfect care facility for your loved one's unique needs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Time-Saving</h3>
                <p className="text-gray-500">
                  Save countless hours of research and facility visits. We do the legwork for you, presenting only the best options that meet your criteria.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Exclusive Access</h3>
                <p className="text-gray-500">
                  Gain access to our network of premium care facilities, including those with limited availability not advertised to the general public.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mt-20">
            <div className="lg:text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900">What Our Clients Say</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-12 w-12 text-indigo-300" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-base text-gray-600">
                      "I was overwhelmed trying to find memory care for my mother until I found Vitale's placement service. Their urgent placement option was a lifesaver when we needed to move quickly. Within 36 hours, they found the perfect facility that met all our requirements."
                    </p>
                    <div className="mt-4">
                      <p className="text-base font-medium text-gray-900">Jennifer R.</p>
                      <p className="text-sm text-gray-500">Los Angeles, CA</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-12 w-12 text-indigo-300" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-base text-gray-600">
                      "The placement specialists at Vitale Health Concierge were incredibly knowledgeable about facilities in our area. They found options we never would have discovered on our own, and negotiated rates that were better than what was advertised."
                    </p>
                    <div className="mt-4">
                      <p className="text-base font-medium text-gray-900">Michael T.</p>
                      <p className="text-sm text-gray-500">Austin, TX</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-indigo-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Need Help Finding the Right Care?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our placement specialists are ready to help you find the perfect care solution for your loved one. Start your search today or contact us for personalized assistance.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => setShowIntakeForm(true)}>
                Request Placement
              </Button>
              <Button variant="outline" size="lg">
                Contact a Specialist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Placements;