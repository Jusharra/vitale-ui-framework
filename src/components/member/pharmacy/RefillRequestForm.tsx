
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Medication, RefillRequestFormValues } from './types';

// Schema for refill request form
const refillRequestSchema = z.object({
  medication_id: z.string().min(1, { message: "Please select a medication" }),
  delivery_type: z.string().min(1, { message: "Please select a delivery method" }),
  notes: z.string().optional(),
});

interface RefillRequestFormProps {
  medications: Medication[];
  onSubmit: (values: RefillRequestFormValues) => Promise<boolean>;
  onSuccess: () => void;
}

const RefillRequestForm: React.FC<RefillRequestFormProps> = ({ medications, onSubmit, onSuccess }) => {
  const form = useForm<RefillRequestFormValues>({
    resolver: zodResolver(refillRequestSchema),
    defaultValues: {
      medication_id: "",
      delivery_type: "mail",
      notes: "",
    },
  });

  const handleSubmit = async (values: RefillRequestFormValues) => {
    const success = await onSubmit(values);
    if (success) {
      form.reset();
      onSuccess();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Request Prescription Refill</DialogTitle>
        <DialogDescription>
          Select a prescription to refill and your preferred delivery method.
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
  );
};

export default RefillRequestForm;
