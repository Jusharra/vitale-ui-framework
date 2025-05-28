import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SimplePlacementFormProps {
  facilityId?: string;
  facilityName?: string;
  onSuccess?: () => void;
}

const SimplePlacementForm: React.FC<SimplePlacementFormProps> = ({
  facilityId,
  facilityName,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    careNeeds: '',
    location: '',
    notes: '',
    urgencyLevel: 'standard'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.careNeeds || !formData.location) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('placement_requests')
        .insert({
          user_id: user?.id,
          facility_id: facilityId,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          care_needs: formData.careNeeds,
          location: formData.location,
          notes: formData.notes,
          urgency_level: formData.urgencyLevel,
          status: 'new',
          deposit_paid: formData.urgencyLevel === 'expedited',
          deposit_amount: formData.urgencyLevel === 'expedited' ? 497 : 0,
        });
      
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Request submitted successfully",
        description: formData.urgencyLevel === 'expedited' 
          ? "Your expedited placement request has been received. A concierge agent will contact you within 24 hours."
          : "Your placement request has been received. A concierge agent will contact you within 72-96 hours.",
      });
      
      // Set submitted state
      setIsSubmitted(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting placement request:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-lg font-medium">Application Received</h3>
          <p className="text-muted-foreground mb-4">
            {formData.urgencyLevel === 'expedited' 
              ? "Your expedited placement request has been received. A concierge agent will contact you within 24 hours."
              : "Your placement request has been received. A concierge agent will contact you within 72-96 hours."}
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                fullName: '',
                email: '',
                phone: '',
                careNeeds: '',
                location: '',
                notes: '',
                urgencyLevel: 'standard'
              });
            }}
          >
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Placement Assistance</CardTitle>
        <CardDescription>
          {facilityName 
            ? `Request placement at ${facilityName}` 
            : "Tell us about your placement needs and we'll match you with the perfect care community"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="urgencyLevel">Urgency Level</Label>
              <RadioGroup 
                value={formData.urgencyLevel} 
                onValueChange={(value) => handleSelectChange('urgencyLevel', value)}
                className="mt-2 space-y-3"
              >
                <div className="flex items-start space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <RadioGroupItem value="standard" id="standard" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="standard" className="font-medium flex items-center">
                      Standard Placement (72–96 hours)
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">No Fee</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Our team will review your needs and match you with appropriate facilities within 3-4 days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <RadioGroupItem value="expedited" id="expedited" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="expedited" className="font-medium flex items-center">
                      Expedited Concierge Matching (24–48 hours)
                      <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">$497 Deposit</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Fast-track your case with priority matching, 24/7 concierge support, and exclusive perks.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name*</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number*</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="location">Preferred Location*</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State or Zip Code"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="careNeeds">Care Needs*</Label>
              <Select 
                value={formData.careNeeds} 
                onValueChange={(value) => handleSelectChange('careNeeds', value)}
              >
                <SelectTrigger id="careNeeds">
                  <SelectValue placeholder="Select care needs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="memory_care">Memory Care</SelectItem>
                  <SelectItem value="assisted_living">Assisted Living</SelectItem>
                  <SelectItem value="independent_living">Independent Living</SelectItem>
                  <SelectItem value="skilled_nursing">Skilled Nursing</SelectItem>
                  <SelectItem value="respite_care">Respite Care</SelectItem>
                  <SelectItem value="hospice">Hospice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Please share any special considerations or requirements"
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimplePlacementForm;