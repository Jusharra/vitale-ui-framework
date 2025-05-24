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
import { Search, MapPin, Clock, CreditCard, CheckCircle, AlertTriangle, Phone, Mail, Calendar, Users, Bed, Star, Heart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Facility data
const facilities = [
  {
    id: 1,
    name: "Sunset Gardens Memory Care",
    type: "Memory Care",
    location: "San Mateo County, CA",
    address: "123 Sunset Blvd, San Mateo, CA 94403",
    description: "Specialized memory care facility with 24/7 support, secure environment, and personalized care plans.",
    longDescription: "Sunset Gardens Memory Care is a premier memory care community designed specifically for individuals living with Alzheimer's disease, dementia, and other memory impairments. Our secure, purpose-built environment promotes independence while providing the specialized care your loved one needs. Our highly trained staff delivers personalized care plans that focus on maintaining dignity, fostering engagement, and enhancing quality of life through innovative memory care programming.",
    price: 6500,
    spotsAvailable: 3,
    image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
    amenities: ["24/7 Specialized Care", "Secure Environment", "Memory Enhancement Programs", "Private Suites", "Chef-Prepared Meals", "Therapeutic Garden"],
    contactName: "Sarah Johnson",
    contactPhone: "(650) 555-1234",
    contactEmail: "info@sunsetgardens.com",
    rating: 4.8,
    reviews: 42,
    virtualTour: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    county: "San Mateo"
  },
  {
    id: 2,
    name: "Oakridge Senior Living",
    type: "Long-Term Care",
    location: "Orange County, CA",
    address: "456 Oak Drive, Newport Beach, CA 92660",
    description: "Luxury senior living community with independent and assisted living options, fine dining, and resort-style amenities.",
    longDescription: "Oakridge Senior Living offers an unparalleled luxury retirement experience in the heart of Newport Beach. Our community features spacious apartments, gourmet dining experiences, and a comprehensive suite of amenities designed for active seniors. With both independent and assisted living options, residents can age in place with dignity while enjoying our resort-style environment. Our professional staff provides personalized care tailored to each resident's unique needs and preferences.",
    price: 4800,
    spotsAvailable: 7,
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    amenities: ["Fine Dining", "Resort-Style Pool", "Fitness Center", "Concierge Services", "Housekeeping", "Transportation Services", "Social Activities"],
    contactName: "Michael Chen",
    contactPhone: "(949) 555-6789",
    contactEmail: "info@oakridgeseniorliving.com",
    rating: 4.9,
    reviews: 68,
    virtualTour: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    county: "Orange"
  },
  {
    id: 3,
    name: "Serenity Hospice House",
    type: "Hospice Support",
    location: "Travis County, TX",
    address: "789 Peaceful Lane, Austin, TX 78701",
    description: "Compassionate end-of-life care in a peaceful setting with private rooms, family accommodations, and 24/7 medical support.",
    longDescription: "Serenity Hospice House provides compassionate, dignified end-of-life care in a tranquil environment designed to comfort both patients and their families. Our facility features private suites with family accommodation areas, allowing loved ones to remain close during this important time. Our specialized medical team provides 24/7 pain management and symptom control, while our emotional and spiritual support staff helps families navigate this challenging journey with grace and understanding.",
    price: 0,
    priceNote: "Insurance accepted",
    spotsAvailable: 1,
    image: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg",
    amenities: ["Private Rooms", "Family Accommodations", "24/7 Medical Support", "Pain Management", "Spiritual Support", "Bereavement Services"],
    contactName: "Dr. Robert Williams",
    contactPhone: "(512) 555-9012",
    contactEmail: "care@serenityhospice.org",
    rating: 4.9,
    reviews: 56,
    virtualTour: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    county: "Travis"
  },
  {
    id: 4,
    name: "Golden Years Assisted Living",
    type: "Assisted Living",
    location: "Los Angeles County, CA",
    address: "1010 Golden Ave, Los Angeles, CA 90024",
    description: "Upscale assisted living community with personalized care plans, luxury amenities, and a vibrant social calendar.",
    longDescription: "Golden Years Assisted Living offers the perfect balance of independence and support in an elegant setting. Our dedicated care staff provides personalized assistance with daily activities while respecting residents' autonomy and preferences. The community features spacious apartments, gourmet dining options, and a rich calendar of social events and cultural outings. Our wellness programs promote physical and mental well-being, ensuring residents enjoy a fulfilling lifestyle in their golden years.",
    price: 5200,
    spotsAvailable: 5,
    image: "https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg",
    amenities: ["Personalized Care Plans", "Medication Management", "Gourmet Dining", "Fitness Center", "Beauty Salon", "Transportation Services"],
    contactName: "Jennifer Lopez",
    contactPhone: "(310) 555-3456",
    contactEmail: "info@goldenyears.com",
    rating: 4.7,
    reviews: 89,
    virtualTour: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    county: "Los Angeles"
  },
  {
    id: 5,
    name: "Lakeside Retirement Village",
    type: "Independent Living",
    location: "Collin County, TX",
    address: "555 Lakeside Drive, Plano, TX 75024",
    description: "Active adult community with lakefront views, independent living cottages, and comprehensive wellness programs.",
    longDescription: "Lakeside Retirement Village is a premier active adult community situated on the shores of beautiful Lake Plano. Our independent living cottages and apartments offer privacy and autonomy while providing access to a vibrant community of like-minded seniors. Residents enjoy our state-of-the-art wellness center, gourmet dining options, and extensive social calendar. With optional services available as needs change, Lakeside provides the perfect setting for an active, engaged retirement lifestyle.",
    price: 3800,
    spotsAvailable: 12,
    image: "https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg",
    amenities: ["Lakefront Views", "Private Cottages", "Wellness Center", "Gourmet Dining", "Social Events", "Gardening Areas"],
    contactName: "David Thompson",
    contactPhone: "(972) 555-7890",
    contactEmail: "info@lakesidevillage.com",
    rating: 4.6,
    reviews: 74,
    virtualTour: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    county: "Collin"
  },
  {
    id: 6,
    name: "Harmony Memory Care",
    type: "Memory Care",
    location: "Santa Clara County, CA",
    address: "222 Harmony Way, Palo Alto, CA 94301",
    description: "Specialized memory care facility with innovative therapies, secure outdoor spaces, and family support programs.",
    longDescription: "Harmony Memory Care is dedicated to providing exceptional care for individuals living with Alzheimer's disease and other forms of dementia. Our innovative approach combines the latest evidence-based therapies with a secure, homelike environment designed to reduce confusion and anxiety. Our specially trained staff delivers personalized care that honors each resident's life story and preferences. Family involvement is encouraged through our comprehensive support programs, education resources, and regular care conferences.",
    price: 7200,
    spotsAvailable: 4,
    image: "https://images.pexels.com/photos/7551741/pexels-photo-7551741.jpeg",
    amenities: ["Secure Memory Gardens", "Innovative Therapies", "Life Enrichment Programs", "Family Support", "Specialized Dining", "24/7 Monitoring"],
    contactName: "Dr. Emily Chang",
    contactPhone: "(650) 555-2345",
    contactEmail: "care@harmonymemorycare.com",
    rating: 4.9,
    reviews: 51,
    virtualTour: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    county: "Santa Clara"
  },
  {
    id: 7,
    name: "Magnolia Gardens",
    type: "Assisted Living",
    location: "Harris County, TX",
    address: "333 Magnolia Blvd, Houston, TX 77024",
    description: "Elegant assisted living community with spacious suites, personalized care, and Southern hospitality.",
    longDescription: "Magnolia Gardens embodies the warmth of Southern hospitality in an elegant assisted living setting. Our spacious suites offer privacy and comfort, while our attentive staff provides personalized assistance with daily activities. Residents enjoy chef-prepared Southern cuisine, engaging social activities, and beautiful garden spaces for relaxation and reflection. Our wellness programs focus on maintaining independence and enhancing quality of life, all within a supportive community atmosphere.",
    price: 4500,
    spotsAvailable: 8,
    image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg",
    amenities: ["Spacious Suites", "Southern Cuisine", "Garden Spaces", "Wellness Programs", "Transportation Services", "24-Hour Assistance"],
    contactName: "Margaret Johnson",
    contactPhone: "(713) 555-8901",
    contactEmail: "welcome@magnoliagardens.com",
    rating: 4.7,
    reviews: 63,
    virtualTour: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    county: "Harris"
  },
  {
    id: 8,
    name: "Pacific Heights Care Center",
    type: "Long-Term Care",
    location: "San Francisco County, CA",
    address: "444 Pacific Avenue, San Francisco, CA 94115",
    description: "Comprehensive long-term care facility with skilled nursing, rehabilitation services, and panoramic city views.",
    longDescription: "Pacific Heights Care Center provides exceptional long-term care and skilled nursing services in the heart of San Francisco. Our facility offers stunning panoramic views of the city and bay, creating an uplifting environment for residents. Our multidisciplinary team includes skilled nurses, therapists, and care specialists who develop comprehensive care plans for each resident. With a focus on both physical health and emotional well-being, we strive to enhance quality of life while providing the highest level of medical care.",
    price: 8500,
    spotsAvailable: 6,
    image: "https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg",
    amenities: ["Skilled Nursing", "Rehabilitation Services", "Panoramic Views", "Specialized Diets", "Therapy Programs", "Social Activities"],
    contactName: "Dr. James Wilson",
    contactPhone: "(415) 555-6789",
    contactEmail: "info@pacificheightscare.com",
    rating: 4.6,
    reviews: 47,
    virtualTour: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    county: "San Francisco"
  },
  {
    id: 9,
    name: "Tranquil Pines Respite Care",
    type: "Respite / Short-Term",
    location: "Marin County, CA",
    address: "555 Pine Road, Mill Valley, CA 94941",
    description: "Short-term respite care in a serene setting, providing caregivers with a break while ensuring quality care for loved ones.",
    longDescription: "Tranquil Pines offers exceptional respite care services in the peaceful surroundings of Mill Valley. Our short-term stays provide family caregivers with a much-needed break while ensuring their loved ones receive professional, compassionate care. Guests enjoy all the amenities and services of our full-time residents, including personalized care plans, engaging activities, and nutritious meals. Our tranquil setting among the redwoods creates a restorative environment for both guests and their families.",
    price: 350,
    priceNote: "per day",
    spotsAvailable: 4,
    image: "https://images.pexels.com/photos/2098405/pexels-photo-2098405.jpeg",
    amenities: ["Short-Term Stays", "Personalized Care", "Medication Management", "Engaging Activities", "Nutritious Meals", "Peaceful Environment"],
    contactName: "Lisa Martinez",
    contactPhone: "(415) 555-9012",
    contactEmail: "respite@tranquilpines.com",
    rating: 4.8,
    reviews: 39,
    virtualTour: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    county: "Marin"
  },
  {
    id: 10,
    name: "Lone Star Senior Living",
    type: "Independent Living",
    location: "Dallas County, TX",
    address: "777 Lone Star Way, Dallas, TX 75201",
    description: "Vibrant independent living community with luxury apartments, chef-prepared meals, and a full calendar of Texas-sized activities.",
    longDescription: "Lone Star Senior Living offers a vibrant, independent lifestyle for active seniors in the heart of Dallas. Our luxury apartments provide privacy and comfort, while our community spaces foster connection and engagement. Residents enjoy chef-prepared meals featuring Texas favorites and international cuisine, a comprehensive wellness program, and a full calendar of social events, cultural outings, and educational opportunities. Our location provides easy access to Dallas's world-class shopping, dining, and entertainment options.",
    price: 3200,
    spotsAvailable: 15,
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    amenities: ["Luxury Apartments", "Chef-Prepared Meals", "Fitness Center", "Social Events", "Transportation Services", "Concierge"],
    contactName: "Robert Johnson",
    contactPhone: "(214) 555-3456",
    contactEmail: "live@lonestarsenior.com",
    rating: 4.7,
    reviews: 82,
    virtualTour: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    county: "Dallas"
  },
  {
    id: 11,
    name: "Coastal Breeze Memory Care",
    type: "Memory Care",
    location: "San Diego County, CA",
    address: "888 Coastal Highway, La Jolla, CA 92037",
    description: "Oceanfront memory care community with specialized programs, secure walking paths, and therapeutic ocean views.",
    longDescription: "Coastal Breeze Memory Care offers a unique therapeutic environment for individuals with memory impairments. Our oceanfront location provides calming views and fresh sea air that have proven beneficial for cognitive well-being. Our purpose-built facility features secure walking paths, sensory gardens, and specially designed living spaces that reduce confusion while promoting independence. Our memory care specialists deliver innovative programs tailored to each resident's cognitive abilities and personal history, focusing on creating moments of joy and connection every day.",
    price: 7800,
    spotsAvailable: 5,
    image: "https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg",
    amenities: ["Oceanfront Views", "Secure Walking Paths", "Sensory Gardens", "Memory Enhancement Programs", "Specialized Dining", "Family Support Groups"],
    contactName: "Dr. Amanda Rivera",
    contactPhone: "(858) 555-7890",
    contactEmail: "care@coastalbreezememory.com",
    rating: 4.9,
    reviews: 45,
    virtualTour: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    county: "San Diego"
  },
  {
    id: 12,
    name: "Hill Country Hospice Retreat",
    type: "Hospice Support",
    location: "Williamson County, TX",
    address: "999 Hill Country Road, Georgetown, TX 78628",
    description: "Peaceful hospice facility nestled in the Texas Hill Country, offering dignified end-of-life care with scenic natural surroundings.",
    longDescription: "Hill Country Hospice Retreat provides compassionate end-of-life care in the serene beauty of the Texas Hill Country. Our facility is designed to create a peaceful, homelike environment where patients and their families can find comfort during a difficult time. Private suites with outdoor views, family gathering spaces, and meditation gardens offer various settings for meaningful moments together. Our specialized medical team provides expert pain management and symptom control, while our emotional and spiritual support staff helps families navigate this journey with dignity and grace.",
    price: 0,
    priceNote: "Medicare and insurance accepted",
    spotsAvailable: 3,
    image: "https://images.pexels.com/photos/2387079/pexels-photo-2387079.jpeg",
    amenities: ["Private Suites", "Family Gathering Spaces", "Meditation Gardens", "Pain Management", "Spiritual Support", "Bereavement Services"],
    contactName: "Dr. Thomas Garcia",
    contactPhone: "(512) 555-2345",
    contactEmail: "care@hillcountryhospice.org",
    rating: 4.9,
    reviews: 37,
    virtualTour: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    county: "Williamson"
  }
];

const Placements = () => {
  const { toast } = useToast();
  
  // Search states
  const [county, setCounty] = useState("all");
  const [location, setLocation] = useState("");
  const [careType, setCareType] = useState("all");
  const [budget, setBudget] = useState("all");
  
  // Facility detail modal state
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilityDetailOpen, setFacilityDetailOpen] = useState(false);
  
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
  const [selectedSpeed, setSelectedSpeed] = useState(null);
  
  // Thank you state
  const [showThankYou, setShowThankYou] = useState(false);
  
  // Contact form state
  const [contactMessage, setContactMessage] = useState("");
  
  // Handle intake form input changes
  const handleIntakeInputChange = (e) => {
    const { name, value } = e.target;
    setIntakeFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle intake form submission
  const handleIntakeSubmit = (e) => {
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
  const handlePaymentSelect = (speed) => {
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
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real implementation, this would filter results based on search criteria
    console.log("Search criteria:", { county, location, careType, budget });
  };
  
  // Handle facility selection
  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
    setFacilityDetailOpen(true);
  };
  
  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    if (!contactMessage.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to send",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Message sent",
      description: "Your message has been sent to the facility administrator",
    });
    
    setContactMessage("");
  };
  
  // Filter facilities based on search criteria
  const filteredFacilities = facilities.filter(facility => {
    // Filter by county
    if (county !== "all" && facility.county !== county) {
      return false;
    }
    
    // Filter by location (city or address)
    if (location && !facility.location.toLowerCase().includes(location.toLowerCase()) && 
        !facility.address.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }
    
    // Filter by care type
    if (careType !== "all" && facility.type !== careType) {
      return false;
    }
    
    // Filter by budget
    if (budget !== "all") {
      const [minStr, maxStr] = budget.replace('$', '').split(' - ');
      const min = parseInt(minStr.replace(',', ''));
      const max = parseInt(maxStr.replace(',', '').replace('+', ''));
      
      if (facility.price < min) return false;
      if (!maxStr.includes('+') && facility.price > max) return false;
    }
    
    return true;
  });

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
                          <SelectItem value="california-group" disabled>California</SelectItem>
                          {californiaCounties.map((county) => (
                            <SelectItem key={county} value={county}>{county} County</SelectItem>
                          ))}
                          <SelectItem value="texas-group" disabled>Texas</SelectItem>
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

          {/* Facility Detail Modal */}
          <Dialog open={facilityDetailOpen} onOpenChange={setFacilityDetailOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedFacility && (
                <>
                  <DialogHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <DialogTitle className="text-2xl">{selectedFacility.name}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          {selectedFacility.address}
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
                  
                  <Tabs defaultValue="overview" className="mt-6">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="amenities">Amenities</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                      <TabsTrigger value="availability">Availability</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">About {selectedFacility.name}</h3>
                          <p className="text-gray-700">{selectedFacility.longDescription}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <span className="ml-1 font-medium">{selectedFacility.rating}</span>
                          </div>
                          <span className="text-gray-500">({selectedFacility.reviews} reviews)</span>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Monthly Cost</h4>
                              {selectedFacility.price > 0 ? (
                                <p className="text-2xl font-bold">${selectedFacility.price.toLocaleString()}</p>
                              ) : (
                                <p className="text-lg">{selectedFacility.priceNote}</p>
                              )}
                            </div>
                            <Button onClick={() => {
                              setFacilityDetailOpen(false);
                              setShowIntakeForm(true);
                            }}>
                              Request Placement
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="amenities" className="mt-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Amenities & Services</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedFacility.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                        
                        {selectedFacility.virtualTour && (
                          <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Virtual Tour</h3>
                            <Button variant="outline" className="w-full">
                              View Virtual Tour
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="contact" className="mt-4">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <User className="h-5 w-5 text-gray-500" />
                              <span>{selectedFacility.contactName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-5 w-5 text-gray-500" />
                              <span>{selectedFacility.contactPhone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-5 w-5 text-gray-500" />
                              <span>{selectedFacility.contactEmail}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold mb-2">Send a Message</h3>
                          <form onSubmit={handleContactSubmit}>
                            <div className="space-y-4">
                              <Textarea 
                                placeholder="Type your message here..." 
                                className="min-h-[120px]"
                                value={contactMessage}
                                onChange={(e) => setContactMessage(e.target.value)}
                                required
                              />
                              <Button type="submit">Send Message</Button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="availability" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Current Availability</h3>
                          <Badge className={selectedFacility.spotsAvailable > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {selectedFacility.spotsAvailable > 0 
                              ? `${selectedFacility.spotsAvailable} spots available` 
                              : "No availability"}
                          </Badge>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <div>
                              <h4 className="font-medium">Typical Wait Time</h4>
                              <p className="text-sm text-gray-500">
                                {selectedFacility.spotsAvailable > 5 
                                  ? "Immediate availability" 
                                  : selectedFacility.spotsAvailable > 0 
                                    ? "1-2 weeks" 
                                    : "2-3 months"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-gray-500" />
                            <div>
                              <h4 className="font-medium">Resident Population</h4>
                              <p className="text-sm text-gray-500">
                                {selectedFacility.type === "Memory Care" 
                                  ? "Specialized memory care for individuals with Alzheimer's and dementia" 
                                  : selectedFacility.type === "Assisted Living"
                                    ? "Seniors needing assistance with daily activities"
                                    : selectedFacility.type === "Independent Living"
                                      ? "Active seniors seeking community living"
                                      : "Individuals requiring specialized care"}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <Button 
                            className="w-full"
                            onClick={() => {
                              setFacilityDetailOpen(false);
                              setShowIntakeForm(true);
                            }}
                          >
                            Request Placement at {selectedFacility.name}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Featured Facilities Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Care Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredFacilities.slice(0, 6).map((facility) => (
                <Card key={facility.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-200">
                    <img 
                      src={facility.image} 
                      alt={facility.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{facility.name}</CardTitle>
                      <Badge>{facility.type}</Badge>
                    </div>
                    <CardDescription>{facility.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {facility.description}
                      </p>
                      <div className="flex justify-between text-sm">
                        {facility.price > 0 ? (
                          <span>Starting at ${facility.price.toLocaleString()}/month</span>
                        ) : (
                          <span>{facility.priceNote}</span>
                        )}
                        <span className={facility.spotsAvailable > 0 ? "text-green-600" : "text-amber-600"}>
                          {facility.spotsAvailable > 0 
                            ? `${facility.spotsAvailable} spots available` 
                            : "Limited availability"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => handleFacilitySelect(facility)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {filteredFacilities.length > 6 && (
              <div className="mt-8 text-center">
                <Button variant="outline" size="lg">
                  View All {filteredFacilities.length} Facilities
                </Button>
              </div>
            )}
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