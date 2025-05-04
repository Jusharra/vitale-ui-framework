
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  refills_remaining: number;
  last_filled?: string;
  is_controlled: boolean;
}

interface RefillRequest {
  id: string;
  medication_id: string;
  status: 'pending' | 'approved' | 'denied';
  request_date: string;
  delivery_type: 'mail' | 'pickup' | 'drone';
  notes?: string;
}

// Schema for refill request form
const refillRequestSchema = z.object({
  medication_id: z.string().min(1, { message: "Please select a medication" }),
  delivery_type: z.string().min(1, { message: "Please select a delivery method" }),
  notes: z.string().optional(),
});

type RefillRequestFormValues = z.infer<typeof refillRequestSchema>;

const PrescriptionManagement = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<RefillRequestFormValues>({
    resolver: zodResolver(refillRequestSchema),
    defaultValues: {
      medication_id: "",
      delivery_type: "mail",
      notes: "",
    },
  });

  useEffect(() => {
    const fetchMedications = async () => {
      setIsLoading(true);
      try {
        const { data: medsData, error: medsError } = await supabase
          .from('medications')
          .select('*')
          .order('name');
          
        if (medsError) throw medsError;
        
        const { data: reqData, error: reqError } = await supabase
          .from('refill_requests')
          .select('*')
          .order('request_date', { ascending: false });
          
        if (reqError) throw reqError;
        
        setMedications(medsData || []);
        setRefillRequests(reqData || []);
      } catch (error) {
        console.error('Error fetching prescriptions data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load prescription information',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedications();
  }, [toast]);
  
  const onSubmitRefillRequest = async (values: RefillRequestFormValues) => {
    try {
      const { medication_id, delivery_type, notes } = values;
      
      const { data, error } = await supabase
        .from('refill_requests')
        .insert({
          medication_id,
          delivery_type,
          notes,
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setRefillRequests(prev => [data, ...prev]);
      form.reset();
      setOpenDialog(false);
      
      toast({
        title: 'Refill Requested',
        description: 'Your prescription refill has been requested.',
      });
    } catch (error) {
      console.error('Error submitting refill request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit refill request',
        variant: 'destructive',
      });
    }
  };
  
  const getMedicationById = (id: string): Medication | undefined => {
    return medications.find(med => med.id === id);
  };
  
  if (isLoading) {
    return <div>Loading prescriptions...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Prescriptions</TabsTrigger>
          <TabsTrigger value="refills">Refill Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">My Prescriptions</h3>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button>Request Refill</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Prescription Refill</DialogTitle>
                  <DialogDescription>
                    Select a prescription to refill and your preferred delivery method.
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
                              {medications.map(med => (
                                <SelectItem 
                                  key={med.id} 
                                  value={med.id}
                                  disabled={med.refills_remaining <= 0}
                                >
                                  {med.name} {med.dosage} ({med.refills_remaining} refills left)
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
                              <SelectItem value="mail">Mail Delivery</SelectItem>
                              <SelectItem value="pickup">Pharmacy Pickup</SelectItem>
                              <SelectItem value="drone">Drone Delivery (VIP)</SelectItem>
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
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Any special instructions" {...field} />
                          </FormControl>
                          <FormDescription>
                            Add any specific instructions for your refill request
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">Submit Request</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {medications.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {medications.map((medication) => (
                <Card key={medication.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">{medication.name}</CardTitle>
                        <CardDescription>{medication.dosage}</CardDescription>
                      </div>
                      <div>
                        {medication.is_controlled && (
                          <Badge variant="destructive">Controlled</Badge>
                        )}
                        {medication.refills_remaining > 0 ? (
                          <Badge variant="secondary" className="ml-2">
                            {medication.refills_remaining} refills left
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="ml-2">No refills</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">{medication.instructions}</p>
                    {medication.last_filled && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last filled: {format(new Date(medication.last_filled), "PPP")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-medium">No Active Prescriptions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You don't have any active prescriptions.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="refills" className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Refill Requests</h3>
          
          {refillRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {refillRequests.map((request) => {
                const medication = getMedicationById(request.medication_id);
                return (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="text-lg">{medication?.name}</CardTitle>
                          <CardDescription>{medication?.dosage}</CardDescription>
                        </div>
                        <div>
                          {request.status === 'pending' && (
                            <Badge variant="outline">Pending</Badge>
                          )}
                          {request.status === 'approved' && (
                            <Badge variant="default">Approved</Badge>
                          )}
                          {request.status === 'denied' && (
                            <Badge variant="destructive">Denied</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium">Requested</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(request.request_date), "PPP")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Delivery Method</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {request.delivery_type}
                          </p>
                        </div>
                      </div>
                      {request.notes && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Notes</p>
                          <p className="text-sm text-muted-foreground">{request.notes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-2">
                      {request.status === 'approved' && (
                        <Button variant="outline" className="w-full sm:w-auto">
                          Track Delivery
                        </Button>
                      )}
                      {request.status === 'pending' && (
                        <Button variant="outline" className="w-full sm:w-auto" disabled>
                          Awaiting Approval
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-medium">No Refill Requests</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You don't have any pending or completed refill requests.
                </p>
                <Button variant="outline" onClick={() => setOpenDialog(true)}>
                  Request a Refill
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrescriptionManagement;
