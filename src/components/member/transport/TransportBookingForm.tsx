
import React from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Transport } from '@/components/admin/care-teams/useCareTeamsData';
import useToolAccess from '@/hooks/useToolAccess';

// Form schema for medical transport booking
export const transportFormSchema = z.object({
  pickupLocation: z.string().min(5, { message: "Pickup location must be at least 5 characters." }),
  dropoffLocation: z.string().min(5, { message: "Dropoff location must be at least 5 characters." }),
  date: z.date({ required_error: "Please select a date." }),
  time: z.string().min(1, { message: "Please select a time." }),
  transportType: z.string().min(1, { message: "Please select a transport type." }),
  specialRequirements: z.string().optional(),
  transportProvider: z.string().min(1, { message: "Please select a transport provider." }),
});

export type TransportFormValues = z.infer<typeof transportFormSchema>;

interface TransportBookingFormProps {
  transportProviders: Transport[];
  isLoading: boolean;
  onSubmit: (values: TransportFormValues) => void;
}

const TransportBookingForm: React.FC<TransportBookingFormProps> = ({ 
  transportProviders, 
  isLoading, 
  onSubmit 
}) => {
  const { hasAccess: hasVipTransport } = useToolAccess('vip_transport');
  
  const form = useForm<TransportFormValues>({
    resolver: zodResolver(transportFormSchema),
    defaultValues: {
      pickupLocation: "",
      dropoffLocation: "",
      specialRequirements: ""
    },
  });

  return (
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
                    {hasVipTransport && (
                      <>
                        <SelectItem value="luxury">Luxury Vehicle</SelectItem>
                        <SelectItem value="ambulance">Non-Emergency Ambulance</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {!hasVipTransport && (
                  <FormDescription>
                    Upgrade to VIP for luxury vehicle and non-emergency ambulance options
                  </FormDescription>
                )}
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
  );
};

export default TransportBookingForm;
