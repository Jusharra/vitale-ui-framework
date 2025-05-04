
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Car, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Transport } from '@/components/admin/care-teams/useCareTeamsData';

// Form schema for medical transport booking
const formSchema = z.object({
  pickupLocation: z.string().min(5, { message: "Pickup location must be at least 5 characters." }),
  dropoffLocation: z.string().min(5, { message: "Dropoff location must be at least 5 characters." }),
  date: z.date({ required_error: "Please select a date." }),
  time: z.string().min(1, { message: "Please select a time." }),
  transportType: z.string().min(1, { message: "Please select a transport type." }),
  specialRequirements: z.string().optional(),
  transportProvider: z.string().min(1, { message: "Please select a transport provider." }),
});

type TransportFormValues = z.infer<typeof formSchema>;

const MedicalTransportContent: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [transportProviders, setTransportProviders] = useState<Transport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Transport | null>(null);
  
  const form = useForm<TransportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupLocation: "",
      dropoffLocation: "",
      specialRequirements: ""
    },
  });

  // Fetch transport providers from Supabase
  React.useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('transports')
          .select('*')
          .eq('status', 'active')
          .order('name');
        
        if (error) throw error;
        setTransportProviders(data || []);
      } catch (error) {
        console.error('Error fetching transport providers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load transport providers',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [toast]);

  // Handle form submission to proceed to payment
  const onSubmit = (values: TransportFormValues) => {
    console.log("Form values:", values);
    
    // Find the selected provider
    const provider = transportProviders.find(p => p.id === values.transportProvider);
    if (provider) {
      setSelectedProvider(provider);
    }
    
    // Move to the next step (payment)
    setStep(2);
  };

  // Handle payment process (would integrate with Stripe)
  const handlePayment = async () => {
    toast({
      title: "Payment Processing",
      description: "This would connect to Stripe for real payment processing.",
    });
    
    // In a real implementation, you would:
    // 1. Call a Supabase Edge Function to create a Stripe Checkout Session
    // 2. Redirect to the Stripe Checkout page
    // 3. Handle the return from Stripe (success or cancel)
    
    // For now, just show a success message
    setTimeout(() => {
      toast({
        title: "Booking Successful",
        description: "Your transport has been booked successfully!",
        variant: "default",
      });
      // Reset the form and go back to step 1
      form.reset();
      setStep(1);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book Medical Transport</CardTitle>
              <CardDescription>
                Fill in the details to book medical transport services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="pickupLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Location</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Enter pickup address" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dropoffLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dropoff Location</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Enter destination address" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => {
                                const hour = i.toString().padStart(2, '0');
                                return [
                                  <SelectItem key={`${hour}:00`} value={`${hour}:00`}>{`${hour}:00`}</SelectItem>,
                                  <SelectItem key={`${hour}:30`} value={`${hour}:30`}>{`${hour}:30`}</SelectItem>
                                ];
                              }).flat()}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="transportType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transport Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard Vehicle</SelectItem>
                              <SelectItem value="wheelchair">Wheelchair Accessible</SelectItem>
                              <SelectItem value="stretcher">Stretcher Service</SelectItem>
                              <SelectItem value="luxury">Luxury Vehicle</SelectItem>
                              <SelectItem value="ambulance">Non-Emergency Ambulance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="transportProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transport Provider</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoading ? (
                              <SelectItem value="loading" disabled>Loading providers...</SelectItem>
                            ) : transportProviders.length > 0 ? (
                              transportProviders.map((provider) => (
                                <SelectItem key={provider.id} value={provider.id}>
                                  {provider.name} {provider.rating && `(${provider.rating}★)`}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>No providers available</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special needs or requirements for your transport?" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Include any accessibility needs or special instructions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">Continue to Payment</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 2 && selectedProvider && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>
              Complete your booking by making a payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium text-lg">Booking Summary</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider:</span>
                    <span className="font-medium">{selectedProvider.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{format(form.getValues("date"), "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{form.getValues("time")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transport Type:</span>
                    <span className="font-medium">{form.getValues("transportType")}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Price:</span>
                    <span className="font-medium">$75.00</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border p-4 rounded-md bg-white">
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <p className="text-sm text-muted-foreground">
                    This would connect to Stripe for secure payment processing in a real implementation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={handlePayment}>Complete Payment</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default MedicalTransportContent;
