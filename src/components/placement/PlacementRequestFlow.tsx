import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CheckCircle, AlertTriangle, ArrowRight, CreditCard, Loader2 } from 'lucide-react';

// Schema for placement request form
const placementRequestSchema = z.object({
  // Step 1: Urgency Selection
  urgency: z.enum(["standard", "expedited"], {
    required_error: "Please select an urgency level",
  }),
  
  // Step 2: Intake Form
  fullName: z.string().min(2, { message: "Full name is required" }).optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, { message: "Phone number is required" }).optional(),
  careNeeds: z.string().min(5, { message: "Please describe care needs" }).optional(),
  location: z.string().min(2, { message: "Location is required" }).optional(),
  notes: z.string().optional(),
});

export type PlacementRequestFormValues = z.infer<typeof placementRequestSchema>;

interface PlacementRequestFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facilityId?: string;
  facilityName?: string;
}

const PlacementRequestFlow: React.FC<PlacementRequestFlowProps> = ({
  open,
  onOpenChange,
  facilityId,
  facilityName,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Initialize form
  const form = useForm<PlacementRequestFormValues>({
    resolver: zodResolver(placementRequestSchema),
    defaultValues: {
      urgency: "standard",
      fullName: "",
      email: user?.email || "",
      phone: "",
      careNeeds: "",
      location: "",
      notes: "",
    },
    mode: "onChange"
  });
  
  // Watch the urgency field to determine if payment is needed
  const urgency = form.watch("urgency");
  const isExpedited = urgency === "expedited";
  
  // Handle form submission for each step
  const onSubmit = async (values: PlacementRequestFormValues) => {
    console.log("Form submitted with values:", values);
    
    if (step === 1) {
      // Move to step 2 (intake form)
      setStep(2);
      return;
    }
    
    if (step === 2) {
      if (isExpedited) {
        // Move to step 3 (payment) if expedited
        setStep(3);
        return;
      } else {
        // Submit the form directly if standard
        await submitPlacementRequest(values);
      }
    }
    
    if (step === 3) {
      // Process payment and submit form
      await processPaymentAndSubmit(values);
    }
  };
  
  // Submit placement request to database
  const submitPlacementRequest = async (values: PlacementRequestFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create a placement request record
      const { data, error } = await supabase
        .from('placement_requests')
        .insert({
          user_id: user?.id,
          facility_id: facilityId,
          full_name: values.fullName,
          email: values.email,
          phone: values.phone,
          care_needs: values.careNeeds,
          location: values.location,
          notes: values.notes,
          urgency_level: values.urgency,
          status: 'new',
          deposit_paid: isExpedited,
          deposit_amount: isExpedited ? 497 : 0,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Placement request submitted",
        description: isExpedited 
          ? "Your expedited placement request has been received. A concierge agent will contact you within 24 hours."
          : "Your placement request has been received. A concierge agent will contact you within 72-96 hours.",
      });
      
      // Set complete state
      setIsComplete(true);
      
      // Reset form after submission
      form.reset();
      
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
  
  // Process payment with Stripe and submit form
  const processPaymentAndSubmit = async (values: PlacementRequestFormValues) => {
    setIsPaymentProcessing(true);
    
    try {
      // In a real implementation, this would call a Supabase Edge Function to create a Stripe Checkout session
      // For now, we'll simulate a successful payment
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // After successful payment, submit the placement request
      await submitPlacementRequest(values);
      
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPaymentProcessing(false);
    }
  };
  
  // Handle dialog close
  const handleClose = () => {
    // Reset form and step when dialog is closed
    form.reset();
    setStep(1);
    setIsComplete(false);
    onOpenChange(false);
  };
  
  // Render step content
  const renderStepContent = () => {
    if (isComplete) {
      return (
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Request Submitted Successfully</h3>
          <p className="text-gray-600 mb-6">
            {isExpedited 
              ? "Your expedited placement request has been received. A concierge agent will contact you within 24 hours."
              : "Your placement request has been received. A concierge agent will contact you within 72-96 hours."}
          </p>
          <Button onClick={handleClose}>Close</Button>
        </div>
      );
    }
    
    switch (step) {
      case 1:
        return (
          <Form {...form}>
            <form id="urgency-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select Placement Urgency</FormLabel>
                    <FormDescription>
                      Choose the timeline that best fits your needs
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-4"
                      >
                        <div className="flex items-start space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="standard" id="standard" className="mt-1" />
                          <div className="grid gap-1.5">
                            <Label htmlFor="standard" className="font-medium flex items-center">
                              Standard Placement (72–96 hours)
                              <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">No Fee</Badge>
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Our team will review your needs and match you with appropriate facilities within 3-4 days.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer border-indigo-200 bg-indigo-50/50">
                          <RadioGroupItem value="expedited" id="expedited" className="mt-1" />
                          <div className="grid gap-1.5">
                            <Label htmlFor="expedited" className="font-medium flex items-center">
                              Expedited Concierge Matching (24–48 hours)
                              <Badge className="ml-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-100">$497 Deposit</Badge>
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Fast-track your case with priority matching, 24/7 concierge support, and exclusive perks.
                            </p>
                            <div className="mt-2 bg-indigo-100 p-3 rounded-md">
                              <p className="text-sm text-indigo-800">
                                <strong>Concierge Benefits Include:</strong>
                              </p>
                              <ul className="text-sm text-indigo-700 mt-1 space-y-1">
                                <li className="flex items-center">
                                  <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                                  Priority matching with top facilities
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                                  24/7 dedicated concierge support
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                                  Exclusive perks package for caregivers
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                                  Complimentary moving assistance
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4 flex justify-end">
                <Button type="submit">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        );
        
      case 2:
        return (
          <Form {...form}>
            <form id="intake-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State or Zip Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="careNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Care Needs</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select care needs" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="memory_care">Memory Care</SelectItem>
                        <SelectItem value="assisted_living">Assisted Living</SelectItem>
                        <SelectItem value="independent_living">Independent Living</SelectItem>
                        <SelectItem value="skilled_nursing">Skilled Nursing</SelectItem>
                        <SelectItem value="respite_care">Respite Care</SelectItem>
                        <SelectItem value="hospice">Hospice</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please share any special considerations or requirements" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : isExpedited ? (
                    <>
                      Continue to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Placement Request Summary</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-500">Name:</div>
                <div>{form.getValues("fullName")}</div>
                
                <div className="text-gray-500">Email:</div>
                <div>{form.getValues("email")}</div>
                
                <div className="text-gray-500">Phone:</div>
                <div>{form.getValues("phone")}</div>
                
                <div className="text-gray-500">Location:</div>
                <div>{form.getValues("location")}</div>
                
                <div className="text-gray-500">Care Needs:</div>
                <div>{form.getValues("careNeeds")}</div>
                
                <div className="text-gray-500">Urgency:</div>
                <div className="flex items-center">
                  <Badge className="bg-indigo-100 text-indigo-800">Expedited</Badge>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Payment Details</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your $497 concierge deposit unlocks expedited placement services and premium benefits.
              </p>
              
              <div className="bg-indigo-50 p-3 rounded-md mb-4">
                <p className="text-sm text-indigo-800 font-medium">Concierge Benefits Include:</p>
                <ul className="text-sm text-indigo-700 mt-1 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                    24-48 hour expedited placement
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                    Dedicated concierge agent
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                    Priority facility matching
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                    Exclusive perks package
                  </li>
                </ul>
              </div>
              
              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Concierge Deposit</p>
                  <p className="text-sm text-gray-500">One-time payment</p>
                </div>
                <p className="font-bold text-lg">$497.00</p>
              </div>
              
              <div className="mt-6">
                <Button 
                  className="w-full flex items-center justify-center" 
                  onClick={() => form.handleSubmit(onSubmit)()}
                  disabled={isPaymentProcessing}
                >
                  {isPaymentProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay $497 & Submit Request
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Secure payment processed by Stripe
                </p>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(2)} disabled={isPaymentProcessing}>
                Back
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isComplete 
              ? "Request Submitted" 
              : step === 1 
                ? "Request Placement" 
                : step === 2 
                  ? "Placement Details" 
                  : "Complete Payment"}
          </DialogTitle>
          <DialogDescription>
            {isComplete 
              ? "Thank you for your placement request" 
              : facilityName 
                ? `Request placement at ${facilityName}` 
                : "Find the perfect assisted living facility for your loved one"}
          </DialogDescription>
        </DialogHeader>
        
        {!isComplete && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                1
              </div>
              <div className={`h-1 w-12 ${
                step > 1 ? "bg-indigo-600" : "bg-gray-200"
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                2
              </div>
              {isExpedited && (
                <>
                  <div className={`h-1 w-12 ${
                    step > 2 ? "bg-indigo-600" : "bg-gray-200"
                  }`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 3 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    3
                  </div>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Step {step} of {isExpedited ? 3 : 2}
            </div>
          </div>
        )}
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PlacementRequestFlow;