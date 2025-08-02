import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import CaregiverInterestForm from '@/components/auth/CaregiverInterestForm';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ArrowRight, Building, Users, FileCheck, MessageSquare, UserPlus, DollarSign, Calendar, Clock, Star, Heart } from 'lucide-react';

const Partners = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("facilities");
  const [formData, setFormData] = useState({
    facilityName: '',
    contactPerson: '',
    phone: '',
    email: '',
    cityState: '',
    receiveAgreement: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      receiveAgreement: checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Application Received",
        description: "Thank you for your interest. We'll be in touch shortly.",
      });
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="bg-white py-12">
        {/* Enhanced Hero Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Partner With Us to Transform Healthcare
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a care facility or an individual caregiver, join our premium network and connect with families seeking quality care options.
            </p>
          </div>
        </div>

        {/* Partnership Types Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="facilities" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Care Facilities
              </TabsTrigger>
              <TabsTrigger value="caregivers" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Individual Caregivers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="facilities" className="mt-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">
                  Premium Exposure. Verified Referrals. Concierge-Level Support.
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                  We're not another public directory or broker service. We are a placement concierge platform designed for quality-first communities and private clients.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <Building className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Community Visibility</h3>
                  <p className="text-gray-600">Exclusive listings that showcase your facility to qualified families</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <Users className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Verified Leads</h3>
                  <p className="text-gray-600">Quality opportunities from families in your region seeking care</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <FileCheck className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Referral Integrity</h3>
                  <p className="text-gray-600">Transparent process with concierge protection for your community</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <MessageSquare className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Digital Support</h3>
                  <p className="text-gray-600">Custom media assets and communication tools for your team</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="caregivers" className="mt-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">
                  Build Your Client Base. Set Your Schedule. Grow Your Business.
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                  Join our vetted directory of professional caregivers for just $25/month and connect with families seeking trusted care providers in your area.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-100 p-4 rounded-full mb-4">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Earn More</h3>
                  <p className="text-gray-600">Connect with clients willing to pay premium rates for quality care</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-100 p-4 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Flexible Schedule</h3>
                  <p className="text-gray-600">Choose your availability and work when it suits your lifestyle</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-100 p-4 rounded-full mb-4">
                    <Star className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Professional Growth</h3>
                  <p className="text-gray-600">Build your reputation with verified reviews and testimonials</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-100 p-4 rounded-full mb-4">
                    <UserPlus className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Client Matching</h3>
                  <p className="text-gray-600">Get matched with families based on your skills and location</p>
                </div>
              </div>

              {/* Caregiver Benefits Section */}
              <div className="bg-green-50 rounded-lg p-8 mt-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Why Caregivers Choose Our Directory</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-500 text-white">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-lg font-medium text-gray-900">Vetted Clients</h4>
                      <p className="text-gray-600">All families are screened for serious care needs and payment ability</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-500 text-white">
                        <Clock className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-lg font-medium text-gray-900">No Competition</h4>
                      <p className="text-gray-600">Limited caregivers per area ensures quality opportunities for all</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-500 text-white">
                        <DollarSign className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-lg font-medium text-gray-900">Affordable Entry</h4>
                      <p className="text-gray-600">Just $25/month with no setup fees or long-term contracts</p>
                    </div>
                  </div>
                </div>
                
                {/* Caregiver Interest Form */}
                <div className="bg-white rounded-lg p-8 mt-8 border border-gray-200">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Join Our Caregiver Directory
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Start with your basic information to begin the registration process
                    </p>
                  </div>
                  <CaregiverInterestForm />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>


        {/* Sneak Peek Section */}
        <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Here's a Hint of What We Build for Our Partners
              </h2>
            </div>
            
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                <CarouselItem>
                  <div className="p-1">
                    <img 
                      src="https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg" 
                      alt="Tailored profile listing example" 
                      className="w-full h-80 object-cover rounded-lg shadow-md"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="p-1">
                    <img 
                      src="https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg" 
                      alt="Branded facility highlight page" 
                      className="w-full h-80 object-cover rounded-lg shadow-md"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="p-1">
                    <img 
                      src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg" 
                      alt="Secure communication tools" 
                      className="w-full h-80 object-cover rounded-lg shadow-md"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="p-1">
                    <img 
                      src="https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg" 
                      alt="Family support platform" 
                      className="w-full h-80 object-cover rounded-lg shadow-md"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="font-medium">Tailored profile listings that convert</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="font-medium">Branded facility highlight pages</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="font-medium">Secure communication tools</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="font-medium">Family support platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partnership Agreement Teaser */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-indigo-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              We believe in clear communication and ethical placement relationships.
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              To unlock the full program, we'll send over a simple Partnership Agreement and show you how we track referrals for you.
            </p>
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => document.getElementById('partner-form').scrollIntoView({ behavior: 'smooth' })}
            >
              Request a Discovery Call
            </Button>
          </div>
        </div>

        {/* Partner Form - Only show for Care Facilities tab */}
        {activeTab === "facilities" && (
          <div id="partner-form" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Apply to Become a Partner Community
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Fill out the form below to start the conversation.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Application Received</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for your interest in partnering with Vitale Health Concierge. One of our partnership specialists will contact you within 1-2 business days to schedule your discovery call.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsSubmitted(false)}
                    >
                      Submit Another Application
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label htmlFor="facilityName">Facility Name</Label>
                        <Input 
                          id="facilityName" 
                          name="facilityName" 
                          value={formData.facilityName}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input 
                          id="contactPerson" 
                          name="contactPerson" 
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            type="tel" 
                            value={formData.phone}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="cityState">City/State</Label>
                        <Input 
                          id="cityState" 
                          name="cityState" 
                          value={formData.cityState}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="receiveAgreement" 
                          checked={formData.receiveAgreement}
                          onCheckedChange={handleCheckboxChange}
                        />
                        <Label htmlFor="receiveAgreement" className="text-sm">
                          I'd like to receive the agreement and media upload link.
                        </Label>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Testimonials */}
        <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">What Our Partners Say</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Facility Testimonials */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                      SC
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-base text-gray-600">
                      "Partnering with Vitale Health Concierge has transformed our approach to new resident acquisition. The quality of referrals and the concierge support for families has been exceptional."
                    </p>
                    <div className="mt-4">
                      <p className="text-base font-medium text-gray-900">Sarah Collins</p>
                      <p className="text-sm text-gray-500">Executive Director, Oakridge Senior Living</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                      MJ
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-base text-gray-600">
                      "The digital assets and custom profile page Vitale created for our community have significantly improved our online presence. Their concierge approach ensures families are well-prepared when they arrive for tours."
                    </p>
                    <div className="mt-4">
                      <p className="text-base font-medium text-gray-900">Michael Johnson</p>
                      <p className="text-sm text-gray-500">Marketing Director, Sunset Gardens Memory Care</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Caregiver Testimonials */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
                      ER
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-base text-gray-600">
                      "Since joining the directory, I've connected with 3 long-term clients who value quality care. The $25/month investment has paid for itself many times over."
                    </p>
                    <div className="mt-4">
                      <p className="text-base font-medium text-gray-900">Elena Rodriguez</p>
                      <p className="text-sm text-gray-500">Certified Home Health Aide</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
                      DT
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-base text-gray-600">
                      "What I love most is the professional approach. Families are already screened and serious about finding quality care. It saves me so much time compared to other platforms."
                    </p>
                    <div className="mt-4">
                      <p className="text-base font-medium text-gray-900">David Thompson</p>
                      <p className="text-sm text-gray-500">Licensed Practical Nurse</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Facility FAQs */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the facility partnership process work?</h3>
              <p className="text-gray-600">
                After your application, we'll schedule a discovery call to understand your community and needs. We'll then provide a partnership agreement and set up your digital profile on our platform.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What types of facilities do you work with?</h3>
              <p className="text-gray-600">
                We partner with assisted living communities, memory care facilities, board and care homes, hospice providers, and other senior living options that meet our quality standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How are facility referrals handled?</h3>
              <p className="text-gray-600">
                Our concierge team carefully matches families with appropriate communities based on needs, preferences, and location. We provide warm introductions and coordinate tours when appropriate.
              </p>
            </div>

            {/* Caregiver FAQs */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I join the caregiver directory?</h3>
              <p className="text-gray-600">
                Start by completing our caregiver registration form. We'll review your qualifications and background, then set up your subscription and profile listing in our directory.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What qualifications do I need?</h3>
              <p className="text-gray-600">
                We require relevant certifications (CNA, HHA, CPR, etc.), verifiable experience in caregiving, background check clearance, and professional references from previous clients or employers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How much can I earn as a caregiver?</h3>
              <p className="text-gray-600">
                Rates vary by location, experience, and specialties. Our caregivers typically earn $20-40+ per hour, with many building long-term client relationships that provide steady income.
              </p>
            </div>

            {/* General FAQs */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-gray-400">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What regions do you currently serve?</h3>
              <p className="text-gray-600">
                We currently operate in select counties throughout California and Texas, with plans to expand to additional states in the near future.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-gray-400">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there ongoing support available?</h3>
              <p className="text-gray-600">
                Yes! We provide dedicated support to both facility partners and caregivers, including training resources, best practices guidance, and assistance with client matching.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-gray-400">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do you ensure quality matches?</h3>
              <p className="text-gray-600">
                We use detailed profiles, location matching, specialty requirements, and availability preferences to connect families with the most suitable care providers or facilities.
              </p>
            </div>
          </div>
        </div>

        {/* Final Dual CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Transform Your Healthcare Journey?
            </h2>
            <p className="mt-4 text-xl text-indigo-100 max-w-3xl mx-auto">
              Whether you're a care facility or an individual caregiver, join our premium network and start connecting with families today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-indigo-50"
                onClick={() => document.getElementById('partner-form').scrollIntoView({ behavior: 'smooth' })}
              >
                <Building className="mr-2 h-5 w-5" />
                Partner Your Facility
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-transparent border-white text-white hover:bg-white hover:text-indigo-600"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Join as Caregiver
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Join Our Caregiver Directory</DialogTitle>
                    <DialogDescription>
                      Get listed in our premium directory for just $25/month and connect with families in your area.
                    </DialogDescription>
                  </DialogHeader>
                  <CaregiverInterestForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Partners;