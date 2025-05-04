
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pill, CircleCheck, Clock, Search, CircleChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import useToolAccess from "@/hooks/useToolAccess";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  refills_remaining: number;
  last_filled?: string;
  is_controlled: boolean;
}

interface PharmacyOption {
  id: string;
  name: string;
  delivery_available?: boolean;
}

const refillFormSchema = z.object({
  medication_id: z.string().min(1, "Please select a medication"),
  pharmacy_id: z.string().min(1, "Please select a pharmacy"),
  delivery_type: z.string().optional(),
  notes: z.string().optional(),
});

type RefillFormValues = z.infer<typeof refillFormSchema>;

const PrescriptionManagement = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [pharmacies, setPharmacies] = useState<PharmacyOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refillDialogOpen, setRefillDialogOpen] = useState(false);
  const { profile } = useAuth();
  const { hasAccess: hasDeliveryAccess } = useToolAccess('prescription_delivery');
  const { hasAccess: hasDroneDeliveryAccess } = useToolAccess('drone_delivery');

  const form = useForm<RefillFormValues>({
    resolver: zodResolver(refillFormSchema),
    defaultValues: {
      notes: "",
    },
  });

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        if (!profile) return;
        
        const { data: medicationsData, error: medicationsError } = await supabase
          .from('medications')
          .select('*')
          .eq('profile_id', profile.id);
          
        if (medicationsError) throw medicationsError;
        
        setMedications(medicationsData || []);
        
        // Fetch pharmacies
        const { data: pharmaciesData, error: pharmaciesError } = await supabase
          .from('pharmacies')
          .select('id, name, delivery_available')
          .eq('status', 'active');
          
        if (pharmaciesError) throw pharmaciesError;
        
        setPharmacies(pharmaciesData || []);
        
      } catch (error) {
        console.error('Error fetching medications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your medications',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedications();
  }, [profile]);
  
  const onSubmitRefillRequest = async (values: RefillFormValues) => {
    try {
      if (!profile) return;
      
      const selectedMedication = medications.find(med => med.id === values.medication_id);
      if (!selectedMedication) {
        throw new Error("Medication not found");
      }

      // Create refill request
      const { data: refillData, error: refillError } = await supabase
        .from('refill_requests')
        .insert({
          patient_id: profile.id,
          medication_id: values.medication_id,
          status: 'pending',
          delivery_type: values.delivery_type || 'pickup',
          notes: values.notes,
        })
        .select();
        
      if (refillError) throw refillError;
      
      // Close dialog
      setRefillDialogOpen(false);
      
      // Show success message
      toast({
        title: 'Refill Requested',
        description: 'Your prescription refill request has been submitted.',
      });
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error('Error requesting refill:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your refill request',
        variant: 'destructive',
      });
    }
  };

  const getDeliveryOptions = () => {
    const deliveryOptions = [];
    
    if (hasDeliveryAccess) {
      deliveryOptions.push(
        <SelectItem key="standard" value="standard">Standard Delivery (2-3 days)</SelectItem>
      );
      deliveryOptions.push(
        <SelectItem key="express" value="express">Express Delivery (Next day)</SelectItem>
      );
    }
    
    if (hasDroneDeliveryAccess) {
      deliveryOptions.push(
        <SelectItem key="drone" value="drone">Drone Delivery (Same day)</SelectItem>
      );
    }
    
    deliveryOptions.push(
      <SelectItem key="pickup" value="pickup">Pickup at Pharmacy</SelectItem>
    );
    
    return deliveryOptions;
  };
  
  if (isLoading) {
    return <div>Loading medications...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Your Medications</h2>
          <p className="text-sm text-muted-foreground">Manage your prescriptions and request refills</p>
        </div>
        <Dialog open={refillDialogOpen} onOpenChange={setRefillDialogOpen}>
          <DialogTrigger asChild>
            <Button>Request Refill</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Medication Refill</DialogTitle>
              <DialogDescription>
                Fill out this form to request a refill of your prescription.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitRefillRequest)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="medication_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select medication" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {medications.map((medication) => (
                            <SelectItem key={medication.id} value={medication.id}>
                              {medication.name} {medication.dosage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pharmacy_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacy</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pharmacy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pharmacies.map((pharmacy) => (
                            <SelectItem key={pharmacy.id} value={pharmacy.id}>
                              {pharmacy.name} {pharmacy.delivery_available ? '(Delivery Available)' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="delivery_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select delivery method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getDeliveryOptions()}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {!hasDeliveryAccess && "Upgrade to Smart Access tier or higher for delivery options"}
                        {hasDeliveryAccess && !hasDroneDeliveryAccess && "Upgrade to VIP for same-day drone delivery"}
                      </FormDescription>
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
                          placeholder="Add any special instructions or notes for your healthcare provider"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="mt-4">
                  <Button type="submit">Submit Refill Request</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {medications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Pill className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Medications Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You don't have any medications in your profile yet.
            </p>
            <Button>Add Medication</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {medications.map((medication) => (
            <Card key={medication.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{medication.name}</CardTitle>
                      <CardDescription>{medication.dosage}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={medication.refills_remaining === 0 ? "outline" : "default"}
                    className={medication.refills_remaining === 0 ? "border-destructive text-destructive" : ""}
                  >
                    {medication.refills_remaining === 0 ? "Refill Needed" : `${medication.refills_remaining} Refills Left`}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Instructions</p>
                    <p className="text-sm text-muted-foreground">{medication.instructions}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Filled</p>
                    <p className="text-sm text-muted-foreground">
                      {medication.last_filled ? 
                        format(new Date(medication.last_filled), "MMMM d, yyyy") : 
                        "Not filled yet"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                    >
                      Medication Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{medication.name} {medication.dosage}</DialogTitle>
                      <DialogDescription>Medication details and history</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium">Instructions</h4>
                          <p className="text-sm text-muted-foreground">{medication.instructions}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Last Filled</h4>
                          <p className="text-sm text-muted-foreground">
                            {medication.last_filled ? 
                              format(new Date(medication.last_filled), "MMMM d, yyyy") : 
                              "Not filled yet"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Refills Remaining</h4>
                        <p className="text-sm text-muted-foreground">{medication.refills_remaining}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Controlled Substance</h4>
                        <p className="text-sm text-muted-foreground">{medication.is_controlled ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  className="flex-1"
                  onClick={() => setRefillDialogOpen(true)}
                  disabled={medication.refills_remaining === 0}
                >
                  Request Refill
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionManagement;
